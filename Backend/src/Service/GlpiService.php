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

            return $response->toArray();
        } finally {
            // On s'assure de fermer la session même s'il y a eu une erreur
            $this->killSession();
        }
    }
}
