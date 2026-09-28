<?php

namespace App\Command;

use App\Entity\User;
use App\Entity\Program;
use App\Entity\Promotion;
use App\Entity\Enrollment;
use App\Entity\Tuition;
use App\Entity\PaymentReceipt;
use App\Entity\Course;
use App\Entity\CourseSession;
use App\Entity\CourseDocument;
use App\Entity\Assignment;
use App\Entity\StudentSubmission;
use App\Entity\Grade;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:seed-dashboard-data',
    description: 'Seed fake data to populate the Apprenant Dashboard'
)]
class SeedDashboardDataCommand extends Command
{
    private EntityManagerInterface $em;

    public function __construct(EntityManagerInterface $em)
    {
        parent::__construct();
        $this->em = $em;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        // Find some APPRENANT and PARENT users to attach data to
        $users = $this->em->getRepository(User::class)->findAll();
        $apprenants = [];
        $parents = [];
        $teacher = null;
        foreach ($users as $user) {
            $userRoles = [];
            foreach ($user->getRoles() as $r) {
                if ($r instanceof \App\Entity\Role) {
                    $userRoles[] = $r->getCode();
                } else {
                    $userRoles[] = $r;
                }
            }
            if (in_array('APPRENANT', $userRoles) || in_array('ROLE_APPRENANT', $userRoles)) {
                $apprenants[] = $user;
            }
            if (in_array('PARENT', $userRoles) || in_array('ROLE_PARENT', $userRoles)) {
                $parents[] = $user;
            }
            if (in_array('FORMATEUR', $userRoles) || in_array('ROLE_FORMATEUR', $userRoles)) {
                $teacher = $user;
            }
        }

        if (empty($apprenants)) {
            $io->warning('No APPRENANT found. Create some APPRENANT users first.');
            $apprenants[] = $users[0];
        }

        if (!$teacher) {
            $teacher = $users[0]; // Fallback
        }

        // Attach parents to apprenants
        if (!empty($parents)) {
            $parentIndex = 0;
            foreach ($apprenants as $apprenant) {
                $parent = $parents[$parentIndex % count($parents)];
                if (!$apprenant->getParents()->contains($parent)) {
                    $apprenant->addParent($parent);
                }
                $parentIndex++;
            }
        }

        // Create Program
        $program = new Program();
        $program->setName('Parcours Grande École Développeur Fullstack & Data');
        $program->setDescription('Programme sur 3 ans');
        $this->em->persist($program);

        // Create Promotion
        $promotion = new Promotion();
        $promotion->setName('Promotion Développeur d\'Applications & IA (MINEFOP 2025)');
        $promotion->setProgram($program);
        $promotion->setStartDate(new \DateTime('2024-09-01'));
        $promotion->setEndDate(new \DateTime('2025-06-30'));
        $this->em->persist($promotion);

        // Create Courses
        $course1 = new Course();
        $course1->setTitle('Architecture Micro-services');
        $course1->setTeacher($teacher);
        $this->em->persist($course1);

        $course2 = new Course();
        $course2->setTitle('Algorithmique Avancée');
        $course2->setTeacher($teacher);
        $this->em->persist($course2);

        $course3 = new Course();
        $course3->setTitle('Data Engineering');
        $course3->setTeacher($teacher);
        $this->em->persist($course3);

        foreach ($apprenants as $apprenant) {
            // Enrollment
            $enrollment = new Enrollment();
            $enrollment->setStudent($apprenant);
            $enrollment->setPromotion($promotion);
            $enrollment->setProgress(72.0);
            $enrollment->setValidatedModules(18);
            $enrollment->setTotalModules(25);
            $enrollment->setNextMilestone('Soutenance Projet Intégrateur (Juin 2025)');
            $this->em->persist($enrollment);

            // Tuition & Payments
            $tuition = new Tuition();
            $tuition->setStudent($apprenant);
            $tuition->setTotalAmount(1000000);
            $tuition->setTotalTranches(4);
            $tuition->setPaidTranches(3);
            $tuition->setRemainingBalance(250000);
            $this->em->persist($tuition);

            // Payment Receipt
            $receipt = new PaymentReceipt();
            $receipt->setTuition($tuition);
            $receipt->setAmount(250000);
            $receipt->setStatus('VALIDATED');
            $receipt->setReference('TR-3-2024-XYZ');
            $this->em->persist($receipt);

            // Grades
            $grade = new Grade();
            $grade->setStudent($apprenant);
            $grade->setCourse($course2);
            $grade->setScore(18.5);
            $grade->setComment('Excellente maîtrise des concepts ! Continuez ainsi.');
            $this->em->persist($grade);

            $grade2 = new Grade();
            $grade2->setStudent($apprenant);
            $grade2->setCourse($course1);
            $grade2->setScore(14.0);
            $grade2->setComment('Bon travail mais attention à l\'optimisation.');
            $this->em->persist($grade2);

            // Course Documents
            $doc1 = new CourseDocument();
            $doc1->setCourse($course1);
            $doc1->setTitle('Architecture Micro-services & Kafka');
            $doc1->setType('pdf');
            $doc1->setSizeStr('8.4 Mo');
            $doc1->setUploadedBy($teacher);
            $doc1->setFileUrl('/uploads/docs/kafka.pdf');
            $this->em->persist($doc1);

            $doc2 = new CourseDocument();
            $doc2->setCourse($course1);
            $doc2->setTitle('Ressources TPs & Assets');
            $doc2->setType('zip');
            $doc2->setSizeStr('24.1 Mo');
            $doc2->setUploadedBy($teacher);
            $doc2->setFileUrl('/uploads/docs/assets.zip');
            $this->em->persist($doc2);

            // Assignments
            $assignment1 = new Assignment();
            $assignment1->setCourse($course1);
            $assignment1->setTitle('TP Noté: Architecture API REST');
            $assignment1->setDescription('Dépôt du dépôt GitHub + Documentation Postman');
            $assignment1->setDueDate(new \DateTime('+2 days'));
            $assignment1->setCoefficient(3.0);
            $assignment1->setFormatRequired('URL');
            $this->em->persist($assignment1);

            $assignment2 = new Assignment();
            $assignment2->setCourse($course3);
            $assignment2->setTitle('Projet: Pipeline CI/CD Docker');
            $assignment2->setDescription('Livrer le fichier docker-compose.yml');
            $assignment2->setDueDate(new \DateTime('+5 days'));
            $assignment2->setCoefficient(4.0);
            $assignment2->setFormatRequired('ZIP');
            $this->em->persist($assignment2);

            // Submissions
            $sub1 = new StudentSubmission();
            $sub1->setStudent($apprenant);
            $sub1->setAssignment($assignment1);
            $sub1->setStatus('PENDING');
            $this->em->persist($sub1);

            $sub2 = new StudentSubmission();
            $sub2->setStudent($apprenant);
            $sub2->setAssignment($assignment2);
            $sub2->setStatus('PENDING');
            $this->em->persist($sub2);
        }

        // Course Sessions (for schedule)
        $session1 = new CourseSession();
        $session1->setCourse($course3);
        $session1->setRoom('Salle Lab 3');
        // Currently ongoing
        $session1->setStartTime(new \DateTime('-1 hour'));
        $session1->setEndTime(new \DateTime('+2 hours'));
        $this->em->persist($session1);

        $session2 = new CourseSession();
        $session2->setCourse($course1);
        $session2->setRoom('Amphithéâtre Turing');
        $session2->setStartTime(new \DateTime('tomorrow 10:00:00'));
        $session2->setEndTime(new \DateTime('tomorrow 13:00:00'));
        $this->em->persist($session2);

        $this->em->flush();

        $io->success('Dashboard data seeded successfully!');

        return Command::SUCCESS;
    }
}
