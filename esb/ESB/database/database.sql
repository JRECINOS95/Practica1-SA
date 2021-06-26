use esb;


CREATE TABLE Ruta(
    RutaId              	INT      		NOT NULL AUTO_INCREMENT,
    Nombre	                VARCHAR(200)   	NOT NULL,
    Llave                   VARCHAR(200)	NOT NULL,
    Tipo					VARCHAR(5)	    NOT NULL,
    Ruta					VARCHAR(200)	NOT NULL,
    creation_user           VARCHAR(100)   	NOT NULL DEFAULT 'JRECINOS',
    creation_date           DATETIME        DEFAULT NOW(),
	status                  VARCHAR(10)    	NOT NULL DEFAULT 'ACTIVO',
    down_date               DATETIME        NULL,
    down_user               VARCHAR(15)    	NULL,     
    PRIMARY KEY (RutaId)
);

CREATE TABLE RutaParametro(
    RutaParametroId		   	INT      		NOT NULL AUTO_INCREMENT,
    Nombre	                VARCHAR(200)   	NOT NULL,
    RutaId	                INT				NOT NULL,
    creation_user           VARCHAR(100)   	NOT NULL DEFAULT 'JRECINOS',
    creation_date           DATETIME        DEFAULT NOW(),
	status                  VARCHAR(10)    	NOT NULL DEFAULT 'ACTIVO',
    down_date               DATETIME        NULL,
    down_user               VARCHAR(15)    	NULL,     
    PRIMARY KEY (RutaParametroId)
);

#USUARIOS
INSERT INTO Ruta (Nombre,Llave,Tipo,Ruta) values ('RegistrarUsuario','user.register','POST','http://35.209.82.125:7000/usuario');
INSERT INTO Ruta (Nombre,Llave,Tipo,Ruta) values ('Login','login.autenticacion','POST','http://35.209.82.125:7000/login');

#LIBROS
INSERT INTO Ruta (Nombre,Llave,Tipo,Ruta) values ('GuardarLibro','libro.add','POST','http://34.72.218.226:7070/libro');
INSERT INTO Ruta (Nombre,Llave,Tipo,Ruta) values ('ListaLibros','librolist','GET','http://34.72.218.226:7070/libro/lista/:id');
	INSERT INTO RutaParametro (Nombre,RutaId) VALUES ('id',(SELECT MAX(RutaId) FROM Ruta));
INSERT INTO Ruta (Nombre,Llave,Tipo,Ruta) values ('ObtenerLibro','libroget','GET','http://34.72.218.226:7070/libro/:id');
	INSERT INTO RutaParametro (Nombre,RutaId) VALUES ('id',(SELECT MAX(RutaId) FROM Ruta));

#COMPRA
INSERT INTO Ruta (Nombre,Llave,Tipo,Ruta) values ('IngresarCompra','compra.ingresar','POST','http://34.72.218.226:7060/compra');
