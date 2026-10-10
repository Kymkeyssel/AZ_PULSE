<?php

namespace App\Controller;

use App\Entity\Course;
use App\Entity\CourseSession;
use App\Entity\Grade;
use App\Entity\Assignment;
use App\Entity\StudentSubmission;
use App\Entity\CourseDocument;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/academy', name: 'api_academy_')]
#[IsGranted('formation.read')]
class AcademyController extends AbstractController
{
    #[Route('/courses', name: 'courses_list', methods: ['GET'])]
    public function listCourses(EntityManagerInterface $em): JsonResponse
    {
        $courses = $em->getRepository(Course::class)->findAll();
        
        $data = [];
        foreach ($courses as $c) {
            $data[] = [
                'id' => $c->getId(),
                'title' => $c->getTitle(),
                'description' => $c->getDescription(),
                'teacher' => $c->getTeacher() ? $c->getTeacher()->getName() : 'Non assigné',
            ];
        }

        return $this->json([
            'success' => true,
            'data' => $data
        ]);
    }

    #[Route('/schedule', name: 'schedule_list', methods: ['GET'])]
    public function listSchedule(EntityManagerInterface $em): JsonResponse
    {
        $sessions = $em->getRepository(CourseSession::class)->findBy([], ['startTime' => 'ASC']);
        
        $data = [];
        foreach ($sessions as $s) {
            $data[] = [
                'id' => $s->getId(),
                'course' => $s->getCourse() ? $s->getCourse()->getTitle() : 'Inconnu',
                'teacher' => ($s->getCourse() && $s->getCourse()->getTeacher()) ? $s->getCourse()->getTeacher()->getName() : 'Non assigné',
                'room' => $s->getRoom(),
                'meetingUrl' => filter_var($s->getRoom(), FILTER_VALIDATE_URL) ? $s->getRoom() : null,
                'startTime' => $s->getStartTime()->format(\DateTimeInterface::ATOM),
                'endTime' => $s->getEndTime()->format(\DateTimeInterface::ATOM),
            ];
        }

        return $this->json([
            'success' => true,
            'data' => $data
        ]);
    }

    #[Route('/grades', name: 'grades_list', methods: ['GET'])]
    #[IsGranted('formation.read')]
    public function listGrades(EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();

        // Périmètre des notes : la visibilité suit le RBAC, jamais le rôle brut.
        //  - formation.manage (responsable Formation, direction) : toutes les notes
        //  - apprenant                                    : ses propres notes
        //  - tout autre profil (parent, collaborateur, ...) : 403
        // Un parent doit passer par son propre espace, qui filtrera par enfant.
        $isManager = $this->isGranted('formation.manage');
        $isLearner = $user->hasRoleCode('APPRENANT');

        if ($isManager) {
            $grades = $em->getRepository(Grade::class)->findBy([], ['createdAt' => 'DESC']);
        } elseif ($isLearner) {
            $grades = $em->getRepository(Grade::class)->findBy(['student' => $user], ['createdAt' => 'DESC']);
        } else {
            throw $this->createAccessDeniedException();
        }

        $data = [];
        foreach ($grades as $g) {
            $data[] = [
                'id' => $g->getId(),
                'student' => $g->getStudent() ? $g->getStudent()->getName() : 'Inconnu',
                'course' => $g->getCourse() ? $g->getCourse()->getTitle() : 'Inconnu',
                'score' => $g->getScore(),
                'comment' => $g->getComment(),
                'date' => $g->getCreatedAt()->format('Y-m-d')
            ];
        }

        return $this->json([
            'success' => true,
            'data' => $data
        ]);
    }

    #[Route('/assignments', name: 'assignments_list', methods: ['GET'])]
    public function listAssignments(EntityManagerInterface $em): JsonResponse
    {
        $assignments = $em->getRepository(Assignment::class)->findBy([], ['dueDate' => 'ASC']);
        return $this->json(['success' => true, 'data' => array_map(static fn (Assignment $a) => [
            'id' => (string) $a->getId(), 'title' => $a->getTitle(), 'description' => $a->getDescription(),
            'dueDate' => $a->getDueDate()?->format(\DateTimeInterface::ATOM), 'course' => $a->getCourse()?->getTitle(),
            'courseId' => (string) $a->getCourse()?->getId(), 'formatRequired' => $a->getFormatRequired(),
        ], $assignments)]);
    }

    #[Route('/documents', name: 'course_documents_list', methods: ['GET'])]
    public function listCourseDocuments(EntityManagerInterface $em): JsonResponse
    {
        $documents = $em->getRepository(CourseDocument::class)->findBy([], ['createdAt' => 'DESC']);
        return $this->json(['success' => true, 'data' => array_map(static fn (CourseDocument $d) => ['id' => (string) $d->getId(), 'title' => $d->getTitle(), 'type' => $d->getType(), 'size' => $d->getSizeStr(), 'url' => $d->getFileUrl(), 'course' => $d->getCourse()?->getTitle()], $documents)]);
    }

    #[Route('/documents', name: 'course_document_upload', methods: ['POST'])]
    public function uploadCourseDocument(Request $request, EntityManagerInterface $em, SluggerInterface $slugger): JsonResponse
    {
        if (!$this->isGranted('formation.manage') && !$this->isGranted('ROLE_FORMATEUR')) throw $this->createAccessDeniedException();
        /** @var UploadedFile|null $file */ $file = $request->files->get('file');
        $course = $em->getRepository(Course::class)->find($request->request->get('courseId'));
        if (!$file || !$course) return $this->json(['success' => false, 'message' => 'Sélectionnez un fichier et un cours.'], 422);
        if (!$this->canManageCourse($course)) throw $this->createAccessDeniedException();
        $dir = $this->getParameter('kernel.project_dir') . '/public/uploads'; if (!is_dir($dir)) mkdir($dir, 0775, true);
        $base = (string) $slugger->slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME));
        $filename = $base . '-' . bin2hex(random_bytes(6)) . '.' . ($file->guessExtension() ?: 'bin');
        try { $file->move($dir, $filename); } catch (\Throwable) { return $this->json(['success' => false, 'message' => 'Enregistrement du fichier impossible.'], 500); }
        $bytes = filesize($dir . '/' . $filename); $size = $bytes >= 1048576 ? round($bytes / 1048576, 1) . ' Mo' : round($bytes / 1024, 1) . ' Ko';
        $doc = (new CourseDocument())->setCourse($course)->setTitle($file->getClientOriginalName())->setType($file->guessExtension() ?: 'file')->setSizeStr($size)->setFileUrl('/uploads/' . $filename)->setUploadedBy($this->getUser());
        $em->persist($doc); $em->flush();
        return $this->json(['success' => true, 'message' => 'Ressource publiée pour les apprenants.', 'id' => (string) $doc->getId()], 201);
    }

    #[Route('/assignments', name: 'assignment_create', methods: ['POST'])]
    public function createAssignment(Request $request, EntityManagerInterface $em): JsonResponse
    {
        if (!$this->isGranted('formation.manage') && !$this->isGranted('ROLE_FORMATEUR')) throw $this->createAccessDeniedException();
        $data = json_decode($request->getContent(), true) ?? [];
        $title = trim((string) ($data['title'] ?? ''));
        $course = $em->getRepository(Course::class)->find($data['courseId'] ?? null);
        if ($title === '' || !$course) return $this->json(['success' => false, 'message' => 'Un intitulé et un cours sont obligatoires.'], 422);
        if (!$this->canManageCourse($course)) throw $this->createAccessDeniedException();
        $assignment = (new Assignment())->setCourse($course)->setTitle($title)->setDescription($data['description'] ?? null)->setFormatRequired($data['formatRequired'] ?? null)->setCoefficient((float) ($data['coefficient'] ?? 1));
        if (!empty($data['dueDate'])) {
            try { $assignment->setDueDate(new \DateTime((string) $data['dueDate'])); } catch (\Throwable) { return $this->json(['success' => false, 'message' => 'Date limite invalide.'], 422); }
        }
        $em->persist($assignment); $em->flush();
        return $this->json(['success' => true, 'id' => (string) $assignment->getId()], 201);
    }

    #[Route('/submissions', name: 'submissions_list', methods: ['GET'])]
    public function listSubmissions(EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        $manager = $this->isGranted('formation.manage') || $this->isGranted('ROLE_FORMATEUR');
        if (!$manager && !$user->hasRoleCode('APPRENANT')) throw $this->createAccessDeniedException();
        $submissions = $manager
            ? $em->getRepository(StudentSubmission::class)->findBy([], ['submittedAt' => 'DESC'])
            : $em->getRepository(StudentSubmission::class)->findBy(['student' => $user], ['submittedAt' => 'DESC']);
        if ($manager && !$this->isGranted('formation.manage')) {
            $submissions = array_values(array_filter($submissions, fn (StudentSubmission $s) => $s->getAssignment()?->getCourse() && $this->canManageCourse($s->getAssignment()->getCourse())));
        }
        return $this->json(['success' => true, 'data' => array_map(static fn (StudentSubmission $s) => [
            'id' => (string) $s->getId(), 'assignmentId' => (string) $s->getAssignment()?->getId(),
            'assignment' => $s->getAssignment()?->getTitle(), 'course' => $s->getAssignment()?->getCourse()?->getTitle(),
            'student' => $s->getStudent()?->getFullName(), 'studentEmail' => $s->getStudent()?->getEmail(),
            'status' => $s->getStatus(), 'submittedAt' => $s->getSubmittedAt()?->format(\DateTimeInterface::ATOM),
            'fileName' => basename((string) $s->getSubmissionUrl()),
        ], $submissions)]);
    }

    #[Route('/assignments/{id}/submissions', name: 'assignment_submission_upload', methods: ['POST'])]
    public function submitAssignment(Assignment $assignment, Request $request, EntityManagerInterface $em, SluggerInterface $slugger): JsonResponse
    {
        $student = $this->getUser();
        if (!$student->hasRoleCode('APPRENANT')) throw $this->createAccessDeniedException();
        /** @var UploadedFile|null $file */
        $file = $request->files->get('file');
        if (!$file || !in_array($file->guessExtension(), ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'zip'], true)) {
            return $this->json(['success' => false, 'message' => 'Déposez un fichier PDF, Word, PowerPoint ou ZIP valide.'], 422);
        }
        $dir = $this->getParameter('kernel.project_dir') . '/var/storage/submissions';
        if (!is_dir($dir)) mkdir($dir, 0775, true);
        $safe = $slugger->slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME));
        $name = $safe . '-' . bin2hex(random_bytes(8)) . '.' . $file->guessExtension();
        try { $file->move($dir, $name); } catch (\Throwable) { return $this->json(['success' => false, 'message' => 'Le fichier n’a pas pu être enregistré.'], 500); }
        $submission = $em->getRepository(StudentSubmission::class)->findOneBy(['assignment' => $assignment, 'student' => $student]) ?? new StudentSubmission();
        $submission->setAssignment($assignment)->setStudent($student)->setStatus('SUBMITTED')->setSubmissionUrl($name)->setSubmittedAt(new \DateTime());
        $em->persist($submission); $em->flush();
        return $this->json(['success' => true, 'message' => 'Votre travail a été transmis.', 'id' => (string) $submission->getId()], 201);
    }

    #[Route('/submissions/{id}/download', name: 'submission_download', methods: ['GET'])]
    public function downloadSubmission(StudentSubmission $submission): BinaryFileResponse|JsonResponse
    {
        $user = $this->getUser();
        $ownsCourse = $submission->getAssignment()?->getCourse() && $this->canManageCourse($submission->getAssignment()->getCourse());
        if (!$ownsCourse && !$user->getId()->equals($submission->getStudent()?->getId())) throw $this->createAccessDeniedException();
        $path = $this->getParameter('kernel.project_dir') . '/var/storage/submissions/' . basename((string) $submission->getSubmissionUrl());
        if (!is_file($path)) return $this->json(['success' => false, 'message' => 'Fichier introuvable.'], 404);
        $response = new BinaryFileResponse($path);
        $response->setContentDisposition(ResponseHeaderBag::DISPOSITION_ATTACHMENT, basename($path));
        return $response;
    }

    #[Route('/schedule/{id}/meeting', name: 'session_meeting_update', methods: ['PATCH'])]
    public function publishMeetingLink(CourseSession $session, Request $request, EntityManagerInterface $em): JsonResponse
    {
        if (!$this->isGranted('formation.manage') && !$this->isGranted('ROLE_FORMATEUR')) throw $this->createAccessDeniedException();
        if ($session->getCourse() && !$this->canManageCourse($session->getCourse())) throw $this->createAccessDeniedException();
        $url = trim((string) (($data = json_decode($request->getContent(), true) ?? [])['url'] ?? ''));
        if ($url !== '' && (!filter_var($url, FILTER_VALIDATE_URL) || !in_array(parse_url($url, PHP_URL_SCHEME), ['https', 'http'], true))) return $this->json(['success' => false, 'message' => 'Lien de visioconférence invalide.'], 422);
        $session->setRoom($url ?: null); $em->flush();
        return $this->json(['success' => true, 'meetingUrl' => $session->getRoom()]);
    }

    private function canManageCourse(Course $course): bool
    {
        if ($this->isGranted('formation.manage')) return true;
        $user = $this->getUser();
        return $user instanceof User && $course->getTeacher()?->getId()->equals($user->getId());
    }
}
