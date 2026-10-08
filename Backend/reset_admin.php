<?php
$_ENV['APP_ENV'] = 'dev';
require __DIR__.'/vendor/autoload.php';
require __DIR__.'/src/Kernel.php';
use App\Kernel;
use Symfony\Component\Dotenv\Dotenv;
(new Dotenv())->bootEnv(__DIR__.'/.env');
$kernel = new Kernel($_SERVER['APP_ENV'], true);
$kernel->boot();
$container = $kernel->getContainer();
$em = $container->get('doctrine.orm.entity_manager');
$passwordHasher = $container->get('security.user_password_hasher');
$user = $em->getRepository(\App\Entity\User::class)->findOneBy(['email' => 'admin@azpulse.local']);
if ($user) {
    $user->setPassword($passwordHasher->hashPassword($user, 'Admin@2026!'));
    $em->flush();
    echo 'Password reset to Admin@2026! Hash: ' . $user->getPassword() . PHP_EOL;
} else {
    echo 'User not found' . PHP_EOL;
}
