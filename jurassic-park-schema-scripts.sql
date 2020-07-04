--create schema jurassic_park_ers_api;

set schema 'jurassic_park_ers_api';

--drop table roles cascade;
--drop table users cascade;
--drop table reimbursement_statuses cascade; 
--drop table reimbursement_types cascade;
--drop table reimbursements cascade;

create table roles (
	"role_id" serial primary key,
	"role" text
);
create table users (
	"user_id" serial primary key,
	"username" text not null unique,
	"password" text not null,
	"first_name" text not null,
	"last_name" text not null,
	"email" text not null,
	"role" int references roles ("role_id") -- FK to roles table
);
create table reimbursement_statuses (
	"status_id" serial primary key,
	"status" text not null unique
);
create table reimbursement_types (
	"type_id" serial primary key,
	"type" text not null unique
);
create table reimbursements (
	"reimbursement_id" serial primary key,
	"author" int not null references users ("user_id"),
	"amount" numeric(6,2) not null,
	"date_submitted" timestamp not null,
	"date_resolved" timestamp, --not null,
	"description" text not null,
	"resolver" int references users ("user_id"),
	"status" int references reimbursement_statuses ("status_id") not null,  -- FK to reimbursement_statuses table
	"type" int references reimbursement_types ("type_id") -- FK to reimbursement_types table
);

--------------------------------

set schema 'jurassic_park_ers_api';

insert into roles ("role")
	values ('Admin'),
		   ('Finance Manager'),
		   ('User');

insert into users ("username", "password", "first_name", "last_name", "email", "role")
	values ('naturalselection', 'darwinism', 'Charles', 'Darwin', 'charles.darwin@jurassicpark.com', 1),
		   ('dinosruleforever', 'andever', 'John', 'Hammond', 'john.hammond@jurassicpark.com', 1),
		   ('jurassicparka', 'friends', 'Benjamin', 'Lockwood', 'benjamin.lockwood@jurassicpark.com', 2),
		   ('babysharkdoodoo', 'doodoodoodoo', 'Ellie', 'Sattler', 'ellie.sattler@jurassicpark.com', 3),
		   ('dinosaurluvr', 'iheartdinosaurs', 'Lex', 'Murphy', 'lex.murphy@jurassicpark.com', 3),
		   ('reptar', 'rugrats', 'Claire', 'Dearing', 'claire.dearing@jurassicpark.com', 3),
		   ('bigfootisreal', 'youknowit', 'Henry', 'Wu', 'henry.wu@jurassicpark.com', 3),
		   ('ibelieve', 'inaliens', 'Arby', 'Benton', 'arby.benton@jurassicpark.com', 3),
		   ('megalodonlives', 'marianatrench', 'Jack', 'Thorne', 'jack.thorne@jurassicpark.com', 3),
		   ('raptorsrock', 'queenraptor', 'Zia', 'Rodriguez', 'zia.rodriguez@jurassicpark.com', 3);

insert into reimbursement_statuses ("status")
	values ('Pending'),
		   ('Approved'),
		   ('Denied');

insert into reimbursement_types ("type")
	values ('Maintenance'),
		   ('Inventory'),
		   ('Food'),
		   ('Payroll');

insert into reimbursements ("author", "amount", "date_submitted", "date_resolved", "description", "resolver", "status", "type")
	values (4, 999.00, '1990-01-24 02:30:00', '1990-01-24 02:40:00', 'Repaired Jeep Brontosaurus stepped on', 3, 2, 1),
		   (3, 850.00, '1990-01-30 03:00:00', '1990-01-30 03:36:00', 'Replaced park gate Dracorex destroyed', 1, 2, 1),
		   (1, 735.00, '1990-02-15 04:20:00', '1990-02-15 04:40:00', 'Materials to build playground for dinosaurs', 2, 2, 1),
		   (2, 669.00, '1990-02-02 05:16:00', '1990-02-02 05:56:00', 'Purchased chupacabras to feed to Velociraptors', 3, 2, 3),
		   (6, 500.00, '1990-02-23 03:19:00', '1990-02-23 03:29:00', 'Hired groundskeeper to dispose of dinosaur poo', 1, 2, 4),
		   (5, 444.00, '1990-03-17 04:05:00', '1990-03-17 04:15:00', 'Acquired Pawpawsaurus from Fort Worth, Texas', 3, 3, 2),
		   (9, 386.00, '1990-04-06 06:30:00', '1990-04-06 06:45:00', 'Replaced Technosaurus that was eaten by T-Rex', 3, 3, 2),
		   (7, 278.00, '1990-05-10 01:02:00', '1990-05-10 01:24:00', 'Materials to build ocean habitat for Mosasaurus', 1, 2, 1),
		   (10, 123.00, '1990-05-28 07:37:00', '1990-05-28 07:57:00', 'Replaced fence Triceratops tore through', 3, 2, 1),
		   (8, 900.00, '1990-06-11 08:44:00', '1990-06-11 08:54:00', 'Hired new trainer - Alec was eaten by Allosaurus', 3, 1, 4);

--Table contents
select * from reimbursements;
select * from reimbursement_types;
select * from reimbursement_statuses;
select * from roles;
select * from users;
