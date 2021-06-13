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

CREATE TABLE libro_genero(
	id_genero_libro        INT      		NOT NULL AUTO_INCREMENT,
    id_libro			   INT				NOT NULL,
    id_genero			   INT				NOT NULL,
    PRIMARY KEY (id_genero_libro)
);
