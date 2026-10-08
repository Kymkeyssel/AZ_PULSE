<?php
require 'vendor/autoload.php';
$kernel = new App\Kernel('dev', true);
$kernel->boot();
$container = $kernel->getContainer();
$em = $container->get('doctrine')->getManager();
$user = $em->getRepository(\App\Entity\User::class)->findOneBy(['email' => 'admin@azpulse.local']);
$hasher = $container->get('security.user_password_hasher');
echo $hasher->isPasswordValid($user, 'NouvoPass2026!') ? 'VALID' : 'INVALID';
echo "\nUser Status: " . $user->getStatus();
