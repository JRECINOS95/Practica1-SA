CREATE TABLE genero_literario(
	id_genero               INT      		NOT NULL AUTO_INCREMENT,
    nombre		            VARCHAR(40)   	NOT NULL,
    PRIMARY KEY (id_genero)
);

CREATE TABLE libro(
	id_libro                INT      		NOT NULL AUTO_INCREMENT,
    nombre		            VARCHAR(40)   	NOT NULL,
    url						VARCHAR(400)   	NOT NULL,
    PRIMARY KEY (id_libro)
);

CREATE TABLE libro_genero(
	id_genero_libro        INT      		NOT NULL AUTO_INCREMENT,
    id_libro			   INT				NOT NULL,
    id_genero			   INT				NOT NULL,
    PRIMARY KEY (id_genero_libro)
);
