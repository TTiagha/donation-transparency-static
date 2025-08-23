#!/usr/bin/env python3
import zipfile
import boto3
import os
import shutil

def create_minimal_package():
    print("Creating minimal deployment package...")
    
    # Remove old zip
    if os.path.exists('minimal-deploy.zip'):
        os.remove('minimal-deploy.zip')
    
    with zipfile.ZipFile('minimal-deploy.zip', 'w', zipfile.ZIP_DEFLATED) as zipf:
        # Add main files
        zipf.write('index.js')
        zipf.write('package.json')
        
        # Add ALL node_modules to ensure no missing dependencies
        print("Adding ALL node_modules dependencies...")
        node_modules_path = 'node_modules'
        if os.path.exists(node_modules_path):
            for root, dirs, files in os.walk(node_modules_path):
                # Skip some common unnecessary directories for size optimization
                dirs[:] = [d for d in dirs if d not in ['.bin', 'test', 'tests', '__tests__', 'examples', 'example', 'bench', 'benchmark']]
                
                for file in files:
                    # Skip unnecessary files for size optimization
                    if file.endswith(('.md', '.txt', '.yml', '.yaml', '.ts', '.map', '.d.ts')) and not file.endswith('.json'):
                        continue
                    
                    file_path = os.path.join(root, file)
                    arcname = os.path.relpath(file_path, '.')
                    try:
                        zipf.write(file_path, arcname)
                    except Exception as e:
                        print(f"  ⚠ Could not add {file_path}: {e}")
            print(f"  ✓ Added complete node_modules tree")

def deploy_to_lambda():
    print("Deploying to Lambda...")
    try:
        lambda_client = boto3.client('lambda', region_name='us-east-1')
        
        with open('minimal-deploy.zip', 'rb') as zip_file:
            response = lambda_client.update_function_code(
                FunctionName='booking-system',
                ZipFile=zip_file.read()
            )
        
        print("✅ Lambda function updated successfully!")
        print(f"Last Modified: {response['LastModified']}")
        return True
        
    except Exception as e:
        print(f"❌ Error updating Lambda: {e}")
        return False

if __name__ == "__main__":
    create_minimal_package()
    if deploy_to_lambda():
        print("🧪 Testing API...")
        # Test will be done separately
    else:
        print("❌ Deployment failed")