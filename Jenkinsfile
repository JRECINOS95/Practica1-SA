pipeline {
    agent any

    stages {
        stage('Construccion') {
            steps {
                echo 'Building..'
                sh '''
                    cd apiUsuarios
					npm i
                    npm run build
                    cd ../apiLibros
                    npm i
                    npm run build
				'''
            }
        }
        stage('Pruebas') {
            steps {
                echo 'Testing..'
                sh '''
                    cd apiUsuarios
                    npm run test
                    cd ../apiLibros
                    npm run test
				'''
            }
        }
        stage('Despliegue') {
            steps {
                echo 'Deploying....'
                sh '''
                    cd apiUsuarios
                    npm i
                    npm run build
                    docker-compose up -d --build
                    cd ../apiLibros
                    npm i
                    npm run build
                    docker-compose up -d --build
				'''
            }
        }
    }
}
