set schema 'jurassic_park_ers_api';

insert into roles ("role")
	values ('admin'),('finance-manager'), ('user');

select * from roles r; 

insert into users("username","password","firstName", "lastName", "email", "role")
	values	('naturalselection1','password','Charles','Darwin','darwin@jurassicpark.com','1'),
			('dinosrule4ever','password','John','Hammond','hammond@jurassicpark.com','2'),
			('jurassicparka','password','Benjamin','Lockwood','lockwood@jurassicpark.com','3'),
			('dinosaurluvr2','password','Ellie','Sattler','sattler@jurassicpark.com','3'),
			('babysharkd00d00','password','Lex','Murphy','murphy@jurassicpark.com','3'),
			('Reptar91','password','Claire','Dearing','dearing@jurassicpark.com','3'),
			('bigfootisreal','password','Henry','Wu','wu@jurassicpark.com','3'),
			('IBELIEV3','password','Arby','Benton','benton@jurassicpark.com','3'),
			('RAPTOR5rock','password','Jack','Thorne','thorne@jurassicpark.com','3'),
			('megalodonlives!','password','Zia','Rodriguez','rodriguez@jurassicpark.com','3');
			
select * from users u;

insert into reimbursement_status ("status")
	values ('pending'),('approved'), ('denied');

select * from reimbursement_status rs; 

insert into reimbursement_type ("type")
	values ('maintenance'),('inventory'),('food'),('payroll');

select * from reimbursement_type rt; 
	
insert into reimbursement ("author", "amount", "date_submitted", "date_resolved", "description", "resolver", "status", "type")
	values	('1','4126.59','1990-01-01','1990-01-02','Repaired Jeep Brontosaurus stepped on','2','2','1'),
			('2','700.83','1990-02-12','1990-02-13','Replaced park gate Dracorex destroyed','1','2','1'),
			('3','2091.44','1990-03-23','1990-03-24','Materials to build playground for dinosaurs','1','3','1'),
			('4','89.71','1990-04-03','1990-04-04','Purchased chupacabras to feed to Velociraptors','2','2','3'),
			('5','66305','1990-05-14','1990-05-15','Hired groundskeeper to dispose of dinosaur poo','1','3','4'),
			('6','146.99','1990-06-25','1990-06-26','Acquired Pawpawsaurus from Fort Worth, Texas','2','2','2'),
			('7','347.50','1990-07-30','1990-07-31','Replaced Technosaurus that was eaten by T-Rex','2','2','2'),
            ('8','1234.56','1990-08-07','1990-08-08','Materials to build ocean habitat for Mosasaurus','2','2','1'),
            ('9','3623.58','1990-09-16','1990-09-17','Replaced fence Triceratops tore through','1','1','1'),
			('10','44000.01m','1990-10-29','1990-10-30','Hired new trainer due to Alec being eaten by Allosaurus','1','1','4');
			
select  u2."firstName", u2."lastName", r2.date_submitted, r2.date_resolved, rt."type", r2.description, r2.amount, rs.status, u."firstName", u."lastName" 
		from jurassic_park_ers_api.reimbursement as r2
		join jurassic_park_ers_api.users u on u.user_id = r2.resolver 
		left join jurassic_park_ers_api.users u2 on u2.user_id = r2.author
		left join jurassic_park_ers_api.reimbursement_status rs on rs.status_id = r2.status
		left join jurassic_park_ers_api.reimbursement_type rt on rt.type_id = r2."type" 
		group by r2.date_submitted, r2.date_resolved, r2.description, r2.amount, rs.status, rt."type", u2."firstName", u2."lastName", u."firstName", u."lastName"
		order by r2.date_submitted;
