<?php
require __DIR__.'/vendor/autoload.php';
use Symfony\Component\Dotenv\Dotenv;

$dotenv = new Dotenv();
$dotenv->load(__DIR__.'/.env');

$dbUrl = $_ENV['DATABASE_URL'];
$dbUrl = str_replace('postgresql://', '', $dbUrl);
$parts = explode('@', $dbUrl);
$userPass = explode(':', $parts[0]);
$user = $userPass[0];
$pass = $userPass[1] ?? '';
$hostDb = explode('/', $parts[1]);
$hostPort = explode(':', $hostDb[0]);
$host = $hostPort[0];
$port = $hostPort[1] ?? 5432;
$dbNameParts = explode('?', $hostDb[1]);
$dbName = $dbNameParts[0];

try {
    $dsn = "pgsql:host=$host;port=$port;dbname=$dbName";
    $pdo = new PDO($dsn, $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->query("SELECT u.id, u.email FROM users u JOIN user_roles ur ON u.id = ur.user_id JOIN roles r ON ur.role_id = r.id WHERE r.code = 'PARENT' OR r.code = 'ROLE_PARENT'");
    $parents = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo "Found " . count($parents) . " parents:\n";
    foreach ($parents as $p) {
        echo "Parent: " . $p['email'] . "\n";
        $stmt = $pdo->prepare("SELECT u.email FROM users u JOIN user_user uu ON u.id = uu.user_target WHERE uu.user_source = ?");
        $stmt->execute([$p['id']]);
        $children = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo "  -> Children: " . count($children) . "\n";
        foreach ($children as $c) {
            echo "     - " . $c['email'] . "\n";
        }
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
