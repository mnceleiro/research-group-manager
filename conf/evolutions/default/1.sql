# Users schema

# --- !Ups

CREATE TABLE USER (
    id bigint(20) NOT NULL AUTO_INCREMENT,
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    first_name varchar(120) NOT NULL,
    last_name varchar(120) NOT NULL,
    signature_name varchar(200) NOT NULL,
    address varchar(200) NOT NULL,
    phone varchar(30) NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO USER (email, password, first_name, last_name, signature_name, address, phone) VALUES ('mnceleiro@esei.uvigo.es','1234','Marcos','Nunez Celeiro', 'Marcos Nunez Celeiro', 'Calle Empanada de Zorza nº5', '9825312121');
INSERT INTO USER (email, password, first_name, last_name, signature_name, address, phone) VALUES ('ocanellas@gmail.com','1234','Oscar','Cañellas', 'Oscar Mixwell Cañellas', 'Calle Alcantara nº12', '9825312122');
INSERT INTO USER (email, password, first_name, last_name, signature_name, address, phone) VALUES ('dmritchie@yahoo.es','1234','Dennis','MacAlistair Ritchie', 'Dennis MacAlistair-Ritchie', 'Avenida Curros Enriquez 7', '9825312123');
INSERT INTO USER (email, password, first_name, last_name, signature_name, address, phone) VALUES ('ltorval@esei.uvigo.es','1234','Linus','Benedict Torvalds', 'Linus Benedict-Torvalds', 'Plaza Pontevedra 122', '9825312124');
INSERT INTO USER (email, password, first_name, last_name, signature_name, address, phone) VALUES ('mrjato@esei.uvigo.es','1234','Miguel','Reboiro Jato', 'Miguel Reboiro-Jato', 'Avenida de la Coruña 17', '9825312125');

# --- !Downs

DROP TABLE USER;
