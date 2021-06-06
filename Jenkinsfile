pipeline {
	agent any
	stages {
		stage("Construccion") {
			when {
				branch 'main'
			}
			steps {
				echo 'Inicio de descarga de paquetes y construccion del proyecto'
				
				echo 'Fin  de descarga de paquetes y construccion del proyecto'
			}
		}

		stage("Testing") {
			when {
				branch 'main'
			}
			steps {
				echo 'Inicio de Pruebas Unitarias'

				echo 'Fin de Pruebas Unitarias'
			}
		}
		stage("Deploy") {
			when {
				branch 'main'
			}
			steps {
				echo 'Inicio de Despliegue de la Aplicacion'
				echo 'Fin de Despliegue de la Aplicacion'
			}
		}
	}
}
