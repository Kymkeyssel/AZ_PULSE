<?php

namespace App\Controller;

use App\Entity\Notification;
use App\Entity\User;
use App\Repository\NotificationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * File de notifications de l'utilisateur connecté.
 *
 * Toutes les routes sont scopées à l'utilisateur courant : une notification
 * appartient à une personne, on ne lit donc jamais celle d'un autre. Le contrôle
 * passe par `$this->getUser()`, jamais par un identifiant fourni dans l'URL —
 * c'est ce qui évite qu'un `GET /api/notifications/42` permette de lire la
 * notification d'un collègue en changeant le numéro.
 *
 * Cette API ne permet que de lire et de marquer comme lu. Rien ne permet de
 * créer, modifier ni supprimer une notification : cela appartient aux abonnés,
 * et laisser une écriture ici autoriserait n'importe quel utilisateur à
 * fabriquer des messages au nom de la plateforme.
 */
#[Route('/api/notifications')]
class NotificationController extends AbstractController
{
    public function __construct(
        private readonly NotificationRepository $notifications
    ) {
    }

    #[Route('', name: 'api_notifications_list', methods: ['GET'])]
    public function list(Request $request): JsonResponse
    {
        $user = $this->currentUser();

        $result = $this->notifications->paginateFor(
            $user,
            max(1, $request->query->getInt('page', 1)),
            $request->query->getInt('limit', 20),
            $request->query->getBoolean('unread')
        );

        return $this->json([
            'success'   => true,
            'data'      => array_map([$this, 'format'], $result['items']),
            'meta'      => [
                'page'        => $result['page'],
                'limit'       => $result['limit'],
                'total'       => $result['total'],
                'pages'       => $result['pages'],
                'unreadCount' => $this->notifications->countUnreadFor($user),
            ],
        ]);
    }

    /**
     * Compteur de la cloche.
     *
     * Requête distincte de la liste : la cloche s'affiche sur toutes les pages,
     * alors que la liste n'est ouverte que lorsqu'on la consulte. Réutiliser
     * `/api/notifications` ferait charger toute la file à chaque navigation.
     */
    #[Route('/unread-count', name: 'api_notifications_unread_count', methods: ['GET'])]
    public function unreadCount(): JsonResponse
    {
        return $this->json([
            'success' => true,
            'data'    => ['count' => $this->notifications->countUnreadFor($this->currentUser())],
        ]);
    }

    #[Route('/{id}/read', name: 'api_notifications_mark_read', methods: ['POST'])]
    public function markRead(int $id, EntityManagerInterface $em): JsonResponse
    {
        $notification = $this->findOwn($id);

        // `markAsRead()` est idempotent : marquer deux fois ne réécrit pas
        // l'horodatage de première lecture.
        $notification->markAsRead();
        $em->flush();

        return $this->json([
            'success' => true,
            'data'    => $this->format($notification),
        ]);
    }

    /**
     * Marque toute la file comme lue.
     *
     * Le nombre réellement traité est renvoyé : le bouton annonce « tout marquer
     * comme lu » et l'interface peut donc afficher une confirmation exacte
     * plutôt que de laisser croire que les notifications disparues ont été
     * traitées alors qu'elles l'étaient déjà.
     */
    #[Route('/read-all', name: 'api_notifications_mark_all_read', methods: ['POST'])]
    public function markAllRead(): JsonResponse
    {
        $user = $this->currentUser();
        $updated = $this->notifications->markAllAsReadFor($user);

        return $this->json([
            'success' => true,
            'data'    => [
                'updated'     => $updated,
                'unreadCount' => 0,
            ],
        ]);
    }

    /**
     * Récupère une notification en vérifiant qu'elle appartient à l'appelant.
     *
     * Une notification appartenant à quelqu'un d'autre répond 404, pas 403 : on
     * ne confirme pas l'existence d'une donnée qui n'est pas la sienne.
     */
    private function findOwn(int $id): Notification
    {
        $notification = $this->notifications->find($id);

        if ($notification === null
            || (string) $notification->getRecipient()->getId() !== (string) $this->currentUser()->getId()
        ) {
            throw $this->createNotFoundException('Notification introuvable.');
        }

        return $notification;
    }

    /**
     * @return array<string, mixed>
     */
    private function format(Notification $n): array
    {
        return [
            'id'        => $n->getId(),
            'type'      => $n->getType(),
            'title'     => $n->getTitle(),
            'body'      => $n->getBody(),
            'link'      => $n->getLink(),
            'severity'  => $n->getSeverity(),
            'isRead'    => $n->isRead(),
            'readAt'    => $n->getReadAt()?->format(\DateTimeInterface::ATOM),
            'createdAt' => $n->getCreatedAt()->format(\DateTimeInterface::ATOM),
        ];
    }

    private function currentUser(): User
    {
        return $this->getUser();
    }
}
