<?php
require __DIR__.'/vendor/autoload.php';
(new \Symfony\Component\Dotenv\Dotenv())->bootEnv(__DIR__.'/.env');

$kernel = new \App\Kernel('dev', true);
$kernel->boot();
$container = $kernel->getContainer();
$em = $container->get('doctrine')->getManager();
$user = $em->getRepository(\App\Entity\User::class)->findOneBy(['email' => 'resp.infrastructure@azpulse.local']);

try {
    $authService = $container->get(\App\Service\AuthService::class);
    $payload = $authService->formatUserPayload($user);
    print_r($payload);
} catch (\Throwable $e) {
    echo "ERROR:\n";
    echo $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
}
