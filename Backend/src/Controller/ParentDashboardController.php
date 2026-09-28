<?php

namespace App\Controller;

use App\Entity\Enrollment;
use App\Entity\Tuition;
use App\Entity\CourseSession;
use App\Entity\Grade;
use App\Entity\StudentSubmission;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\User\UserInterface;

#[Route('/api/dashboard/parent', name: 'api_dashboard_parent_')]
class ParentDashboardController extends AbstractController
{
    #[Route('', name: 'index', methods: ['GET'])]
    public function index(EntityManagerInterface $em, UserInterface $user): JsonResponse
    {
        // 1. Fetch children attached to this parent
        $children = $user->getChildren();
        $childrenData = [];

        foreach ($children as $child) {
            // Identity & Program
            $enrollment = $em->getRepository(Enrollment::class)->findOneBy(['student' => $child], ['id' => 'DESC']);
            $programName = 'Non assigné';
            $promoName = '';
            $status = 'Inactif';
            if ($enrollment) {
                $programName = $enrollment->getPromotion()->getProgram()->getName();
                $promoName = $enrollment->getPromotion()->getName();
                $status = $enrollment->getStatus();
            }

            // Financial
            $tuition = $em->getRepository(Tuition::class)->findOneBy(['student' => $child], ['id' => 'DESC']);
            $financial = null;
            if ($tuition) {
                $financial = [
                    'totalAmount' => $tuition->getTotalAmount(),
                    'remainingBalance' => $tuition->getRemainingBalance(),
                    'paidAmount' => $tuition->getTotalAmount() - $tuition->getRemainingBalance(),
                    'paidTranches' => $tuition->getPaidTranches(),
                    'totalTranches' => $tuition->getTotalTranches()
                ];
            }

            // Grades (Average)
            $grades = $em->getRepository(Grade::class)->findBy(['student' => $child], ['createdAt' => 'DESC']);
            $totalScore = 0;
            $countGrades = count($grades);
            $recentGrades = [];
            foreach (array_slice($grades, 0, 3) as $g) {
                $recentGrades[] = [
                    'course' => $g->getCourse()->getTitle(),
                    'date' => $g->getCreatedAt()->format('Y-m-d'),
                    'score' => $g->getScore(),
                    'comment' => $g->getComment()
                ];
            }
            if ($countGrades > 0) {
                foreach ($grades as $g) {
                    $totalScore += $g->getScore();
                }
            }
            $average = $countGrades > 0 ? round($totalScore / $countGrades, 2) : 0;

            // Upcoming evaluations (Tasks)
            $submissions = $em->getRepository(StudentSubmission::class)->findBy(['student' => $child, 'status' => 'PENDING'], ['id' => 'ASC'], 2);
            $upcomingEvals = [];
            foreach ($submissions as $sub) {
                $upcomingEvals[] = [
                    'title' => $sub->getAssignment()->getTitle(),
                    'dueDate' => $sub->getAssignment()->getDueDate() ? $sub->getAssignment()->getDueDate()->format('Y-m-d') : null
                ];
            }

            // Schedule (Next sessions)
            $sessions = $em->getRepository(CourseSession::class)->findBy([], ['startTime' => 'ASC'], 5);
            $scheduleData = [];
            foreach ($sessions as $session) {
                $scheduleData[] = [
                    'course' => $session->getCourse()->getTitle(),
                    'room' => $session->getRoom(),
                    'teacher' => $session->getCourse()->getTeacher() ? $session->getCourse()->getTeacher()->getFirstName() . ' ' . $session->getCourse()->getTeacher()->getLastName() : 'N/A',
                    'startTime' => $session->getStartTime()->format('Y-m-d H:i'),
                    'endTime' => $session->getEndTime()->format('H:i'),
                    'day' => $session->getStartTime()->format('D'),
                    'dayNum' => $session->getStartTime()->format('d'),
                    'duration' => $session->getStartTime()->diff($session->getEndTime())->format('%h')
                ];
            }

            $childrenData[] = [
                'id' => $child->getId(),
                'initials' => strtoupper(substr($child->getFirstName(), 0, 1) . substr($child->getLastName(), 0, 1)),
                'firstName' => $child->getFirstName(),
                'lastName' => $child->getLastName(),
                'fullName' => $child->getFirstName() . ' ' . $child->getLastName(),
                'programName' => $programName,
                'promoName' => $promoName,
                'status' => $status,
                'average' => $average,
                'financial' => $financial,
                'recentGrades' => $recentGrades,
                'upcomingEvals' => $upcomingEvals,
                'schedule' => $scheduleData
            ];
        }

        return $this->json([
            'children' => $childrenData
        ]);
    }
}
