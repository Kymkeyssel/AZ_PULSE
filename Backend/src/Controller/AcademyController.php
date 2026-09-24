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
    public function listGrades(EntityManagerInterface $em): JsonResponse
    {
        // If the user is a student, we should ideally only return their grades.
        // For simplicity in this demo, we'll return all grades if they are staff, 
        // or filter if they are a student.
        $user = $this->getUser();
        
        if (in_array('ROLE_APPRENANT', $user->getRoles())) {
            $grades = $em->getRepository(Grade::class)->findBy(['student' => $user], ['createdAt' => 'DESC']);
        } else {
            $grades = $em->getRepository(Grade::class)->findBy([], ['createdAt' => 'DESC']);
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
