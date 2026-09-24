<?php

namespace App\Command;

use App\Entity\Course;
use App\Entity\CourseSession;
use App\Entity\Grade;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:seed-academy',
    description: 'Seed some fake data for the Academy module',
)]
class SeedAcademyCommand extends Command
{
    public function __construct(
        private readonly EntityManagerInterface $em
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('Création des données factices pour l\'Académie (Fixtures)');

        $userRepo = $this->em->getRepository(User::class);
        $student = $userRepo->findOneBy(['email' => 'apprenant@azpulse.local']);
        $teacher = $userRepo->findOneBy(['email' => 'resp.formation@azpulse.local']);

        if (!$student || !$teacher) {
            $io->error('Les utilisateurs apprenant@azpulse.local ou resp.formation@azpulse.local sont introuvables. Lancez la création d\'accès et acceptez-les avant.');
            // We can fallback to any user if not found.
            $student = $userRepo->findOneBy([]) ?? new User();
            $teacher = $student;
        }

        // Clean up old data
        $this->em->createQuery('DELETE FROM App\Entity\Grade')->execute();
        $this->em->createQuery('DELETE FROM App\Entity\CourseSession')->execute();
        $this->em->createQuery('DELETE FROM App\Entity\Course')->execute();

        // 1. Create Courses
        $coursesData = [
            ['title' => 'Mathématiques Avancées', 'desc' => 'Algèbre linéaire et calcul différentiel.'],
            ['title' => 'Développement Web React', 'desc' => 'Création d\'interfaces modernes.'],
            ['title' => 'Algorithmique & Structures de données', 'desc' => 'Les bases de l\'informatique classique.'],
        ];

        $courses = [];
        foreach ($coursesData as $cData) {
            $course = new Course();
            $course->setTitle($cData['title']);
            $course->setDescription($cData['desc']);
            $course->setTeacher($teacher);
            $this->em->persist($course);
            $courses[] = $course;
        }

        $this->em->flush();
        $io->success('Cours créés.');

        // 2. Create Sessions
        $now = new \DateTime();
        
        $sessionsData = [
            [$courses[0], 'Salle A12', (clone $now)->modify('+1 day')->setTime(10, 0), (clone $now)->modify('+1 day')->setTime(12, 0)],
            [$courses[1], 'Labo Info', (clone $now)->setTime(14, 0), (clone $now)->setTime(17, 0)],
            [$courses[2], 'Amphi 400', (clone $now)->modify('+2 days')->setTime(8, 30), (clone $now)->modify('+2 days')->setTime(10, 30)],
            [$courses[0], 'Salle A12', (clone $now)->modify('+4 days')->setTime(10, 0), (clone $now)->modify('+4 days')->setTime(12, 0)],
            [$courses[1], 'Labo Info', (clone $now)->modify('+5 days')->setTime(9, 0), (clone $now)->modify('+5 days')->setTime(12, 0)],
        ];

        foreach ($sessionsData as $sData) {
            $session = new CourseSession();
            $session->setCourse($sData[0]);
            $session->setRoom($sData[1]);
            $session->setStartTime($sData[2]);
            $session->setEndTime($sData[3]);
            $this->em->persist($session);
        }

        $this->em->flush();
        $io->success('Sessions (Emploi du temps) créées.');

        // 3. Create Grades
        $gradesData = [
            [$courses[0], 14.5, 'Bon travail, continuez.'],
            [$courses[1], 18.0, 'Excellent projet React.'],
            [$courses[2], 9.5, 'Attention aux algorithmes de tri, à revoir.'],
        ];

        foreach ($gradesData as $idx => $gData) {
            $grade = new Grade();
            $grade->setStudent($student);
            $grade->setCourse($gData[0]);
            $grade->setScore($gData[1]);
            $grade->setComment($gData[2]);
            // staggered dates
            $grade->setCreatedAt((clone $now)->modify('-' . ($idx + 2) . ' days'));
            $this->em->persist($grade);
        }

        $this->em->flush();
        $io->success('Notes créées.');

        return Command::SUCCESS;
    }
}
