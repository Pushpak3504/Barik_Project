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
                echo "📥 Cloning source code from GitHub"
                git branch: 'main',
                    url: 'https://github.com/Pushpak3504/Barik_Project.git'
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                echo "🐳 Building Backend Docker Image"
                sh '''
                  cd backend
                  docker build -t ${BACKEND_IMAGE} .
                '''
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                echo "🐳 Building Frontend Docker Image"
                sh '''
                  cd frontend
                  docker build -t ${FRONTEND_IMAGE} .
                '''
            }
        }

        stage('Trivy Image Security Scan') {
            steps {
                echo "🔐 Scanning Docker images with Trivy"
                sh '''
                  trivy image --severity HIGH,CRITICAL ${BACKEND_IMAGE} || true
                  trivy image --severity HIGH,CRITICAL ${FRONTEND_IMAGE} || true
                '''
            }
        }

        stage('Deploy Application (Docker Compose)') {
            steps {
                echo "🚀 Deploying application using Docker Compose"
                sh '''
                  docker compose down --remove-orphans || true
                  docker ps -aq --filter "name=bingo-" | xargs -r docker rm -f
                  docker compose up -d --build
                '''
            }
        }
    }

    post {
        success {
            echo "✅ SUCCESS: Bingo DevSecOps App deployed successfully"
        }
        failure {
            echo "❌ FAILURE: Pipeline failed – check logs"
        }
        always {
            echo "📌 Pipeline execution finished"
        }
    }
}
