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
    role bigint(20) NOT NULL default 2,
    PRIMARY KEY (id)
);

CREATE TABLE ROLES (
  id bigint(20) NOT NULL,
  description varchar(100) NOT NULL
);

INSERT INTO ROLES (id, description) VALUES (1, "IP");
INSERT INTO ROLES (id, description) VALUES (2, "PROFESSOR");
INSERT INTO ROLES (id, description) VALUES (3, "POSTDOC");
INSERT INTO ROLES (id, description) VALUES (4, "DOC");
INSERT INTO ROLES (id, description) VALUES (5, "SCHOLAR");
INSERT INTO ROLES (id, description) VALUES (6, "OTHERS");

INSERT INTO USER (email, password, first_name, last_name, signature_name, address, phone, role) VALUES ('mnceleiro@esei.uvigo.es','$2a$12$l/xZ9uxuWijTvc14Ff5AVur6FIFMogs0DFdVhlfmHR3XWgvmQIVke','Marcos','Nunez Celeiro', 'Marcos Nunez Celeiro', 'Calle Empanada de Zorza nº5', '9825312121', 2);
INSERT INTO USER (email, password, first_name, last_name, signature_name, address, phone, role) VALUES ('ocanellas@gmail.com','1234','Oscar','Cañellas', 'Oscar Mixwell Cañellas', 'Calle Alcantara nº12', '9825312122', 2);
INSERT INTO USER (email, password, first_name, last_name, signature_name, address, phone, role) VALUES ('dmritchie@yahoo.es','1234','Dennis','MacAlistair Ritchie', 'Dennis MacAlistair-Ritchie', 'Avenida Curros Enriquez 7', '9825312123', 2);
INSERT INTO USER (email, password, first_name, last_name, signature_name, address, phone, role) VALUES ('ltorval@esei.uvigo.es','1234','Linus','Benedict Torvalds', 'Linus Benedict-Torvalds', 'Plaza Pontevedra 122', '9825312124', 2);
INSERT INTO USER (email, password, first_name, last_name, signature_name, address, phone, role) VALUES ('mrjato@esei.uvigo.es','1234','Miguel','Reboiro Jato', 'Miguel Reboiro-Jato', 'Avenida de la Coruña 17', '9825312125', 2);

# --- !Downs

DROP TABLE USER;
