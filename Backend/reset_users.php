<?php
require 'vendor/autoload.php';
use Symfony\Component\Dotenv\Dotenv;
use App\Entity\User;
use App\Entity\AccessRequest;
use App\Entity\ApiToken;
use App\Entity\Role;

$dotenv = new Dotenv();
$dotenv->loadEnv(__DIR__.'/.env');

$kernel = new App\Kernel('dev', true);
$kernel->boot();
$container = $kernel->getContainer();
$em = $container->get('doctrine.orm.entity_manager');
$passwordHasher = $container->get('security.user_password_hasher');
$roleRepo = $em->getRepository(Role::class);

// 1. Delete all ApiTokens
$em->createQuery('DELETE FROM App\Entity\ApiToken')->execute();

// 2. Delete all AccessRequests
$em->createQuery('DELETE FROM App\Entity\AccessRequest')->execute();

// 3. Delete all Users except Super Admin
$users = $em->getRepository(User::class)->findAll();
foreach ($users as $user) {
    if ($user->getEmail() !== 'admin@azpulse.local') {
        $em->remove($user);
    }
}
$em->flush();

echo "Deleted old accounts.\n";

// 4. Create new accounts (Pending)
$accountsToCreate = [
    ['email' => 'directeur@azpulse.local', 'firstName' => 'Jean', 'lastName' => 'Directeur', 'roleCode' => 'ADMIN', 'domain' => 'Direction Générale'],
    ['email' => 'resp.crm@azpulse.local', 'firstName' => 'Sophie', 'lastName' => 'Crm', 'roleCode' => 'RESPONSABLE_CRM', 'domain' => 'Ventes & CRM'],
    ['email' => 'resp.formation@azpulse.local', 'firstName' => 'Marc', 'lastName' => 'Formation', 'roleCode' => 'RESPONSABLE_FORMATION', 'domain' => 'Pédagogie & Formation'],
    ['email' => 'resp.workspace@azpulse.local', 'firstName' => 'Alice', 'lastName' => 'Workspace', 'roleCode' => 'RESPONSABLE_WORKSPACE', 'domain' => 'Projets & Agilité'],
    ['email' => 'resp.it@azpulse.local', 'firstName' => 'Paul', 'lastName' => 'Infra', 'roleCode' => 'RESPONSABLE_IT', 'domain' => 'Infrastructure & IT'],
    ['email' => 'apprenant@azpulse.local', 'firstName' => 'Lucas', 'lastName' => 'Étudiant', 'roleCode' => 'APPRENANT', 'domain' => 'Étudiant (Licence 3)'],
    ['email' => 'parent@azpulse.local', 'firstName' => 'Marie', 'lastName' => 'Parent', 'roleCode' => 'PARENT', 'domain' => 'Parent d\'élève'],
];

foreach ($accountsToCreate as $acc) {
    $user = new User();
    $user->setEmail($acc['email']);
    $user->setFirstName($acc['firstName']);
    $user->setLastName($acc['lastName']);
    $user->setPhone('0123456789');
    $user->setStatus(User::STATUS_PENDING_APPROVAL); // En attente de validation
    
    // Le mot de passe par défaut est 'Pass123!'
    $user->setPassword($passwordHasher->hashPassword($user, 'Pass123!'));
    
    // Ajout du rôle
    $role = $roleRepo->findOneBy(['code' => $acc['roleCode']]);
    if ($role) {
        $user->addRolesEntity($role);
    }
    
    $em->persist($user);

    // Création de l'AccessRequest
    $req = new AccessRequest();
    $req->setUser($user);
    $req->setRequestedDomain($acc['domain']);
    $req->setMotivation('Demande d\'accès générée pour test et validation.');
    $req->setStatus(AccessRequest::STATUS_PENDING);
    
    $em->persist($req);
}

$em->flush();

echo "Created new pending accounts and access requests.\n";
