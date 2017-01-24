# Users schema

# --- !Ups

CREATE TABLE User (
    id bigint(20) NOT NULL AUTO_INCREMENT,
    dni varchar(9) NOT  NULL,
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    name varchar(120) NOT NULL,
    surname varchar(120) NOT NULL,
    isAdmin boolean NOT NULL,
    PRIMARY KEY (id)
);

# --- !Downs

DROP TABLE User;