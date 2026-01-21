USE MedicalAppointmentsDB
--Ver agenda m�dica por sucursal (atencion medico con sucursal, hs y cco) endpoint GET /doctors/{id}/schedule
SELECT 
    d.first_name_doctor + ' ' + d.last_name_doctor AS Doctor,
    s.name_specialty AS Specialty,
    b.name_branch AS Branch,
    o.number_office AS Office,
    ma.day_of_week,
    ma.start_time,
    ma.end_time
FROM MedicalAgenda ma
INNER JOIN DoctorSpecialty ds ON ma.doctor_specialty_id = ds.doctor_specialty_id
INNER JOIN Doctor d ON ds.doctor_id = d.doctor_id
INNER JOIN Specialty s ON ds.specialty_id = s.specialty_id
INNER JOIN Office o ON ma.office_id = o.office_id
INNER JOIN Branch b ON o.branch_id = b.branch_id
ORDER BY b.name_branch, ma.day_of_week, ma.start_time;

--Turnos de un paciente �Historial y pr�ximos turnos de un paciente�Query t�pica de �Mis turnos�.
SELECT
    p.first_name_patient + ' ' + p.last_name_patient AS Patient,
    d.first_name_doctor + ' ' + d.last_name_doctor AS Doctor,
    s.name_specialty AS Specialty,
    b.name_branch AS Branch,
    o.number_office AS Office,
    a.appointment_datetime,
    a.mode
FROM Appointment a
INNER JOIN Patient p ON a.patient_id = p.patient_id
INNER JOIN MedicalAgenda ma ON a.medical_agenda_id = ma.medical_agenda_id
INNER JOIN DoctorSpecialty ds ON ma.doctor_specialty_id = ds.doctor_specialty_id
INNER JOIN Doctor d ON ds.doctor_id = d.doctor_id
INNER JOIN Specialty s ON ds.specialty_id = s.specialty_id
INNER JOIN Office o ON ma.office_id = o.office_id
INNER JOIN Branch b ON o.branch_id = b.branch_id
WHERE p.patient_id = 1
ORDER BY a.appointment_datetime DESC;

--Ver disponibilidad de un m�dico (sin turnos tomados)
--�Qu� horarios tiene libres un m�dico�
SELECT 
    d.first_name_doctor + ' ' + d.last_name_doctor AS Doctor,
    s.name_specialty AS Specialty,
    b.name_branch AS Branch,
    o.number_office AS Office,
    ma.day_of_week,
    ma.start_time,
    ma.end_time
FROM MedicalAgenda ma
INNER JOIN DoctorSpecialty ds ON ma.doctor_specialty_id = ds.doctor_specialty_id
INNER JOIN Doctor d ON ds.doctor_id = d.doctor_id
INNER JOIN Specialty s ON ds.specialty_id = s.specialty_id
INNER JOIN Office o ON ma.office_id = o.office_id
INNER JOIN Branch b ON o.branch_id = b.branch_id
WHERE ds.doctor_id = 1
AND NOT EXISTS (
    SELECT 1
    FROM Appointment a
    WHERE a.medical_agenda_id = ma.medical_agenda_id
      AND CAST(a.appointment_datetime AS DATE) = CAST(GETDATE() AS DATE)
)
ORDER BY ma.day_of_week, ma.start_time;

-- Cantidad de turnos por m�dico (estad�stica)
-- �Cu�ntos turnos tiene cada m�dico� (Query t�pica para dashboards.)
SELECT
    d.first_name_doctor + ' ' + d.last_name_doctor AS Doctor,
    COUNT(a.appointment_id) AS TotalAppointments
FROM Doctor d
LEFT JOIN DoctorSpecialty ds ON d.doctor_id = ds.doctor_id
LEFT JOIN MedicalAgenda ma ON ds.doctor_specialty_id = ma.doctor_specialty_id
LEFT JOIN Appointment a ON ma.medical_agenda_id = a.medical_agenda_id
GROUP BY d.first_name_doctor, d.last_name_doctor
ORDER BY TotalAppointments DESC;

-- Especialidades disponibles por sucursal
-- �Qu� especialidades se atienden en esta sucursal�
SELECT DISTINCT
    s.name_specialty AS Specialty,
    tu.name_Ut AS TreatmentUnit
FROM MedicalAgenda ma
INNER JOIN DoctorSpecialty ds ON ma.doctor_specialty_id = ds.doctor_specialty_id
INNER JOIN Specialty s ON ds.specialty_id = s.specialty_id
INNER JOIN TreatmentUnit tu ON s.treatment_units_id = tu.treatment_units_id
INNER JOIN Office o ON ma.office_id = o.office_id
WHERE o.branch_id = 1
ORDER BY s.name_specialty;
