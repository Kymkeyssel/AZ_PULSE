<?php
require dirname(__DIR__) . '/Backend/vendor/autoload.php';

use App\Kernel;
use Symfony\Component\Dotenv\Dotenv;

(new Dotenv())->bootEnv(dirname(__DIR__) . '/Backend/.env');

$kernel = new Kernel($_SERVER['APP_ENV'], (bool) $_SERVER['APP_DEBUG']);
$kernel->boot();

$container = $kernel->getContainer();
$glpiService = $container->get('App\Service\GlpiService');

try {
    $computers = $glpiService->getComputers();
    echo "Nombre d'équipements: " . count($computers) . "\n";
} catch (\Exception $e) {
    echo "Erreur: " . $e->getMessage() . "\n";
}
