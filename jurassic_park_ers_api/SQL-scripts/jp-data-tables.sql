create schema jurassic_park_ers_api;
set schema 'jurassic_park_ers_api';

create table roles( 
	"role_id" serial primary key,
	"role" text
);

create table users(
	"user_id" serial primary key,
	"username" text not null unique,
	"password" text not null,
	"firstName" text not null,
	"lastName" text not null,
	"email" text,
	"role" int references roles("role_id") -- foreign key for role table
);

create table reimbursement_status(
	"status_id" serial primary key,
	"status" text
);

create table reimbursement_type(
	"type_id" serial primary key,
	"type" text
);

create table reimbursement(
	"reimbursement_id" serial primary key,
	"author" int references users("user_id"),
	"amount" numeric(100,2),
	"date_submitted" date, -- ISO format is yyyy-mm-dd for date & hh:mm:ss for timestamp
	"date_resolved" date, -- ISO format is yyyy-mm-dd for date & hh:mm:ss for timestamp
	"description" text,
	"resolver" int,
	"status" int references reimbursement_status("status_id"),
	"type" int references reimbursement_type("type_id")
);
