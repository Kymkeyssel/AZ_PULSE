<?php

namespace App\Controller;

use App\Entity\Enrollment;
use App\Entity\Tuition;
use App\Entity\CourseSession;
use App\Entity\Grade;
use App\Entity\StudentSubmission;
use App\Entity\CourseDocument;
use App\Entity\Course;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;

#[Route('/api/dashboard/apprenant', name: 'api_dashboard_apprenant_')]
class ApprenantDashboardController extends AbstractController
{
    #[Route('', name: 'index', methods: ['GET'])]
    public function index(EntityManagerInterface $em, UserInterface $user): JsonResponse
    {
        // 1. Identité & Progression (Enrollment)
        $enrollment = $em->getRepository(Enrollment::class)->findOneBy(['student' => $user], ['id' => 'DESC']);
        // Simulation: Vérifier si un relevé de notes est publié (Bordereaux)
        // Dans la vraie vie, vérifier si une entité GradeSheet / ReportCard est publiée pour cet étudiant.
        $bordereauxPublished = false;

        $programData = null;
        if ($enrollment) {
            $programData = [
                'programName' => $enrollment->getPromotion()->getProgram()->getName(),
                'promotionName' => $enrollment->getPromotion()->getName(),
                'progress' => $enrollment->getProgress(),
                'validatedModules' => $enrollment->getValidatedModules(),
                'totalModules' => $enrollment->getTotalModules(),
                'nextMilestone' => $enrollment->getNextMilestone(),
                'status' => $enrollment->getStatus(),
                'bordereauxPublished' => $bordereauxPublished,
            ];
        }

        // 2. Gestion Financière (Tuition)
        $tuition = $em->getRepository(Tuition::class)->findOneBy(['student' => $user], ['id' => 'DESC']);
        $financialData = null;
        if ($tuition) {
            // Calcul d'une date d'échéance bidon pour la démo (ex: dans 15 jours si non payé)
            $nextDeadline = ($tuition->getPaidTranches() < $tuition->getTotalTranches()) ? (new \DateTime('+15 days'))->format('Y-m-d H:i') : null;
            // Calcul fictif d'un montant en retard (ex: pour simuler un impayé)
            $overdueAmount = ($tuition->getPaidTranches() == 0 && $tuition->getTotalTranches() > 0) ? 50000 : 0;
            
            $financialData = [
                'totalAmount' => $tuition->getTotalAmount(),
                'remainingBalance' => $tuition->getRemainingBalance(),
                'totalTranches' => $tuition->getTotalTranches(),
                'paidTranches' => $tuition->getPaidTranches(),
                'status' => ($tuition->getPaidTranches() >= $tuition->getTotalTranches()) ? 'Solde réglé' : ($tuition->getPaidTranches() . '/' . $tuition->getTotalTranches() . ' Payées'),
                'nextDeadline' => $nextDeadline,
                'amountDue' => ($tuition->getTotalAmount() / $tuition->getTotalTranches()), // montant de la tranche
                'overdueAmount' => $overdueAmount
            ];
        }

        // 3. Emploi du temps (CourseSession) - Récupérer les sessions à venir
        // Pour la démo, on prend toutes les sessions triées par startTime
        $sessions = $em->getRepository(CourseSession::class)->findBy([], ['startTime' => 'ASC'], 5);
        $scheduleData = [];
        foreach ($sessions as $session) {
            $scheduleData[] = [
                'course' => $session->getCourse()->getTitle(),
                'room' => $session->getRoom(),
                'teacher' => $session->getCourse()->getTeacher() ? $session->getCourse()->getTeacher()->getFirstName() . ' ' . $session->getCourse()->getTeacher()->getLastName() : 'N/A',
                'startTime' => $session->getStartTime()->format('Y-m-d H:i'),
                'endTime' => $session->getEndTime()->format('H:i'),
                'isLive' => ($session->getStartTime() <= new \DateTime() && $session->getEndTime() >= new \DateTime()),
            ];
        }

        // 4. Dernières notes (Grade)
        $grades = $em->getRepository(Grade::class)->findBy(['student' => $user], ['createdAt' => 'DESC'], 3);
        $gradesData = [];
        foreach ($grades as $grade) {
            $gradesData[] = [
                'course' => $grade->getCourse()->getTitle(),
                'teacher' => $grade->getCourse()->getTeacher() ? $grade->getCourse()->getTeacher()->getFirstName() . ' ' . $grade->getCourse()->getTeacher()->getLastName() : 'N/A',
                'score' => $grade->getScore(),
                'comment' => $grade->getComment(),
                'date' => $grade->getCreatedAt()->format('Y-m-d'),
            ];
        }

        // 5. Devoirs en attente (StudentSubmission)
        $submissions = $em->getRepository(StudentSubmission::class)->findBy(['student' => $user, 'status' => 'PENDING'], ['id' => 'ASC'], 3);
        $tasksData = [];
        foreach ($submissions as $sub) {
            $tasksData[] = [
                'title' => $sub->getAssignment()->getTitle(),
                'description' => $sub->getAssignment()->getDescription(),
                'dueDate' => $sub->getAssignment()->getDueDate() ? $sub->getAssignment()->getDueDate()->format('Y-m-d H:i') : null,
                'coefficient' => $sub->getAssignment()->getCoefficient(),
                'formatRequired' => $sub->getAssignment()->getFormatRequired(),
            ];
        }

        // 6. Documents récents (CourseDocument)
        $documents = $em->getRepository(CourseDocument::class)->findBy([], ['createdAt' => 'DESC'], 4);
        $docsData = [];
        foreach ($documents as $doc) {
            $docsData[] = [
                'title' => $doc->getTitle(),
                'type' => $doc->getType(),
                'size' => $doc->getSizeStr(),
                'url' => $doc->getFileUrl(),
                'uploadedBy' => $doc->getUploadedBy() ? $doc->getUploadedBy()->getFirstName() . ' ' . $doc->getUploadedBy()->getLastName() : 'N/A',
                'course' => $doc->getCourse()->getTitle(),
            ];
        }

        return $this->json([
            'program' => $programData,
            'financial' => $financialData,
            'schedule' => $scheduleData,
            'grades' => $gradesData,
            'tasks' => $tasksData,
            'documents' => $docsData,
        ]);
    }

    #[Route('/upload', name: 'upload', methods: ['POST'])]
    public function uploadFile(Request $request, EntityManagerInterface $em, UserInterface $user): JsonResponse
    {
        $file = $request->files->get('file');
        $type = $request->request->get('type', 'document');
        
        if (!$file) {
            return $this->json(['message' => 'Aucun fichier reçu.'], 400);
        }

        $uploadsDir = $this->getParameter('kernel.project_dir') . '/public/uploads';
        $filename = uniqid() . '.' . $file->guessExtension();

        try {
            $file->move($uploadsDir, $filename);
        } catch (\Exception $e) {
            return $this->json(['message' => 'Erreur lors de la sauvegarde: ' . $e->getMessage()], 500);
        }

        // Sauvegarde en BD en fonction du type
        if ($type === 'document' || $type === 'submission') {
            $doc = new CourseDocument();
            $doc->setTitle($file->getClientOriginalName());
            $doc->setType($file->guessExtension() ?? 'file');
            
            // Format file size
            $bytes = filesize($uploadsDir.'/'.$filename);
            $size = round($bytes / 1024, 2) . ' Ko';
            if ($bytes > 1024 * 1024) {
                $size = round($bytes / (1024 * 1024), 2) . ' Mo';
            }
            $doc->setSizeStr($size);
            
            $doc->setFileUrl('/uploads/' . $filename);
            $doc->setUploadedBy($user);
            
            $course = $em->getRepository(Course::class)->findOneBy([]);
            if ($course) {
                $doc->setCourse($course);
            }
            
            $em->persist($doc);
            $em->flush();
        }

        return $this->json([
            'message' => 'Fichier téléversé avec succès',
            'filename' => $filename,
            'url' => '/uploads/' . $filename
        ]);
    }

    #[Route('/download/{filename}', name: 'download', methods: ['GET'])]
    public function downloadFile(string $filename): BinaryFileResponse|JsonResponse
    {
        $filePath = $this->getParameter('kernel.project_dir') . '/public/uploads/' . $filename;
        
        if (!file_exists($filePath)) {
            // Check dummy static files if needed or return 404
            return $this->json(['message' => 'Fichier introuvable.'], 404);
        }

        $response = new BinaryFileResponse($filePath);
        $response->setContentDisposition(
            ResponseHeaderBag::DISPOSITION_ATTACHMENT,
            $filename
        );

        return $response;
    }
}
