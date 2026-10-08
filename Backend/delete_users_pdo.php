<?php
$pdo = new PDO('pgsql:host=127.0.0.1;port=5432;dbname=azpulse', 'azpulse', 'azpulse_dev_password');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

try {
    $pdo->beginTransaction();
    $pdo->exec("DELETE FROM access_requests WHERE user_id IN (SELECT id FROM \"users\" WHERE email NOT IN ('superadmin@azpulse.local', 'admin@azpulse.local'))");
    $pdo->exec("DELETE FROM user_roles WHERE user_id IN (SELECT id FROM \"users\" WHERE email NOT IN ('superadmin@azpulse.local', 'admin@azpulse.local'))");
    $pdo->exec("DELETE FROM \"users\" WHERE email NOT IN ('superadmin@azpulse.local', 'admin@azpulse.local')");
    $pdo->commit();
    echo "Users and requests deleted.\n";
} catch (Exception $e) {
    $pdo->rollBack();
    echo "Error: " . $e->getMessage() . "\n";
}
