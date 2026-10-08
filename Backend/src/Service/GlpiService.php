<?php

namespace App\Service;

use Symfony\Contracts\HttpClient\HttpClientInterface;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\HttpException;

class GlpiService
{
    private ?string $sessionToken = null;

    public function __construct(
        private readonly HttpClientInterface $httpClient,
        private readonly string $glpiApiUrl,
        private readonly string $glpiAppToken,
        private readonly string $glpiUserToken,
    ) {
    }

    private function initSession(): string
    {
        if ($this->sessionToken !== null) {
            return $this->sessionToken;
        }

        $response = $this->httpClient->request('GET', $this->glpiApiUrl . '/initSession', [
            'headers' => [
                'App-Token' => $this->glpiAppToken,
                'Authorization' => 'user_token ' . $this->glpiUserToken,
            ],
        ]);

        if ($response->getStatusCode() !== 200) {
            throw new HttpException($response->getStatusCode(), 'Erreur lors de l\'initialisation de la session GLPI: ' . $response->getContent(false));
        }

        $data = $response->toArray();
        $this->sessionToken = $data['session_token'] ?? null;

        if (!$this->sessionToken) {
            throw new \Exception('Token de session GLPI non reçu.');
        }

        return $this->sessionToken;
    }

    public function killSession(): void
    {
        if ($this->sessionToken === null) {
            return;
        }

        try {
            $this->httpClient->request('GET', $this->glpiApiUrl . '/killSession', [
                'headers' => [
                    'Session-Token' => $this->sessionToken,
                    'App-Token' => $this->glpiAppToken,
                ],
            ]);
        } catch (\Exception $e) {
            // Ignore error on killSession
        } finally {
            $this->sessionToken = null;
        }
    }

    /**
     * Liste des ordinateurs du parc, telle que GLPI la connaît.
     *
     * GLPI n'envoie pas une liste nue : `GET /Computer` répond
     * `{"computers": [...], "total": N}`. La méthode déballe donc cet
     * enveloppe et renvoie le tableau des machines. Sans cela, les appelants
     * reçoivent le dictionnaire et le comptent ou le parcourent comme une
     * liste : `count()` renvoyait le nombre de clés de premier niveau (2) au
     * lieu du nombre de machines, et `.map()` levait une erreur.
     *
     * @return array<int, array<string, mixed>>
     */
    public function getComputers(): array
    {
        try {
            $sessionToken = $this->initSession();

            $response = $this->httpClient->request('GET', $this->glpiApiUrl . '/Computer', [
                'headers' => [
                    'Session-Token' => $sessionToken,
                    'App-Token' => $this->glpiAppToken,
                ],
                'query' => [
                    'expand_dropdowns' => 'true'
                ]
            ]);

            if ($response->getStatusCode() !== 200 && $response->getStatusCode() !== 206) {
                 throw new HttpException($response->getStatusCode(), 'Erreur lors de la récupération des ordinateurs GLPI');
            }

            $payload = $response->toArray();

            // GLPI encapsule la liste sous la clé `computers`. On accepte
            // aussi une liste nue, au cas où l'endpoint changerait de forme,
            // mais on ne renvoie jamais l'enveloppe entière.
            if (isset($payload['computers']) && is_array($payload['computers'])) {
                return $payload['computers'];
            }

            return array_is_list($payload) ? $payload : [];
        } finally {
            // On s'assure de fermer la session même s'il y a eu une erreur
            $this->killSession();
        }
    }

    /**
     * Récupère les détails matériels (CPU, RAM, OS, Disque) d'un ordinateur.
     * 
     * @param int $id L'ID GLPI de l'ordinateur
     * @return array<string, mixed>
     */
    public function getComputerDetails(int $id): array
    {
        try {
            $sessionToken = $this->initSession();

            $endpoints = [
                'processor' => "/Computer/{$id}/Item_DeviceProcessor",
                'memory' => "/Computer/{$id}/Item_DeviceMemory",
                'os' => "/Computer/{$id}/Item_OperatingSystem",
                'harddrive' => "/Computer/{$id}/Item_DeviceHardDrive",
            ];

            $details = [];

            foreach ($endpoints as $key => $endpoint) {
                try {
                    $response = $this->httpClient->request('GET', $this->glpiApiUrl . $endpoint, [
                        'headers' => [
                            'Session-Token' => $sessionToken,
                            'App-Token' => $this->glpiAppToken,
                        ],
                        'query' => [
                            'expand_dropdowns' => 'true'
                        ]
                    ]);
                    
                    if ($response->getStatusCode() === 200 || $response->getStatusCode() === 206) {
                        $details[$key] = $response->toArray();
                    } else {
                        $details[$key] = [];
                    }
                } catch (\Exception $e) {
                    $details[$key] = [];
                }
            }

            return $details;
        } finally {
            $this->killSession();
        }
    }
}
