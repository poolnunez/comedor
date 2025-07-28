# 📄 Instrucciones para el Script de Creación de Base de Datos - Comedor UNFV

Este documento explica cómo usar el script SQL para crear y poblar la base de datos del sistema de control de asistencia del comedor universitario UNFV.

---

## 1. ¿Qué hace este script?

- **Crea las tablas principales:**
  - `estudiante`
  - `reserva_comedor`
  - `registro_comedor`
- **Agrega claves primarias y foráneas** para mantener la integridad referencial.
- **Inserta estudiantes de ejemplo** con datos realistas y fotos.
- **Crea índices** para mejorar el rendimiento de las consultas.

---

## 2. ¿Cómo usar el script?

### Paso 1: Abrir Oracle SQL Developer
- Inicia sesión con tu usuario de base de datos.

### Paso 2: Copiar y pegar el script
- Copia todo el contenido del archivo `script.sql` (o el bloque que te proporcionaron).
- Pega el contenido en una nueva ventana de SQL Worksheet.

### Paso 3: Ejecutar el script
- Selecciona todo el texto (Ctrl+A) y haz clic en el botón de ejecutar (o presiona F5).
- Espera a que se creen las tablas y se inserten los datos.

### Paso 4: Verificar
- Puedes consultar las tablas con:
```sql
SELECT * FROM estudiante;
SELECT * FROM reserva_comedor;
SELECT * FROM registro_comedor;
```

---

## 3. ¿Qué tablas y datos incluye?

- **estudiante:** Almacena los datos personales de los estudiantes (código, nombres, facultad, escuela, carrera, local, dni, foto).
- **reserva_comedor:** Guarda las reservas de turnos de los estudiantes.
- **registro_comedor:** Registra la asistencia de los estudiantes al comedor.
- **Datos de ejemplo:** Incluye varios estudiantes con datos completos y fotos institucionales.

---

## 4. Recomendaciones y advertencias

- **No ejecutes el script dos veces** sin borrar antes las tablas, o tendrás error de duplicidad.
- Si necesitas reiniciar la base de datos, elimina primero las tablas con:
```sql
DROP TABLE registro_comedor CASCADE CONSTRAINTS;
DROP TABLE reserva_comedor CASCADE CONSTRAINTS;
DROP TABLE estudiante CASCADE CONSTRAINTS;
```
- Luego vuelve a ejecutar el script.
- Si quieres agregar más datos, puedes copiar y modificar los comandos `INSERT`.

---

## 5. Créditos y uso

- Script preparado para el sistema de control de asistencia del comedor UNFV.
- Úsalo para pruebas, desarrollo o para compartir la base de datos con tus compañeros.

---

## 6. Script SQL Completo para Copiar y Ejecutar

```sql
-- CREAR TABLA ESTUDIANTE
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

-- CREAR TABLA RESERVA_COMEDOR
CREATE TABLE reserva_comedor (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    codigo_estudiante VARCHAR2(20) NOT NULL,
    fecha DATE NOT NULL,
    turno VARCHAR2(20) NOT NULL,
    CONSTRAINT fk_reserva_estudiante FOREIGN KEY (codigo_estudiante) REFERENCES estudiante(codigo)
);

-- CREAR TABLA REGISTRO_COMEDOR
CREATE TABLE registro_comedor (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    codigo_estudiante VARCHAR2(20) NOT NULL,
    fecha_hora TIMESTAMP DEFAULT SYSTIMESTAMP NOT NULL,
    carrera VARCHAR2(100),
    turno VARCHAR2(20),
    CONSTRAINT fk_registro_estudiante FOREIGN KEY (codigo_estudiante) REFERENCES estudiante(codigo)
);

-- INSERTAR ESTUDIANTES DE EJEMPLO
INSERT INTO estudiante (codigo, nombres, facultad, escuela, carrera, local, dni, foto) VALUES
('2020102501', 'Moreno Robles Juan Carlos', 'Ingeniería Industrial y de Sistemas', 'Ingeniería de Sistemas', 'Ingeniería de Sistemas', 'SL07', '74922767', 'https://web4.unfv.edu.pe/ocbu/reserva_alumnos/Home/GetImage?Cod=2023024011');
INSERT INTO estudiante (codigo, nombres, facultad, escuela, carrera, local, dni, foto) VALUES
('2023024074', 'Jesus Angel Pillco Quispe', 'Ingeniería Industrial y de Sistemas', 'Ingeniería de Sistemas', 'Ingeniería de Sistemas', 'SL07', '75419832', 'https://web4.unfv.edu.pe/ocbu/reserva_alumnos/Home/GetImage?Cod=2023024011');
INSERT INTO estudiante (codigo, nombres, facultad, escuela, carrera, local, dni, foto) VALUES
('2023023594', 'Ayala García Yeremi Israel', 'Ingeniería Industrial y de Sistemas', 'Ingeniería de Sistemas', 'Ingeniería de Sistemas', 'SL07', '74231589', 'https://web4.unfv.edu.pe/ocbu/reserva_alumnos/Home/GetImage?Cod=2023024011');
INSERT INTO estudiante (codigo, nombres, facultad, escuela, carrera, local, dni, foto) VALUES
('2023036732', 'Gabriel Crisostomo Campos', 'Ingeniería Industrial y de Sistemas', 'Ingeniería de Sistemas', 'Ingeniería de Sistemas', 'SL07', '74782134', 'https://web4.unfv.edu.pe/ocbu/reserva_alumnos/Home/GetImage?Cod=2023024011');
INSERT INTO estudiante (codigo, nombres, facultad, escuela, carrera, local, dni, foto) VALUES
('2023024234', 'Jheferson Ruben Suarez Sairitupac', 'Ingeniería Industrial y de Sistemas', 'Ingeniería de Sistemas', 'Ingeniería de Sistemas', 'SL07', '75123456', 'https://web4.unfv.edu.pe/ocbu/reserva_alumnos/Home/GetImage?Cod=2023024011');
INSERT INTO estudiante (codigo, nombres, facultad, escuela, carrera, local, dni, foto) VALUES
('2023035539', 'López Yesenia Andrea', 'Ingeniería Industrial y de Sistemas', 'Ingeniería de Sistemas', 'Ingeniería de Sistemas', 'SL07', '74891234', 'https://web4.unfv.edu.pe/ocbu/reserva_alumnos/Home/GetImage?Cod=2023024011');
INSERT INTO estudiante (codigo, nombres, facultad, escuela, carrera, local, dni, foto) VALUES
('2017025339', 'Ramirez Reynaga Alan', 'Ingeniería Industrial y de Sistemas', 'Ingeniería de Sistemas', 'Ingeniería de Sistemas', 'SL07', '74765432', 'https://web4.unfv.edu.pe/ocbu/reserva_alumnos/Home/GetImage?Cod=2023024011');

-- CREAR ÍNDICES PARA MEJORAR CONSULTAS
CREATE INDEX idx_reserva_fecha ON reserva_comedor(fecha);
CREATE INDEX idx_reserva_estudiante ON reserva_comedor(codigo_estudiante);
CREATE INDEX idx_registro_fecha ON registro_comedor(fecha_hora);
CREATE INDEX idx_registro_estudiante ON registro_comedor(codigo_estudiante);

COMMIT;
``` 