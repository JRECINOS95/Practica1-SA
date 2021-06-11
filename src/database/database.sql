CREATE TABLE usuario(
    id_user                 INT      		NOT NULL AUTO_INCREMENT,
    primer_nombre           VARCHAR(40)   	NOT NULL,
    segundo_nombre          VARCHAR(40)   	NOT NULL,
    primer_apellido         VARCHAR(40)   	NOT NULL,
    segundo_apellido        VARCHAR(40)   	NOT NULL,
    status                  VARCHAR(10)    	NOT NULL DEFAULT 'ACTIVO',
    rol                  	VARCHAR(30)	    NOT NULL,
    username                VARCHAR(50)    	NOT NULL,
    password                VARCHAR(50)    	NOT NULL,
    telefono				VARCHAR(10)    	NOT NULL,
    direccion               VARCHAR(100)    	NOT NULL,
    creation_date           DATETIME        DEFAULT NOW(),
    PRIMARY KEY (id_user)
);

INSERT INTO usuario(primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, rol, username, password, telefono, direccion) 
             VALUES('USUARIO','','ADMINISTRADOR','','ADMINISTRADOR','admin@admin.com','Abc123**','12345678','CIUDAD');

