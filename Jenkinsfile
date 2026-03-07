@Library("Shared") _

def DOCKER_USER = 'prasadpingale24'
def IMAGE_NAME = 'task-manager-frontend'
def IMAGE_TAG = 'latest'

def projectConfig = [
    projectName: 'Frontend',
    vars: [
        'VITE_API_BASE_URL': 'http://72.60.78.85:8000/api/v1',
        'NODE_ENV': 'production',
        'IMAGE_TAG': "${IMAGE_TAG}"
    ]
]

pipeline {
    agent { label 'scott'}

    stages{

        stage('Prepare Environment'){
            steps{
                prepareEnv(projectConfig)
            }
        }

        stage('Test'){
            steps{
                docker_test('frontend-test')
            }
        }

        stage('Build'){
            steps{
                docker_build(DOCKER_USER, IMAGE_NAME, IMAGE_TAG)
            }
        }

        stage('Push'){
            steps{
                docker_push(IMAGE_NAME, IMAGE_TAG)
            }
        }

        stage('Deploy'){
            steps{
                docker_deploy()
            }
        }

        stage('Health Check') {
            steps {
                healthCheck(url: "http://72.60.78.85:3000", maxRetries: 12, retryInterval: 10)
            }
        }
    }
}
