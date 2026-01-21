USE MedicalAppointmentsDB 

-- Creation Database
create database MedicalAppointmentsDB;

-- Treatment Units
create table TreatmentUnit (
	treatment_units_id int IDENTITY(1,1) PRIMARY KEY,
	name_Ut varchar(50) NOT NULL
	);

-- SPECIALTIES
create table Specialty (
	specialty_id int IDENTITY(1,1) PRIMARY KEY,
	name_specialty varchar(100) NOT NULL,
	type_specialty varchar(100) NOT NULL,
	treatment_units_id int NOT NULL,
	CONSTRAINT FK_Specialty_TreatmentUnit
		FOREIGN KEY (treatment_units_id)
		REFERENCES TreatmentUnit(treatment_units_id)
	);

-- PRACTICES
create table Practice (
	practice_id int IDENTITY(1,1) PRIMARY KEY,
	name_practice varchar(100) NOT NULL,
	type_practice varchar(100) NOT NULL,
	treatment_units_id int NOT NULL,
	CONSTRAINT FK_Practice_TreatmentUnit
		FOREIGN KEY (treatment_units_id)
		REFERENCES TreatmentUnit(treatment_units_id)
	);

-- DOCTORS
create table Doctor (
	doctor_id int IDENTITY(1,1) PRIMARY KEY,
	first_name_doctor varchar(50) NOT NULL,
	last_name_doctor varchar(50) NOT NULL,
	license_number VARCHAR(50) NOT NULL UNIQUE,
    address VARCHAR(200),
    phone VARCHAR(50),
    email VARCHAR(150),
	treatment_units_id int NOT NULL,
	CONSTRAINT FK_Doctor_TreatmentUnit
		FOREIGN KEY (treatment_units_id)
		REFERENCES TreatmentUnit(treatment_units_id)
	);

-- DOCTORS SPECIALTIES M:N
create table DoctorSpecialty (
	doctor_specialty_id INT IDENTITY(1,1) PRIMARY KEY,
	doctor_id int,
	specialty_id int,
	CONSTRAINT FK_DoctorSpecialty_Doctor
		FOREIGN KEY (doctor_id)
		REFERENCES Doctor (doctor_id),
	CONSTRAINT FK_DoctorSpecialty_Specialty
        FOREIGN KEY (specialty_id)
        REFERENCES Specialty(specialty_id),
	CONSTRAINT UQ_DoctorSpecialty UNIQUE (doctor_id, specialty_id)
   );

--  HEALTH INSURANCE
create table  HealthInsurance (
	health_insurance_id INT IDENTITY(1,1) PRIMARY KEY,
	name_health varchar(100) NOT NULL,
	type_plan varchar(150) NOT NULL,
	address varchar(100),
	email varchar(50),
	phone varchar(50) NOT NULL
	);

-- PATIENTS
create table Patient (
	patient_id INT IDENTITY(1,1) PRIMARY KEY,
	first_name_patient varchar(50) NOT NULL,
	last_name_patient varchar(50) NOT NULL,
	DNI varchar(20) NOT NULL UNIQUE,
	email varchar(100),
	address varchar(100),
	phone varchar(50) NOT NULL,
	health_insurance_id INT,
	CONSTRAINT FK_Patient_HealthInsurance
		FOREIGN KEY (health_insurance_id)
		REFERENCES HealthInsurance(health_insurance_id)
	);

-- BRANCHES
create table Branch (
	branch_id INT IDENTITY(1,1) PRIMARY KEY,
	name_branch varchar(50) NOT NULL,
	address varchar(100)NOT NULL
	);

-- OFFICES
create table Office (
	office_id INT IDENTITY(1,1) PRIMARY KEY,
	description varchar(100),
	number_office varchar(50),
	branch_id int NOT NULL
	CONSTRAINT FK_Office_Branch
		FOREIGN KEY (branch_id)
		REFERENCES Branch(branch_id)
	);

-- MEDICALS AGENDAS
create table MedicalAgenda (
	medical_agenda_id INT IDENTITY(1,1) PRIMARY KEY,
	doctor_specialty_id INT NOT NULL,
	office_id INT NOT NULL,
	day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 1 AND 7),
	start_time time NOT NULL,
	end_time time NOT NULl,
	CONSTRAINT FK_Agenda_DoctorSpecialty
		FOREIGN KEY (doctor_specialty_id)
		REFERENCES DoctorSpecialty(doctor_specialty_id),
	CONSTRAINT FK_Agenda_Office
		FOREIGN KEY (office_id)
		REFERENCES Office (office_id )
	);

-- APPOINTMENTS (TURNOS)
create table Appointment (
	appointment_id INT IDENTITY(1,1) PRIMARY KEY,
	patient_id int NOT NULL,
	medical_agenda_id int NOT NULL,
	appointment_datetime DATETIME NOT NULL,
	mode VARCHAR(20) NOT NULL CHECK (mode IN ('PRESENTIAL', 'VIRTUAL')),
	CONSTRAINT FK_Appointment_Patient
        FOREIGN KEY (patient_id)
        REFERENCES Patient(patient_id),
    CONSTRAINT FK_Appointment_Agenda
        FOREIGN KEY (medical_agenda_id)
        REFERENCES MedicalAgenda(medical_agenda_id)
	);