#!/usr/bin/env node

/**
 * Creates a Lambda deployment package with only necessary dependencies
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const archiver = require('archiver');

const LAMBDA_DIR = '/mnt/c/shock/static-pages/lambda';
const OUTPUT_FILE = '/mnt/c/shock/static-pages/function.zip';

// Essential dependencies for the Lambda function
const REQUIRED_DEPS = [
    'googleapis',
    'uuid',
    '@aws-sdk/client-ses',
    '@aws-sdk/client-ssm'
];

async function createDeploymentPackage() {
    console.log('Creating Lambda deployment package...');
    
    // Create a temporary directory
    const tempDir = '/tmp/lambda-package-' + Date.now();
    fs.mkdirSync(tempDir, { recursive: true });
    
    try {
        // Copy Lambda files
        console.log('Copying Lambda files...');
        fs.copyFileSync(path.join(LAMBDA_DIR, 'index.js'), path.join(tempDir, 'index.js'));
        fs.copyFileSync(path.join(LAMBDA_DIR, 'package.json'), path.join(tempDir, 'package.json'));
        
        // Install only production dependencies
        console.log('Installing production dependencies...');
        execSync('npm install --production --no-package-lock', {
            cwd: tempDir,
            stdio: 'inherit'
        });
        
        // Create zip file
        console.log('Creating zip file...');
        const output = fs.createWriteStream(OUTPUT_FILE);
        const archive = archiver('zip', {
            zlib: { level: 9 } // Maximum compression
        });
        
        return new Promise((resolve, reject) => {
            output.on('close', () => {
                const size = archive.pointer();
                console.log(`Package created: ${OUTPUT_FILE} (${(size / 1024 / 1024).toFixed(2)} MB)`);
                
                // Check if size is under Lambda limit (50MB for direct upload)
                if (size > 50 * 1024 * 1024) {
                    console.warn('WARNING: Package exceeds 50MB, will need to use S3 for deployment');
                }
                resolve();
            });
            
            archive.on('error', reject);
            
            archive.pipe(output);
            archive.directory(tempDir, false);
            archive.finalize();
        });
        
    } finally {
        // Cleanup
        console.log('Cleaning up temporary files...');
        execSync(`rm -rf ${tempDir}`, { stdio: 'ignore' });
    }
}

// Run if called directly
if (require.main === module) {
    createDeploymentPackage()
        .then(() => {
            console.log('Deployment package created successfully!');
            process.exit(0);
        })
        .catch(err => {
            console.error('Error creating deployment package:', err);
            process.exit(1);
        });
}

module.exports = { createDeploymentPackage };