USE MedicalAppointmentsDB
-- TREATMENT UNITS
INSERT INTO TreatmentUnit (name_Ut)
VALUES 
('Cardiology'),
('Gynecology'),
('Clinical Medicine');

-- SPECIALTIES
INSERT INTO Specialty (name_specialty, type_specialty, treatment_units_id)
VALUES
('Cardiology Outpatient Consultation', 'Consultation', 1),
('Cardiology Stress Test', 'Study', 1),
('Gynecology Consultation', 'Consultation', 2),
('Clinical General Consultation', 'Consultation', 3);

-- PRACTICES
INSERT INTO Practice (name_practice, type_practice, treatment_units_id)
VALUES
('Echocardiogram', 'Imaging', 1),
('Blood Test', 'Laboratory', 3),
('Pap Smear', 'Study', 2);

-- DOCTORS
INSERT INTO Doctor (
    first_name_doctor,
    last_name_doctor,
    license_number,
    address,
    phone,
    email,
    treatment_units_id
)
VALUES
('Juan', 'Perez', 'MP-12345', 'Sarmiento 858', '111111111', 'juan.perez@mail.com', 1),
('Maria', 'Gomez', 'MP-54321', 'Emilio Lamarca 405', '222222222', 'maria.gomez@mail.com', 2),
('Carlos', 'Lopez', 'MP-67890', 'Iturri 444', '333333333', 'carlos.lopez@mail.com', 3);

-- DOCTOR SPECIALTIES
INSERT INTO DoctorSpecialty (doctor_id, specialty_id)
VALUES
(1, 1), -- Juan Perez - Cardiology
(2, 3), -- Maria Gomez - Gynecology
(3, 4); -- Carlos Lopez - Clinical Medicine

-- HEALTH INSURANCE
INSERT INTO HealthInsurance (
    name_health,
    type_plan,
    address,
    email,
    phone
)
VALUES
('OSDE', 'Premium', 'OSDE Address', 'contact@osde.com', '0800-OSDE'),
('Swiss Medical', 'Standard', 'Swiss Address', 'info@swiss.com', '0800-SWISS');

-- PATIENTS
INSERT INTO Patient (
    first_name_patient,
    last_name_patient,
    DNI,
    email,
    address,
    phone,
    health_insurance_id
)
VALUES
('Ana', 'Martinez', '30111222', 'ana@mail.com', 'Av. Calle Real 1200', '444444444', 1),
('Luis', 'Fernandez', '30222333', 'luis@mail.com', 'French 526', '555555555', 2);

-- BRANCHES
INSERT INTO Branch (name_branch, address)
VALUES
('Central', 'Solis 2025'),
('Microcentro', 'Viamonte 1900');

-- OFFICES
INSERT INTO Office (description, number_office, branch_id)
VALUES
('Consulting Room', '1', 1),
('Consulting Room', '2', 1),
('Consulting Room', '100', 2);

-- MEDICAL AGENDA
INSERT INTO MedicalAgenda (
    doctor_specialty_id,
    office_id,
    day_of_week,
    start_time,
    end_time
)
VALUES
(1, 1, 1, '08:00', '16:00'), -- Juan Perez, Monday
(2, 2, 2, '09:00', '12:00'), -- Maria Gomez, Tuesday
(3, 3, 3, '10:00', '14:30'); -- Carlos Lopez, Wednesday