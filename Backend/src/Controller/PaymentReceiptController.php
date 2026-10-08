<?php

namespace App\Controller;

use App\Entity\PaymentReceipt;
use App\Entity\Tuition;
use App\Entity\User;
use App\Event\TuitionPaymentReceivedEvent;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Contracts\EventDispatcher\EventDispatcherInterface;

#[Route('/api/academy/payments', name: 'api_academy_payments_')]
class PaymentReceiptController extends AbstractController
{
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(EntityManagerInterface $em): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $repo = $em->getRepository(PaymentReceipt::class);

        if ($this->isGranted('formation.manage')) {
            $receipts = $repo->findBy([], ['createdAt' => 'DESC']);
        } elseif ($user->hasRoleCode('APPRENANT')) {
            $tuition = $em->getRepository(Tuition::class)->findOneBy(['student' => $user]);
            $receipts = $tuition ? $repo->findBy(['tuition' => $tuition], ['createdAt' => 'DESC']) : [];
        } elseif ($user->hasRoleCode('PARENT')) {
            $receipts = [];
            foreach ($user->getChildren() as $child) {
                $tuition = $em->getRepository(Tuition::class)->findOneBy(['student' => $child]);
                if ($tuition) {
                    $receipts = array_merge($receipts, $repo->findBy(['tuition' => $tuition], ['createdAt' => 'DESC']));
                }
            }
        } else {
            return $this->json(['success' => false, 'error' => 'Access Denied'], 403);
        }

        return $this->json(['success' => true, 'data' => array_map(fn (PaymentReceipt $r) => $this->serialize($r), $receipts)]);
    }

    #[Route('', name: 'deposit', methods: ['POST'])]
    public function deposit(Request $request, EntityManagerInterface $em, SluggerInterface $slugger): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $file = $request->files->get('file');
        if (!$file) {
            return $this->json(['success' => false, 'error' => 'Justificatif manquant.'], 400);
        }

        $studentId = $request->request->get('student_id');
        $student = $user;
        if ($studentId && ($this->isGranted('formation.manage') || $user->hasRoleCode('PARENT'))) {
            $student = $em->getRepository(User::class)->find($studentId) ?? $user;
        }

        $tuition = $em->getRepository(Tuition::class)->findOneBy(['student' => $student], ['id' => 'DESC']);
        if (!$tuition) {
            return $this->json(['success' => false, 'error' => 'Aucun échéancier de scolarité pour cet apprenant.'], 404);
        }

        $dir = $this->getParameter('kernel.project_dir') . '/var/storage/payments';
        if (!is_dir($dir)) {
            mkdir($dir, 0777, true);
        }

        $safe = $slugger->slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME));
        $filename = $safe . '-' . uniqid() . '.' . $file->guessExtension();
        $file->move($dir, $filename);

        $receipt = new PaymentReceipt();
        $receipt->setTuition($tuition);
        $receipt->setAmount((float) ($request->request->get('amount') ?: 0));
        $receipt->setReference($request->request->get('reference'));
        $receipt->setDocumentUrl($filename);
        $receipt->setStatus('PENDING');

        $em->persist($receipt);
        $em->flush();

        return $this->json(['success' => true, 'data' => $this->serialize($receipt)], 201);
    }

    #[Route('/{id}/validate', name: 'validate', methods: ['POST'])]
    public function validate(PaymentReceipt $receipt, EntityManagerInterface $em, EventDispatcherInterface $dispatcher): JsonResponse
    {
        if (!$this->isGranted('formation.manage')) {
            return $this->json(['success' => false, 'error' => 'Access Denied'], 403);
        }

        if ($receipt->getStatus() === 'VALIDATED') {
            return $this->json(['success' => true, 'data' => $this->serialize($receipt)]);
        }

        $receipt->setStatus('VALIDATED');
        $tuition = $receipt->getTuition();
        if ($tuition) {
            $tuition->setPaidTranches($tuition->getPaidTranches() + 1);
            $remaining = max(0, $tuition->getRemainingBalance() - $receipt->getAmount());
            $tuition->setRemainingBalance($remaining);
        }
        $em->flush();

        $dispatcher->dispatch(
            (new TuitionPaymentReceivedEvent($tuition, $receipt))->withActor($this->getUser()),
            TuitionPaymentReceivedEvent::NAME
        );

        return $this->json(['success' => true, 'data' => $this->serialize($receipt)]);
    }

    #[Route('/{id}/reject', name: 'reject', methods: ['POST'])]
    public function reject(PaymentReceipt $receipt, EntityManagerInterface $em): JsonResponse
    {
        if (!$this->isGranted('formation.manage')) {
            return $this->json(['success' => false, 'error' => 'Access Denied'], 403);
        }

        $receipt->setStatus('REJECTED');
        $em->flush();

        return $this->json(['success' => true, 'data' => $this->serialize($receipt)]);
    }

    private function serialize(PaymentReceipt $receipt): array
    {
        $student = $receipt->getTuition()?->getStudent();

        return [
            'id' => $receipt->getId()?->toRfc4122(),
            'amount' => $receipt->getAmount(),
            'status' => $receipt->getStatus(),
            'reference' => $receipt->getReference(),
            'documentUrl' => $receipt->getDocumentUrl(),
            'createdAt' => $receipt->getCreatedAt()?->format(\DateTimeInterface::ATOM),
            'student' => $student?->getFullName(),
            'studentEmail' => $student?->getEmail(),
        ];
    }
}
