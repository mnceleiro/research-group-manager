# Users schema

# --- !Ups

CREATE TABLE USER (
    id bigint(20) NOT NULL AUTO_INCREMENT,
    dni varchar(9) NOT  NULL,
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    first_name varchar(120) NOT NULL,
    last_name varchar(120) NOT NULL,
    isAdmin boolean NOT NULL,
    PRIMARY KEY (id)
);

# --- !Downs

DROP TABLE User;