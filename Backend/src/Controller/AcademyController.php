<?php

namespace App\Controller;

use App\Entity\Course;
use App\Entity\CourseSession;
use App\Entity\Grade;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
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
}
