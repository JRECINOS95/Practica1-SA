CREATE TABLE impuestos(
	id_impuesto	        	INT     		NOT NULL AUTO_INCREMENT,
    pais					VARCHAR(60)		NOT NULL,
    impuestos				NUMERIC(18,2)	NOT NULL DEFAULT 0,
    PRIMARY KEY (id_impuesto)
);

INSERT INTO impuestos (pais, impuestos) VALUES ('CANADA', 2.5);
INSERT INTO impuestos (pais, impuestos) VALUES ('ESTADOS UNIDOS', 5);
INSERT INTO impuestos (pais, impuestos) VALUES ('MÉXICO', 1.5);
INSERT INTO impuestos (pais, impuestos) VALUES ('EL SALVADOR', 0.5);
INSERT INTO impuestos (pais, impuestos) VALUES ('COLOMBIA', 8);
INSERT INTO impuestos (pais, impuestos) VALUES ('ARGENTINA', 10);
INSERT INTO impuestos (pais, impuestos) VALUES ('URUGUAY', 8.5);
INSERT INTO impuestos (pais, impuestos) VALUES ('ESPAÑA', 10);
INSERT INTO impuestos (pais, impuestos) VALUES ('FRANCIA', 6.8);
INSERT INTO impuestos (pais, impuestos) VALUES ('ALEMANIA', 2);
INSERT INTO impuestos (pais, impuestos) VALUES ('SUIZA', 3);
INSERT INTO impuestos (pais, impuestos) VALUES ('RUSIA', 3.8);