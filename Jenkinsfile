pipeline {
    agent { label 'worker' }

    options {
        timestamps()
        disableConcurrentBuilds()
    }

    environment {
        BACKEND_IMAGE  = "bingo-backend:latest"
        FRONTEND_IMAGE = "bingo-frontend:latest"
        SONAR_HOST_URL = "http://192.168.80.20:9000"
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Pushpak3504/Barik_Project.git'
            }
        }

        stage('SonarQube SAST (Docker Scanner)') {
            steps {
                withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_TOKEN')]) {
                    sh '''
                      docker run --rm \
                        -v "$PWD:/usr/src" \
                        sonarsource/sonar-scanner-cli \
                        -Dsonar.projectBaseDir=/usr/src \
                        -Dsonar.host.url=$SONAR_HOST_URL \
                        -Dsonar.login=$SONAR_TOKEN
                    '''
                }
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

        stage('Trivy Image Scan') {
            steps {
                sh '''
                  trivy image --severity HIGH,CRITICAL ${BACKEND_IMAGE} || true
                  trivy image --severity HIGH,CRITICAL ${FRONTEND_IMAGE} || true
                '''
            }
        }

        stage('Deploy (Docker Compose)') {
            steps {
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
            echo "✅ SUCCESS: SAST + Build + Deploy completed"
        }
        failure {
            echo "❌ FAILURE: Pipeline failed"
        }
    }
}
