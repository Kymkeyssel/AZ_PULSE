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
$user = $em->getRepository(\App\Entity\User::class)->findOneBy(['email' => 'admin@azpulse.local']);
if ($user) {
    echo 'Email: ' . $user->getEmail() . PHP_EOL;
    echo 'Status: ' . $user->getStatus() . PHP_EOL;
    echo 'Roles: ' . implode(',', $user->getRoles()) . PHP_EOL;
    echo 'Password Hash: ' . $user->getPassword() . PHP_EOL;
} else {
    echo 'User not found' . PHP_EOL;
}
