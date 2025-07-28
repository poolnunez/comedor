# 📑 Manual Técnico - Sistema de Control de Asistencia Comedor UNFV

---

## 1. Descripción Técnica General

Este manual describe la instalación, configuración, despliegue y operación técnica del sistema de control de asistencia para el comedor universitario UNFV. El sistema está compuesto por un backend en Java (Spring Boot), un frontend en Next.js y una base de datos Oracle.

---

## 2. Arquitectura General

- **Frontend:** Next.js (React, TypeScript, Tailwind CSS)
- **Backend:** Spring Boot (Java 17, Maven, JPA/Hibernate)
- **Base de Datos:** Oracle Database 19c XE

```
[Usuario] ⇄ [Frontend Next.js] ⇄ [API REST Spring Boot] ⇄ [Oracle Database]
```

---

## 3. Instalación y Ejecución

### 3.1. Requisitos Previos
- Node.js 18+
- Java 17+
- Maven 3.6+
- Oracle Database 19c XE
- Git

### 3.2. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/comedor-unfv.git
cd comedor-unfv
```

### 3.3. Configuración de la Base de Datos
- Crear las tablas ejecutando los siguientes scripts en Oracle SQL Developer:

```sql
CREATE TABLE estudiante (
    codigo VARCHAR2(20) PRIMARY KEY,
    nombres VARCHAR2(100) NOT NULL,
    facultad VARCHAR2(100) NOT NULL,
    escuela VARCHAR2(100) NOT NULL,
    carrera VARCHAR2(100) NOT NULL,
    local VARCHAR2(100) NOT NULL,
    dni VARCHAR2(15) NOT NULL,
    foto VARCHAR2(255)
);

CREATE TABLE reserva_comedor (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    codigo_estudiante VARCHAR2(20) NOT NULL,
    fecha DATE NOT NULL,
    turno VARCHAR2(20) NOT NULL,
    CONSTRAINT fk_reserva_estudiante FOREIGN KEY (codigo_estudiante) REFERENCES estudiante(codigo)
);

CREATE TABLE registro_comedor (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    codigo_estudiante VARCHAR2(20) NOT NULL,
    fecha_hora TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    carrera VARCHAR2(100),
    turno VARCHAR2(20),
    CONSTRAINT fk_registro_estudiante FOREIGN KEY (codigo_estudiante) REFERENCES estudiante(codigo)
);
```

#### Ejemplo de inserción de estudiantes:
```sql
INSERT INTO estudiante (codigo, nombres, facultad, escuela, carrera, local, dni, foto) VALUES
('2020102501', 'Moreno Robles Juan Carlos', 'Ingeniería Industrial y de Sistemas', 'Ingeniería de Sistemas', 'Ingeniería de Sistemas', 'SL07', '74922767', 'https://web4.unfv.edu.pe/ocbu/reserva_alumnos/Home/GetImage?Cod=2023024011');
-- (Repetir para cada estudiante)
```

### 3.4. Configuración del Backend
- Editar `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:oracle:thin:@localhost:1521:XE
spring.datasource.username=comedor_user
spring.datasource.password=tu_password
spring.datasource.driver-class-name=oracle.jdbc.OracleDriver
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
```
- Ejecutar el backend:
```bash
./mvnw spring-boot:run
```

### 3.5. Configuración del Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 4. Estructura de Carpetas

```
comedor/
├── frontend/                 # Next.js app
│   ├── src/app/              # Páginas y rutas
│   └── src/components/       # Componentes reutilizables
├── src/main/java/pe/unfv/comedor/
│   ├── controller/           # Controladores REST
│   ├── entity/               # Entidades JPA
│   ├── repository/           # Repositorios DAO
│   └── service/              # Lógica de negocio
└── src/main/resources/       # Configuración y properties
```

---

## 5. Endpoints Principales (API REST)

### Estudiantes
- `GET /api/estudiantes/{codigo}` — Obtener datos de estudiante

### Reservas
- `POST /api/reservas/login` — Login de estudiante
- `GET /api/reservas/reserva-hoy/{codigo}` — Obtener reserva del día
- `POST /api/reservas/reservar` — Reservar turno
- `POST /api/reservas/validar` — Validar reserva

### Registros
- `POST /api/registros` — Registrar asistencia
- `GET /api/registros/excel` — Descargar Excel de asistencias

---

## 6. Tips de Despliegue y Pruebas

- Verifica que Oracle Database esté corriendo antes de iniciar el backend.
- Usa Postman o Insomnia para probar los endpoints REST.
- El frontend por defecto corre en `http://localhost:3000` y el backend en `http://localhost:8080`.
- Para producción, configura variables de entorno y usa HTTPS.

---

## 7. Procedimientos y Funciones SQL (Ejemplo)

```sql
CREATE OR REPLACE PROCEDURE registrar_asistencia(p_codigo IN VARCHAR2, p_turno IN VARCHAR2) AS
BEGIN
    INSERT INTO registro_comedor (codigo_estudiante, fecha_hora, turno)
    VALUES (p_codigo, SYSTIMESTAMP, p_turno);
END;
/

CREATE OR REPLACE FUNCTION obtener_asistencias_hoy(p_codigo IN VARCHAR2) RETURN NUMBER AS
  v_count NUMBER;
BEGIN
  SELECT COUNT(*) INTO v_count FROM registro_comedor
  WHERE codigo_estudiante = p_codigo AND TRUNC(fecha_hora) = TRUNC(SYSDATE);
  RETURN v_count;
END;
/
```

---

## 8. Contacto Técnico

- **Desarrollador:** [Tu Nombre]
- **Email:** tu.email@unfv.edu.pe

---

*Manual técnico generado para el proyecto de Base de Datos UNFV - 2024* 