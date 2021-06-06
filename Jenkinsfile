pipeline {
    agent any

    stages {
        stage('Construccion') {
            steps {
                echo 'Building..'
                sh '''
					npm i
                    npm run build
				'''
            }
        }
        stage('Pruebas') {
            steps {
                echo 'Testing..'
                sh '''
					npm i
                    npm run test
				'''
            }
        }
        stage('Despliegue') {
            steps {
                echo 'Deploying....'
            }
        }
    }
}
