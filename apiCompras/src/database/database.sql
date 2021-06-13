CREATE TABLE transaccion(
	id_transaccion        	INT     		NOT NULL AUTO_INCREMENT,
    id_libro			   	INT				NOT NULL,
    id_user				   	INT 			NOT NULL,
    cantidad			   	INT 			NOT NULL,
    valor_unitario			NUMERIC(18,2) 	NOT NULL DEFAULT 0,
	valor_final				NUMERIC(18,2) 	NOT NULL DEFAULT 0,
    tipo_pago				VARCHAR(10)		NOT NULL,
    numero_tarjeta			VARCHAR(20)		NOT NULL,
    vencimiento_tarjeta		VARCHAR(10)		NOT NULL,
    cvv_tarjeta				VARCHAR(20)		NOT NULL,
    PRIMARY KEY (id_transaccion)
);

ALTER TABLE transaccion
ADD FOREIGN KEY (id_libro) REFERENCES libro(id_libro);
ALTER TABLE transaccion
ADD FOREIGN KEY (id_user) REFERENCES usuario(id_user);

CREATE TABLE medio_envio(
	id_medio_envio        	INT     		NOT NULL AUTO_INCREMENT,
    id_transaccion        	INT     		NOT NULL,
    tipo_medio				VARCHAR(10)		NOT NULL,
    direccion				VARCHAR(100)	NOT NULL,
	PRIMARY KEY (id_medio_envio)
);

ALTER TABLE medio_envio
ADD FOREIGN KEY (id_transaccion) REFERENCES transaccion(id_transaccion);