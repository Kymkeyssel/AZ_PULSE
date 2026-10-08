<?php
require __DIR__.'/vendor/autoload.php';
$kernel = new \App\Kernel('dev', true);
$kernel->boot();
$container = $kernel->getContainer();
$em = $container->get('doctrine')->getManager();
$user = $em->getRepository(\App\Entity\User::class)->findOneBy(['email' => 'resp.infrastructure@azpulse.local']);
if ($user) {
    echo "User found\n";
    echo "Email: " . $user->getEmail() . "\n";
    echo "Profile: " . ($user->getCollaboratorProfile() ?: 'NULL') . "\n";
    echo "Roles:\n";
    foreach ($user->getRolesEntities() as $role) {
        echo "- " . $role->getCode() . "\n";
    }
} else {
    echo "User not found\n";
}
