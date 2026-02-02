pipeline {
    agent { label 'worker' }

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        BACKEND_IMAGE  = "bingo-backend:latest"
        FRONTEND_IMAGE = "bingo-frontend:latest"
    }

    stages {

        stage('Checkout Code from GitHub') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Pushpak3504/Barik_Project.git'
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                sh '''
                  cd backend
                  docker build -t ${BACKEND_IMAGE} .
                '''
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                sh '''
                  cd frontend
                  docker build -t ${FRONTEND_IMAGE} .
                '''
            }
        }

        stage('Trivy Image Security Scan') {
            steps {
                sh '''
                  trivy image --severity HIGH,CRITICAL ${BACKEND_IMAGE} || true
                  trivy image --severity HIGH,CRITICAL ${FRONTEND_IMAGE} || true
                '''
            }
        }

        stage('Deploy Application (Docker Compose)') {
            steps {
                sh '''
                  docker compose down
                  docker compose up -d
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Bingo DevSecOps App Deployed Successfully"
        }
        failure {
            echo "❌ Pipeline Failed – Check Jenkins Console Logs"
        }
    }
}
