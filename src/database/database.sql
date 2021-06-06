CREATE TABLE rol(
	id_rol					INT 			NOT NULL AUTO_INCREMENT,
    rol						VARCHAR(10)		NOT NULL UNIQUE,
	nombre					VARCHAR(255) 	NOT NULL,
	status                  VARCHAR(10)    	NOT NULL DEFAULT 'ACTIVO',
	creation_date           DATETIME        DEFAULT NOW(),
    creation_user           INT		    	NOT NULL,
    down_date               DATETIME        NULL,
    down_user               VARCHAR(15)    	NULL,     
    PRIMARY KEY (id_rol)
);

INSERT INTO rol(rol,nombre,creation_user) VALUES('ADMIN', 'USUARIO ADMINISTRADOR DEL SISTEMA',1);
INSERT INTO rol(rol,nombre,creation_user) VALUES('EDITORIAL', 'USUARIO EDITORIAL',1);
INSERT INTO rol(rol,nombre,creation_user) VALUES('CLIENTE', 'USUARIO CLIENTE',1);

CREATE TABLE usuario(
    id_user                 INT      		NOT NULL AUTO_INCREMENT,
    primer_nombre           VARCHAR(40)   	NOT NULL,
    segundo_nombre          VARCHAR(40)   	NULL,
    primer_apellido         VARCHAR(40)   	NOT NULL,
    segundo_apellido        VARCHAR(40)   	NULL,
    nombre_editorial        VARCHAR(40)     NOT NULL DEFAULT '',
    status                  VARCHAR(10)    	NOT NULL DEFAULT 'ACTIVO',
    id_rol                  INT 	 	    NOT NULL,
    dpi					    VARCHAR(15)    	NULL,
    username                VARCHAR(50)    	NOT NULL,
    creation_date           DATETIME        DEFAULT NOW(),
    creation_user           INT		    	NOT NULL,
    down_date               DATETIME        NULL,
    down_user               VARCHAR(15)    	NULL,     
    PRIMARY KEY (id_user),
    FOREIGN KEY (id_rol) references rol(id_rol)
);

CREATE TABLE empresa(
    id_empresa              INT      		NOT NULL AUTO_INCREMENT,
    nombre	                VARCHAR(200)   	NOT NULL UNIQUE,
    status                  VARCHAR(10)    	NOT NULL DEFAULT 'ACTIVO',
    contacto                VARCHAR(200)	NOT NULL,
    telefono                VARCHAR(20)		NOT NULL,
    direccion				VARCHAR(200)	NOT NULL,	
    creation_date           DATETIME        DEFAULT NOW(),
    creation_user           VARCHAR(100)   	NOT NULL,
    down_date               DATETIME        NULL,
    down_user               VARCHAR(15)    	NULL,     
    PRIMARY KEY (id_empresa)
);

CREATE TABLE empresa_usuario (
	id_empresa_usuario	INT  		NOT NULL AUTO_INCREMENT,
	id_empresa          INT  		NOT NULL,
	id_usuario			INT  		NOT NULL,
	status          	VARCHAR(10)    	NOT NULL DEFAULT 'ACTIVO',
	creation_date   	DATETIME    DEFAULT NOW(),
    creation_user   	INT		    NOT NULL,
    down_date       	DATETIME    NULL,
    down_user       	VARCHAR(15) NULL,     
    PRIMARY KEY (id_empresa_usuario),
    FOREIGN KEY (id_empresa) references empresa(id_empresa),
    FOREIGN KEY (id_usuario) references usuario(id_user),
    FOREIGN KEY (creation_user) references usuario(id_user)
);

CREATE TABLE usuario_password (
	id_password			INT  			NOT NULL AUTO_INCREMENT,
	id_user	        	INT  			NOT NULL,
	password        	VARCHAR(100)    NOT NULL,
	password_temporary	BIT				NOT NULL DEFAULT 0,
	status				VARCHAR(10)		NOT NULL DEFAULT 'ACTIVO',
	creation_date   	DATETIME    DEFAULT NOW(),
    creation_user   	INT		    NOT NULL,
    down_date       	DATETIME    NULL,
    down_user       	VARCHAR(15) NULL,     
    PRIMARY KEY (id_password),
    FOREIGN KEY (id_user) references usuario(id_user),
    FOREIGN KEY (creation_user) references usuario(id_user)
);

CREATE TABLE usuario_telefono (
	id_telefono			INT  			NOT NULL AUTO_INCREMENT,
	id_user	        	INT  			NOT NULL,
	telefono        	VARCHAR(100)    NOT NULL,
	tipo				VARCHAR(10)		NOT NULL DEFAULT 'PRINCIPAL',
	status				VARCHAR(10)		NOT NULL DEFAULT 'ACTIVO',
	creation_date   	DATETIME    DEFAULT NOW(),
    creation_user   	INT		    NOT NULL,
    down_date       	DATETIME    NULL,
    down_user       	VARCHAR(15) NULL,     
    PRIMARY KEY (id_telefono),
    FOREIGN KEY (id_user) references usuario(id_user),
    FOREIGN KEY (creation_user) references usuario(id_user)
);


CREATE TABLE usuario_correo (
	id_correo			INT  			NOT NULL AUTO_INCREMENT,
	id_user	        	INT  			NOT NULL,
	correo	        	VARCHAR(100)    NOT NULL,
	tipo				VARCHAR(10)		NOT NULL DEFAULT 'PRINCIPAL',
	status				VARCHAR(10)		NOT NULL DEFAULT 'ACTIVO',
	creation_date   	DATETIME    DEFAULT NOW(),
    creation_user   	INT		    NOT NULL,
    down_date       	DATETIME    NULL,
    down_user       	VARCHAR(15) NULL,     
    PRIMARY KEY (id_correo),
    FOREIGN KEY (id_user) references usuario(id_user),
    FOREIGN KEY (creation_user) references usuario(id_user)
);


