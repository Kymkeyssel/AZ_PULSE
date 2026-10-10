<?php

namespace App\Command;

use App\Entity\Course;
use App\Entity\CourseDocument;
use App\Entity\Document;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\Filesystem\Filesystem;
use Symfony\Component\String\Slugger\SluggerInterface;

#[AsCommand(name: 'app:formation:import-exams', description: 'Publie les épreuves PDF de docs/pdf dans les ressources Formation et Knowledge Hub.')]
class ImportExamPdfsCommand extends Command
{
    public function __construct(private readonly EntityManagerInterface $em, #[Autowire('%kernel.project_dir%')] private readonly string $projectDir, private readonly SluggerInterface $slugger)
    {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $source = dirname($this->projectDir) . '/docs/pdf';
        if (!is_dir($source)) { $output->writeln('<error>Dossier docs/pdf introuvable.</error>'); return Command::FAILURE; }
        $owner = $this->em->getRepository(User::class)->findOneBy(['status' => User::STATUS_ACTIVE]);
        if (!$owner) { $output->writeln('<error>Aucun compte actif pour attribuer les documents.</error>'); return Command::FAILURE; }
        $course = $this->em->getRepository(Course::class)->findOneBy([]);
        $root = $this->projectDir;
        $knowledgeDir = $root . '/var/storage/knowledge'; $publicDir = $root . '/public/uploads';
        (new Filesystem())->mkdir([$knowledgeDir, $publicDir]);
        $count = 0;
        foreach (glob($source . '/*.pdf') ?: [] as $sourcePath) {
            $original = basename($sourcePath);
            $known = $this->em->getRepository(Document::class)->findOneBy(['originalName' => $original]);
            $safe = (string) $this->slugger->slug(pathinfo($original, PATHINFO_FILENAME));
            $fileName = $safe . '-' . substr(hash('sha256', $original), 0, 12) . '.pdf';
            if (!$known) {
                copy($sourcePath, $knowledgeDir . '/' . $fileName);
                $doc = (new Document())->setTitle(pathinfo($original, PATHINFO_FILENAME))->setDescription('Épreuve PDF publiée pour les apprenants.')->setOriginalName($original)->setMimeType('application/pdf')->setSize((int) filesize($sourcePath))->setStoragePath($fileName)->setType('EXAM')->setStatus('PUBLISHED')->setOwner($owner)->setPublishedAt(new \DateTime());
                $this->em->persist($doc);
            }
            if ($course && !$this->em->getRepository(CourseDocument::class)->findOneBy(['title' => $original])) {
                $publicName = 'exam-' . $fileName;
                copy($sourcePath, $publicDir . '/' . $publicName);
                $bytes = filesize($sourcePath);
                $size = $bytes > 1048576 ? round($bytes / 1048576, 1) . ' Mo' : round($bytes / 1024, 1) . ' Ko';
                $courseDoc = (new CourseDocument())->setCourse($course)->setTitle($original)->setType('pdf')->setSizeStr($size)->setFileUrl('/uploads/' . $publicName)->setUploadedBy($owner);
                $this->em->persist($courseDoc);
            }
            ++$count;
        }
        $this->em->flush();
        $output->writeln(sprintf('<info>%d PDF traité(s). Documents Knowledge Hub publiés%s.</info>', $count, $course ? ' et ressources Formation ajoutées' : '; aucun cours trouvé pour rattacher les ressources Formation'));
        return Command::SUCCESS;
    }
}
