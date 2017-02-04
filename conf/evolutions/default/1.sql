# Users schema

# --- !Ups

CREATE TABLE USER (
    id bigint(20) NOT NULL AUTO_INCREMENT,
    dni varchar(9) NOT NULL,
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    first_name varchar(120) NOT NULL,
    last_name varchar(120) NOT NULL,
    PRIMARY KEY (id)
);

INSERT INTO USER (dni, email, password, first_name, last_name) VALUES ('33544118K','mnceleiro@esei.uvigo.es','1234','Marcos','Nunez Celeiro');
INSERT INTO USER (dni, email, password, first_name, last_name) VALUES ('33542112K','mrjato@esei.uvigo.es','1234','Miguel','Reboiro Jato');

# --- !Downs

DROP TABLE USER;