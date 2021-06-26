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
                    cd ../apiCompras
                    npm i
                    npm run build
                    cd ../apiBitacora
                    npm i
                    npm run build
                    cd ../apiImpuestos
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
                    cd ../apiCompras
                    npm run test
                    cd ../apiBitacora
                    npm run test
                    cd ../apiImpuestos
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
                    cd ../apiCompras
                    npm i
                    npm run build
                    docker-compose up -d --build
                    cd ../apiBitacora
                    npm i
                    npm run build
                    docker-compose up -d --build
                    cd ../apiImpuestos
                    npm i
                    npm run build
                    docker-compose up -d --build
                    cd ../esb
                    docker-compose up -d --build
				'''
            }
        }
    }
}
