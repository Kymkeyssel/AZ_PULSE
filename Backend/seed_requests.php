<?php
require __DIR__.'/vendor/autoload.php';

use App\Kernel;
use App\Entity\User;
use App\Entity\AccessRequest;
use Symfony\Component\Dotenv\Dotenv;

(new Dotenv())->bootEnv(__DIR__.'/.env');

$kernel = new Kernel($_SERVER['APP_ENV'], (bool) $_SERVER['APP_DEBUG']);
$kernel->boot();

$em = $kernel->getContainer()->get('doctrine')->getManager();

$newRequests = [
    ['email' => 'responsable.it@azpulse.local', 'first' => 'Nouveau', 'last' => 'IT', 'domain' => 'IT', 'motivation' => 'Je suis le nouveau responsable infrastructure.'],
    ['email' => 'formateur.react@azpulse.local', 'first' => 'Nouveau', 'last' => 'Prof', 'domain' => 'Formation', 'motivation' => 'Je suis le nouveau formateur React.'],
    ['email' => 'parent.eleve@azpulse.local', 'first' => 'Nouveau', 'last' => 'Parent', 'domain' => 'Parent', 'motivation' => 'Parent de l\'élève Jean.'],
    ['email' => 'responsable.workspace@azpulse.local', 'first' => 'Nouveau', 'last' => 'Workspace', 'domain' => 'Projets', 'motivation' => 'Responsable Workspace.'],
];

foreach ($newRequests as $data) {
    // Check if user already exists
    $existing = $em->getRepository(User::class)->findOneBy(['email' => $data['email']]);
    if ($existing) {
        continue;
    }

    $user = new User();
    $user->setEmail($data['email']);
    $user->setFirstName($data['first']);
    $user->setLastName($data['last']);
    $user->setStatus(User::STATUS_PENDING_APPROVAL);
    $user->setPassword(password_hash('password123', PASSWORD_BCRYPT)); // Temporary password
    $em->persist($user);

    $req = new AccessRequest();
    $req->setUser($user);
    $req->setRequestedDomain($data['domain']);
    $req->setMotivation($data['motivation']);
    $req->setStatus(AccessRequest::STATUS_PENDING);
    $em->persist($req);
}

$em->flush();
echo "Created new access requests.\n";
