@Library('Shared') _
pipeline {
    agent { label 'scott'}

    environment {
        IMAGE_NAME = 'task-manager-frontend'
        IMAGE_TAG = 'latest'
        DOCKER_USER = 'prasadpingale24'
    }

    stages{
        stage('Checkout'){
            steps{
                checkout scm
            }
        }

        stage('Prepare Environment'){
            steps{
                prepare_env()
            }
        }

        stage('Test'){
            steps{
                docker_testing()
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
    }
}
