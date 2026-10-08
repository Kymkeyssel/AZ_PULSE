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
$userRepo = $em->getRepository(User::class);
$requestRepo = $em->getRepository(AccessRequest::class);

$admins = ['superadmin@azpulse.local', 'admin@azpulse.local'];

// Delete access requests for non-admins first
$requests = $requestRepo->findAll();
foreach ($requests as $req) {
    if (!in_array($req->getUser()->getEmail(), $admins)) {
        $em->remove($req);
    }
}
$em->flush();

// Delete non-admin users
$users = $userRepo->findAll();
foreach ($users as $user) {
    if (!in_array($user->getEmail(), $admins)) {
        $em->remove($user);
    }
}
$em->flush();

echo "Deleted all non-admin users.\n";

$passwordHasher = $kernel->getContainer()->get('security.user_password_hasher');

// Create new access requests
$newRequests = [
    ['email' => 'nouveau.it@azpulse.local', 'first' => 'Nouveau', 'last' => 'IT', 'domain' => 'IT', 'motivation' => 'Je suis le nouveau responsable infrastructure.'],
    ['email' => 'nouveau.prof@azpulse.local', 'first' => 'Nouveau', 'last' => 'Prof', 'domain' => 'Formation', 'motivation' => 'Je suis le nouveau formateur React.'],
    ['email' => 'nouveau.parent@azpulse.local', 'first' => 'Nouveau', 'last' => 'Parent', 'domain' => 'Parent', 'motivation' => 'Parent de l\'élève Jean.'],
];

foreach ($newRequests as $data) {
    $user = new User();
    $user->setEmail($data['email']);
    $user->setFirstName($data['first']);
    $user->setLastName($data['last']);
    $user->setStatus(User::STATUS_PENDING_APPROVAL);
    $user->setPassword($passwordHasher->hashPassword($user, 'password123')); // Temporary password
    $em->persist($user);

    $req = new AccessRequest();
    $req->setUser($user);
    $req->setRequestedDomain($data['domain']);
    $req->setMotivation($data['motivation']);
    $req->setStatus(AccessRequest::STATUS_PENDING);
    $em->persist($req);
}

$em->flush();
echo "Created 3 new access requests.\n";
