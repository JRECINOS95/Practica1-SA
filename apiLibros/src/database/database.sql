CREATE TABLE genero_literario(
	id_genero               INT      		NOT NULL AUTO_INCREMENT,
    nombre		            VARCHAR(40)   	NOT NULL,
    PRIMARY KEY (id_genero)
);

INSERT INTO genero_literario(nombre) VALUES ('Novela');
INSERT INTO genero_literario(nombre) VALUES ('Fábula');
INSERT INTO genero_literario(nombre) VALUES ('Cuento');
INSERT INTO genero_literario(nombre) VALUES ('Mito');
INSERT INTO genero_literario(nombre) VALUES ('Leyenda');
INSERT INTO genero_literario(nombre) VALUES ('Poema');
INSERT INTO genero_literario(nombre) VALUES ('Épico');
INSERT INTO genero_literario(nombre) VALUES ('Oda');
INSERT INTO genero_literario(nombre) VALUES ('Tragedia');
INSERT INTO genero_literario(nombre) VALUES ('Comedia');

CREATE TABLE libro(
	id_libro                INT      		NOT NULL AUTO_INCREMENT,
    nombre		            VARCHAR(40)   	NOT NULL,
    autor					VARCHAR(40)   	NOT NULL,
    url						VARCHAR(400)   	NOT NULL,
    id_user					INT 			NOT NULL,
    stock					INT 			NOT NULL DEFAULT 0,
	status                  VARCHAR(10)    	NOT NULL DEFAULT 'ACTIVO',
    creation_date           DATETIME        DEFAULT NOW(),
    PRIMARY KEY (id_libro)
);

ALTER TABLE libro ADD precio NUMERIC(18,2) NOT NULL DEFAULT 0;
ALTER TABLE libro
ADD FOREIGN KEY (id_user) REFERENCES usuario(id_user);

CREATE TABLE libro_genero(
	id_genero_libro        INT      		NOT NULL AUTO_INCREMENT,
    id_libro			   INT				NOT NULL,
    id_genero			   INT				NOT NULL,
    PRIMARY KEY (id_genero_libro)
);

ALTER TABLE libro_genero
ADD FOREIGN KEY (id_libro) REFERENCES libro(id_libro);
ALTER TABLE libro_genero
ADD FOREIGN KEY (id_genero) REFERENCES genero_literario(id_genero);

CREATE TABLE solicitud_libro (
	solicitud_libro	        INT      		NOT NULL AUTO_INCREMENT,
    nombre		            VARCHAR(40)   	NOT NULL,
    autor					VARCHAR(40)   	NOT NULL,
	fec_primera_publicacion	VARCHAR(20)     NOT NULL,
    nombre_archivo			VARCHAR(200)    NULL,
    status                  VARCHAR(20)    	NOT NULL DEFAULT 'ACTIVO',
    id_cliente				INT				NOT NULL,
    id_editorial			INT				NULL,
    fecha_aceptacion		datetime		NULL,
    PRIMARY KEY (solicitud_libro)
);


ALTER TABLE solicitud_libro
ADD FOREIGN KEY (id_cliente) REFERENCES usuario(id_user);

ALTER TABLE solicitud_libro
ADD FOREIGN KEY (id_editorial) REFERENCES usuario(id_user);