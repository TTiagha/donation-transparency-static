<?php
// Script to extract AWS SES configuration from WordPress
// This will help us get your existing AWS credentials

// WordPress configuration path
$wp_config_path = '/mnt/c/xampp/htdocs/wordpress/wp-config.php';

if (!file_exists($wp_config_path)) {
    die("WordPress config not found at: $wp_config_path\n");
}

// Load WordPress configuration
require_once $wp_config_path;

// WordPress database configuration
$db_host = DB_HOST;
$db_name = DB_NAME;
$db_user = DB_USER;
$db_pass = DB_PASSWORD;

try {
    // Connect to WordPress database
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Get table prefix
    $table_prefix = $table_prefix ?? 'wp_';
    
    // Query for WP Mail SES settings
    $stmt = $pdo->prepare("SELECT option_value FROM {$table_prefix}options WHERE option_name = 'wp_mail_ses_settings'");
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($result) {
        $settings = unserialize($result['option_value']);
        
        if ($settings && is_array($settings)) {
            echo "=== AWS SES Configuration Found ===\n";
            echo "AWS Region: " . ($settings['aws_region'] ?? 'us-east-1') . "\n";
            echo "AWS Access Key ID: " . (isset($settings['aws_access_key_id']) ? substr($settings['aws_access_key_id'], 0, 5) . '...' : 'Not set') . "\n";
            echo "AWS Secret Key: " . (isset($settings['aws_secret_access_key']) ? 'Set (hidden)' : 'Not set') . "\n";
            echo "SMTP Username: " . ($settings['smtp_username'] ?? 'Not set') . "\n";
            echo "SMTP Fallback: " . (($settings['enable_smtp_fallback'] ?? false) ? 'Enabled' : 'Disabled') . "\n";
            
            // Write configuration to file for use by the waitlist API
            $config = [
                'aws_region' => $settings['aws_region'] ?? 'us-east-1',
                'aws_access_key_id' => $settings['aws_access_key_id'] ?? '',
                'aws_secret_access_key' => $settings['aws_secret_access_key'] ?? '',
                'smtp_username' => $settings['smtp_username'] ?? '',
                'smtp_password' => $settings['smtp_password'] ?? '',
                'enable_smtp_fallback' => $settings['enable_smtp_fallback'] ?? false
            ];
            
            $config_file = '../config/aws-ses-config.php';
            $config_content = "<?php\n// AWS SES Configuration extracted from WordPress\nreturn " . var_export($config, true) . ";\n";
            file_put_contents($config_file, $config_content);
            
            echo "\nConfiguration saved to: $config_file\n";
            echo "You can now use the waitlist API with your existing AWS SES setup!\n";
        } else {
            echo "WP Mail SES settings found but could not parse.\n";
        }
    } else {
        echo "No WP Mail SES settings found in database.\n";
        echo "Make sure the plugin is activated and configured.\n";
    }
    
} catch (PDOException $e) {
    echo "Database connection failed: " . $e->getMessage() . "\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>