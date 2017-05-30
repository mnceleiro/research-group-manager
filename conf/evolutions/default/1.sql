# Users schema

# --- !Ups

CREATE TABLE ROLE (
  id bigint(20) NOT NULL,
  description varchar(100) NOT NULL,
  
  PRIMARY KEY (id)
);

CREATE TABLE CONGRESS_TYPE (
  id bigint(20) NOT NULL,
  description varchar(255) NOT NULL,
  
  PRIMARY KEY (id)
);

CREATE TABLE PUBLICATION_STATUS (
  id bigint(20) NOT NULL,
  description varchar(255) NOT NULL,
  
  PRIMARY KEY (id)
);

CREATE TABLE FIELD (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  description varchar(255) NOT NULL,
  
  PRIMARY KEY (id)
);

CREATE TABLE ENTITY (
    id bigint(20) NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    
    PRIMARY KEY (id)
);

CREATE TABLE USER (
    id bigint(20) NOT NULL AUTO_INCREMENT,
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    admin BIT NOT NULL DEFAULT 0,
    access BIT NOT NULL DEFAULT 0,
    
    UNIQUE(email),
    PRIMARY KEY (id)
);

CREATE TABLE RESEARCHER (
    id bigint(20) NOT NULL AUTO_INCREMENT,
    first_name varchar(120) NOT NULL,
    last_name varchar(120) NOT NULL,
    address varchar(200) NOT NULL,
    phone varchar(30) NOT NULL,
    
    user_id bigint(20) NOT NULL,
    
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES USER(id)
);

CREATE TABLE AUTHOR (
    id bigint(20) NOT NULL AUTO_INCREMENT,
    email varchar(255) NOT NULL,
    signature varchar(200) NOT NULL,
    res_id bigint(20),
    
    UNIQUE(email),
    PRIMARY KEY (id)
);
-- FOREIGN KEY (res_id) REFERENCES RESEARCHER(id)

CREATE TABLE PROJECT (
    id bigint(20) NOT NULL AUTO_INCREMENT,
    code varchar(255) NOT NULL,
    title varchar(255) NOT NULL,
    public BIT,
    start_date varchar(255),
    end_date varchar(255),
    budget bigint(20),
    researcher_count bigint(20) NOT NULL DEFAULT 0,
    
    PRIMARY KEY (id)
);

CREATE TABLE PROJECT_FINANCE_ENTITY (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  project_id bigint(20) NOT NULL,
  entity_id bigint(20) NOT NULL,
  
  PRIMARY KEY(id),
  FOREIGN KEY(project_id) REFERENCES PROJECT(id),
  FOREIGN KEY(entity_id) REFERENCES ENTITY(id)
);

CREATE TABLE PROJECT_ENTITY (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  project_id bigint(20) NOT NULL,
  entity_id bigint(20) NOT NULL,
  
  PRIMARY KEY(id),
  FOREIGN KEY(project_id) REFERENCES PROJECT(id),
  FOREIGN KEY(entity_id) REFERENCES ENTITY(id)
);

CREATE TABLE AUTHOR_PROJECT (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  author_id bigint(20) NOT NULL,
  project_id bigint(20) NOT NULL,
  
  role_id bigint(20) NOT NULL,
  
  UNIQUE (author_id, project_id),
  PRIMARY KEY (id),
  FOREIGN KEY (project_id) REFERENCES PROJECT(id),
  FOREIGN KEY (role_id) REFERENCES ROLE(id)
);
-- FOREIGN KEY (author_id) REFERENCES AUTHOR(id),

CREATE TABLE CONGRESS (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  title varchar(255) NOT NULL,
  name varchar(255) NOT NULL,
  place varchar(255),
  country varchar(255),
  start varchar(255),
  end varchar(255),
  international BIT NOT NULL DEFAULT 0,
  
  type bigint(20) NOT NULL,
  status bigint(20) NOT NULL,
-- status ENUM('JUSTIFICADO, 'ACEPTADO', 'ENVIADO'),
  
  PRIMARY KEY (id),
  FOREIGN KEY (type) REFERENCES CONGRESS_TYPE(id),
  FOREIGN KEY (status) REFERENCES PUBLICATION_STATUS(id)
);

CREATE TABLE AUTHOR_CONGRESS (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  author_id bigint(20) NOT NULL,
  congress_id bigint(20) NOT NULL,
  
  UNIQUE(author_id, congress_id),
  PRIMARY KEY (id),
  FOREIGN KEY (author_id) REFERENCES AUTHOR(id),
  FOREIGN KEY (congress_id) REFERENCES CONGRESS(id)
);


CREATE TABLE BOOK (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  code varchar(100),
  title varchar(255) NOT NULL,
  book varchar(255) NOT NULL,
  volume varchar(25),
  start_page bigint(20),
  end_page bigint(20),
  year bigint(20),
  editorial varchar(255) NOT NULL,
  place varchar(255) NOT NULL,
  isbn varchar(255),
  
  status bigint(20),
  
  PRIMARY KEY (id),
  FOREIGN KEY (status) REFERENCES PUBLICATION_STATUS(id)
);

CREATE TABLE AUTHOR_BOOK (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  book_id bigint(20) NOT NULL,
  author_id bigint(20) NOT NULL,
  
  PRIMARY KEY (id),
  FOREIGN KEY (author_id) REFERENCES AUTHOR(id),
  FOREIGN KEY (book_id) REFERENCES BOOK(id)
);


CREATE TABLE QUARTILE (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  field_id bigint(20) NOT NULL,
  number bigint(20) NOT NULL,
  
  PRIMARY KEY (id),
  FOREIGN KEY (field_id) REFERENCES FIELD (id)
);

CREATE TABLE JCR (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  year bigint(20) NOT NULL,
  impact_factor bigint(20) NOT NULL,
  quartile_id bigint(20) NOT NULL,
  
  PRIMARY KEY (id),
  FOREIGN KEY (quartile_id) REFERENCES QUARTILE (id)
);

CREATE TABLE JOURNAL (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  code varchar(255),
  title varchar(255) NOT NULL,
  journal varchar(255) NOT NULL,
  volume varchar(20) NOT NULL,
  start_page bigint(20),
  end_page bigint(20),
  date Date,
  editorial varchar(255),
  place varchar(255),
  issn varchar(255),
  
  status bigint(20),
  
  PRIMARY KEY (id),
  FOREIGN KEY (status) REFERENCES PUBLICATION_STATUS(id)
);

CREATE TABLE AUTHOR_JOURNAL (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  journal_id bigint(20) NOT NULL,
  author_id bigint(20) NOT NULL,
  
  PRIMARY KEY (id),
  FOREIGN KEY (author_id) REFERENCES AUTHOR(id),
  FOREIGN KEY (journal_id) REFERENCES JOURNAL(id)
);


INSERT INTO ROLE (id, description) VALUES (1, 'IP');
INSERT INTO ROLE (id, description) VALUES (2, 'PROFESOR');
INSERT INTO ROLE (id, description) VALUES (3, 'POSTDOC');
INSERT INTO ROLE (id, description) VALUES (4, 'DOC');
INSERT INTO ROLE (id, description) VALUES (5, 'BECARIO');
INSERT INTO ROLE (id, description) VALUES (6, 'OTROS');

INSERT INTO CONGRESS_TYPE (id, description) VALUES (1, 'PONENCIA');
INSERT INTO CONGRESS_TYPE (id, description) VALUES (2, 'POSTER');

INSERT INTO PUBLICATION_STATUS (id, description) VALUES (1, 'JUSTIFICADO');
INSERT INTO PUBLICATION_STATUS (id, description) VALUES (2, 'ACEPTADO');
INSERT INTO PUBLICATION_STATUS (id, description) VALUES (3, 'ENVIADO');

INSERT INTO FIELD (id, description) VALUES (1, 'CIENCIAS DE LA COMPUTACIÓN');
INSERT INTO FIELD (id, description) VALUES (2, 'BIOLOGÍA');
INSERT INTO FIELD (id, description) VALUES (3, 'INGENIERÍA NAVAL');
INSERT INTO FIELD (id, description) VALUES (4, 'INTELIGENCIA ARTIFICIAL');
INSERT INTO FIELD (id, description) VALUES (5, 'INGENIERÍA CIVIL');

INSERT INTO USER (email, password, admin, access) VALUES ('mnceleiro@esei.uvigo.es','$2a$12$l/xZ9uxuWijTvc14Ff5AVur6FIFMogs0DFdVhlfmHR3XWgvmQIVke', TRUE, TRUE);

INSERT INTO USER (email, password, admin, access) VALUES ('ocanellas@gmail.com','$2a$12$l/xZ9uxuWijTvc14Ff5AVur6FIFMogs0DFdVhlfmHR3XWgvmQIVke', 0, 0);
INSERT INTO USER (email, password, admin, access) VALUES ('dmritchie@yahoo.es','$2a$12$l/xZ9uxuWijTvc14Ff5AVur6FIFMogs0DFdVhlfmHR3XWgvmQIVke', 1, 1);
INSERT INTO USER (email, password, admin, access) VALUES ('ltorval@esei.uvigo.es','$2a$12$l/xZ9uxuWijTvc14Ff5AVur6FIFMogs0DFdVhlfmHR3XWgvmQIVke', 1, 1);
INSERT INTO USER (email, password, admin, access) VALUES ('mrjato@esei.uvigo.es','$2a$12$l/xZ9uxuWijTvc14Ff5AVur6FIFMogs0DFdVhlfmHR3XWgvmQIVke', 0, 1);

INSERT INTO RESEARCHER (first_name, last_name, address, phone, user_id) VALUES ('Marcos', 'Núñez Celeiro', 'Calle Empanada de Zorza nº5', '9825312121', 1);
INSERT INTO RESEARCHER (first_name, last_name, address, phone, user_id) VALUES ('Oscar', 'Mixwell Cañellas', 'Calle Alcantara nº12', '9825312122', 2);
INSERT INTO RESEARCHER (first_name, last_name, address, phone, user_id) VALUES ('Dennis', 'MacAlistair Ritchie', 'Avenida Curros Enriquez 7', '9825312123', 3);
INSERT INTO RESEARCHER (first_name, last_name, address, phone, user_id) VALUES ('Linus', 'Benedict Torvalds', 'Plaza Pontevedra 122', '9825312124', 4);
INSERT INTO RESEARCHER (first_name, last_name, address, phone, user_id) VALUES ('Miguel', 'Reboiro Jato', 'Avenida de la Coruña 17', '9825312125', 5);

INSERT INTO AUTHOR (email, signature, res_id) VALUES ('mnceleiro@esei.uvigo.es', 'Marcos Nunez-Celeiro', 1);
INSERT INTO AUTHOR (email, signature, res_id) VALUES ('ocanellas@gmail.com', 'Oscar Mixwell Cañellas', 2);
INSERT INTO AUTHOR (email, signature, res_id) VALUES ('dmritchie@yahoo.es', 'Dennis MacAlistair-Ritchie', 3);
INSERT INTO AUTHOR (email, signature, res_id) VALUES ('ltorval@esei.uvigo.es', 'Linus Benedict-Torvalds', 4);
INSERT INTO AUTHOR (email, signature, res_id) VALUES ('mrjato@esei.uvigo.es', 'Miguel Reboiro-Jato', 5);
INSERT INTO AUTHOR (email, signature) VALUES ('mfowler@gmail.com', 'Martin Fowler');

INSERT INTO PROJECT (code, public, title, start_date, end_date, budget, researcher_count) VALUES ('2323', 1, 'title1', '02/07/2017', '03/10/2017', 3000, 4);
INSERT INTO PROJECT (code, public, title, start_date, end_date, budget, researcher_count) VALUES ('2324', 1, 'title2', '26/06/2017', '14/09/2017', 4000, 5);
INSERT INTO PROJECT (code, public, title, start_date, end_date, budget, researcher_count) VALUES ('1212', 1, 'Proyecto de prueba', '08/11/2017', '21/12/2017', 2122, 5);

INSERT INTO AUTHOR_PROJECT (author_id, project_id, role_id) VALUES (1, 1, 1);
INSERT INTO AUTHOR_PROJECT (author_id, project_id, role_id) VALUES (2, 1, 1);
INSERT INTO AUTHOR_PROJECT (author_id, project_id, role_id) VALUES (1, 2, 1);


INSERT INTO CONGRESS (title, name, place, country, start, end, international, type, status) VALUES ('TITULO CONGRESO 1', 'NOMBRE CONGRESO 1', 'OURENSE', 'ESPAÑA', '18/07/2017', '18/07/2017', 1, 1, 1);
INSERT INTO CONGRESS (title, name, place, country, start, end, international, type, status) VALUES ('TITULO CONGRESO 2', 'NOMBRE CONGRESO 2', 'OURENSE', 'ESPAÑA', '05/07/2017', '05/07/2017', 1, 2, 3);
INSERT INTO CONGRESS (title, name, place, country, start, end, international, type, status) VALUES ('TITULO CONGRESO 3', 'NOMBRE CONGRESO 3', 'OURENSE', 'ESPAÑA', '11/07/2017', '12/07/2017', 0, 2, 1);

INSERT INTO AUTHOR_CONGRESS (author_id, congress_id) VALUES (1, 1);
INSERT INTO AUTHOR_CONGRESS (author_id, congress_id) VALUES (2, 1);
INSERT INTO AUTHOR_CONGRESS (author_id, congress_id) VALUES (1, 2);

INSERT INTO BOOK 
  (code, title, book, volume, start_page, end_page, year, editorial, place, isbn, status) 
VALUES 
  ('39887L', 'SOFTWARE FOR BIOIMAGING', 'BOOK OF SOFTWARE FOR BIOIMAGING', '3:12', '0', '0', '2016', 'Intech', 'Ourense', '1758-2946', 1);
  
INSERT INTO AUTHOR_BOOK (book_id, author_id) VALUES (1, 1);

INSERT INTO QUARTILE (field_id, number) VALUES (1, 2);
INSERT INTO JCR (year, impact_factor, quartile_id) VALUES (2016, 7928, 1);
INSERT INTO JOURNAL 
  (code, title, journal, volume, start_page, end_page, date, editorial, place, issn, status) 
VALUES 
  ('2983AO9E', 'SOFTWARE FOR BIOIMAGING', 'MAGAZINE OF SOFTWARE FOR BIOIMAGING', '8:22', '0', '0', '2016-02-12', '', '', '1758-2946', 1);
  
INSERT INTO AUTHOR_JOURNAL (journal_id, author_id) VALUES (1, 1);

# --- !Downs

DROP TABLE AUTHOR_PROJECT;
DROP TABLE AUTHOR_CONGRESS;
DROP TABLE AUTHOR_BOOK;
DROP TABLE AUTHOR_JOURNAL;

DROP TABLE PROJECT_ENTITY;
DROP TABLE PROJECT_FINANCE_ENTITY;

DROP TABLE CONGRESS;
DROP TABLE PROJECT;

DROP TABLE BOOK;

DROP TABLE JOURNAL;
DROP TABLE JCR;
DROP TABLE QUARTILE;

DROP TABLE AUTHOR;
DROP TABLE RESEARCHER;
DROP TABLE USER;

DROP TABLE ENTITY;
DROP TABLE FIELD;
DROP TABLE PUBLICATION_STATUS;
DROP TABLE CONGRESS_TYPE;
DROP TABLE ROLE;