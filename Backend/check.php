<?php
require 'vendor/autoload.php';
$kernel = new App\Kernel('dev', true);
$kernel->boot();
$em = $kernel->getContainer()->get('doctrine')->getManager();
$user = $em->getRepository(App\Entity\User::class)->findOneBy(['email' => 'apprenant@azpulse.local']);
echo "Apprenant roles: ";
print_r($user->getRolesEntities()->map(fn($r) => $r->getCode())->toArray());
echo "\n";
$parent = $em->getRepository(App\Entity\User::class)->findOneBy(['email' => 'parent@azpulse.local']);
echo "Parent roles: ";
print_r($parent->getRolesEntities()->map(fn($r) => $r->getCode())->toArray());
echo "\n";
