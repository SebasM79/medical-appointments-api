# Medical Appointments API

API REST desarrollada en .NET para la gestión de turnos médicos y operaciones clínicas
en una clínica o centro de salud.

El sistema está diseñado con un enfoque **SQL-first**, utilizando **Dapper** para
acceso a datos, priorizando control total del SQL, claridad de negocio y performance.

---

## Funcionalidades principales

- Gestión de Unidades de Tratamiento
- Administración de Especialidades
- Registro y consulta de Médicos
- Registro de Pacientes
- Gestión de Turnos médicos
- Consulta de agenda médica
- Consulta de disponibilidad de médicos
- Soporte para Obras Sociales
- Preparado para Historia Clínica (Medical Records)

---

## Tecnologías utilizadas

- **.NET 10**
- **ASP.NET Core Web API**
- **Dapper**
- **SQL Server**
- **Swagger / OpenAPI**
- **Git & GitHub**
- **Visual Studio Code**

---

## Arquitectura y decisiones técnicas

- Enfoque **SQL-first**
- Acceso a datos mediante **Dapper**
- No se utiliza ORM (Entity Framework)
- El esquema de base de datos se gestiona manualmente con scripts SQL
- Separación clara de responsabilidades:
  - Controllers → HTTP / Endpoints
  - Repositories → SQL y acceso a datos
  - DTOs → Contratos de entrada y salida
- DTOs diseñados por **caso de negocio**, no por tabla
- Control explícito de joins, filtros y performance

---

## Estructura del proyecto

MedicalAppointments.Api
│
├── Controllers
│ ├── DoctorsController.cs
│ ├── OfficesController.cs
│
├── Data
│ ├── DbConnectionFactory.cs
│ └── Repositories
│ ├── DoctorRepository.cs
│ └── OfficeRepository.cs
│
├── Models
│ ├── CreateDoctorDto.cs
│ ├── DoctorScheduleDto.cs
│ ├── DoctorAvailabilityDto.cs
│ ├── OfficeDto.cs
│ └── CreateOfficeDto.cs
│
├── appsettings.json
├── Program.cs
└── README.md

## Modelo de datos (resumen)

- TreatmentUnit → Specialty (1 a N)
- TreatmentUnit → Doctor (1 a N)
- Doctor → Specialty (N a N)
- Doctor → MedicalAgenda
- Patient → Appointment
- Office → Branch
- MedicalRecord → Patient (previsto)

Las relaciones se definen **exclusivamente en SQL Server**.

---

## Cómo ejecutar el proyecto localmente

### Requisitos

- .NET SDK 10
- SQL Server
- Visual Studio Code

---

### Pasos

1. Clonar el repositorio

Crear la base de datos

Ejecutar los scripts SQL en SQL Server Management Studio:

script_schema.sql

script_data.sql

Configurar la conexión

En appsettings.json:

"ConnectionStrings": {
"DefaultConnection": "Server=DESKTOP-BTO7U3A;Database=MedicalAppointmentsDB;Trusted_Connection=True;TrustServerCertificate=True;"
}
Endpoints principales (ejemplos)

GET /api/doctors

POST /api/doctors

GET /api/doctors/{id}/schedule

GET /api/doctors/{id}/availability

GET /api/offices

POST /api/offices

Filosofía del proyecto

Este proyecto prioriza:

Control explícito del SQL

Claridad de negocio

Simplicidad en el código

Evitar abstracciones innecesarias
Estado del proyecto

🚧 En desarrollo activo
Próximos módulos:

Historia Clínica

Validaciones de negocio

Transacciones complejas

---

## Cierre conceptual

✔ Sí, las tablas nuevas van en `script_schema.sql`  
✔ Dapper **no crea ni migra** tablas  
✔ No necesitás clases espejo de las tablas  
✔ Los DTOs se crean según el negocio  
✔ SQL es la fuente de verdad
