CREATE DATABASE IF NOT EXISTS rgm DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
#CREATE DATABASE IF NOT EXISTS rgm_dev DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
#CREATE DATABASE IF NOT EXISTS rgm_test DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
  
CREATE USER IF NOT EXISTS 'rgmuser'@'localhost' IDENTIFIED BY 'rgmpassword';
GRANT ALL PRIVILEGES ON rgm.* TO 'rgmuser'@'localhost';
#GRANT ALL PRIVILEGES ON rgm_dev.* TO 'rgmuser'@'localhost';
#GRANT ALL PRIVILEGES ON rgm_test.* TO 'rgmuser'@'localhost';

use rgm;

CREATE TABLE IF NOT EXISTS ROLE (
  id bigint(20) NOT NULL,
  description varchar(100) NOT NULL,
  
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS CONGRESS_TYPE (
  id bigint(20) NOT NULL,
  description varchar(255) NOT NULL,
  
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS PUBLICATION_STATUS (
  id bigint(20) NOT NULL,
  description varchar(255) NOT NULL,
  
  PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS USER (
    id bigint(20) NOT NULL AUTO_INCREMENT,
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    admin BIT NOT NULL DEFAULT 0,
    access BIT NOT NULL DEFAULT 0,
    
    UNIQUE(email),
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS RESEARCHER (
    id bigint(20) NOT NULL AUTO_INCREMENT,
    first_name varchar(120) NOT NULL,
    last_name varchar(120) NOT NULL,
    address varchar(200) NOT NULL,
    phone varchar(30) NOT NULL,
    
    user_id bigint(20) NOT NULL,
    
    PRIMARY KEY (id),
    FOREIGN KEY (user_id) REFERENCES USER(id)
);

CREATE TABLE IF NOT EXISTS AUTHOR (
    id bigint(20) NOT NULL AUTO_INCREMENT,
    email varchar(255) NOT NULL,
    signature varchar(200) NOT NULL,
    res_id bigint(20),
    
    UNIQUE(email),
    PRIMARY KEY (id),
    FOREIGN KEY (res_id) REFERENCES RESEARCHER(id)
);
-- FOREIGN KEY (res_id) REFERENCES RESEARCHER(id)

CREATE TABLE IF NOT EXISTS PROJECT (
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

CREATE TABLE IF NOT EXISTS AUTHOR_PROJECT (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  author_id bigint(20) NOT NULL,
  project_id bigint(20) NOT NULL,
  
  role_id bigint(20) NOT NULL,
  
  UNIQUE (author_id, project_id),
  PRIMARY KEY (id),
  FOREIGN KEY (project_id) REFERENCES PROJECT(id),
  FOREIGN KEY (author_id) REFERENCES AUTHOR(id),
  FOREIGN KEY (role_id) REFERENCES ROLE(id)
);
-- FOREIGN KEY (author_id) REFERENCES AUTHOR(id),

CREATE TABLE IF NOT EXISTS CONGRESS (
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

CREATE TABLE IF NOT EXISTS AUTHOR_CONGRESS (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  author_id bigint(20) NOT NULL,
  congress_id bigint(20) NOT NULL,
  
  UNIQUE(author_id, congress_id),
  PRIMARY KEY (id),
  FOREIGN KEY (author_id) REFERENCES AUTHOR(id),
  FOREIGN KEY (congress_id) REFERENCES CONGRESS(id)
);

CREATE TABLE IF NOT EXISTS JOURNAL (
  id bigint(20) NOT NULL AUTO_INCREMENT,
  code varchar(100),
  title varchar(255) NOT NULL,
  journal varchar(255) NOT NULL,
  volume varchar(20),
  start_page bigint(20),
  end_page bigint(20),
  date varchar(255) NOT NULL,
  editorial varchar(255) NOT NULL,
  place varchar(255) NOT NULL,
  issn varchar(255),
  
  status bigint(20),
  
  PRIMARY KEY (id),
  FOREIGN KEY (status) REFERENCES PUBLICATION_STATUS(id)
);


CREATE TABLE IF NOT EXISTS AUTHOR_JOURNAL (
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


INSERT INTO USER (email, password, admin, access) VALUES ('admin@admin.es','$2a$12$l/xZ9uxuWijTvc14Ff5AVur6FIFMogs0DFdVhlfmHR3XWgvmQIVke', TRUE, TRUE);
INSERT INTO RESEARCHER (first_name, last_name, address, phone, user_id) VALUES ('NombreAdmin', 'ApellidosAdmin', 'DireccionAdmin', '999999999', 1);


