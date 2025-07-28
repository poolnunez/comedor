# 📚 Comandos SQL Esenciales para Práctica y Examen

Este documento contiene ejemplos de comandos SQL que puedes usar para practicar y responder preguntas sobre tus tablas del sistema de comedor universitario.

---

## 1. Consultas Básicas (SELECT)

### Ver todos los estudiantes
```sql
SELECT * FROM estudiante;
```

### Ver todas las reservas
```sql
SELECT * FROM reserva_comedor;
```

### Ver todos los registros de asistencia
```sql
SELECT * FROM registro_comedor;
```

---

## 2. Consultas con Filtros (WHERE)

### Buscar estudiante por código
```sql
SELECT * FROM estudiante WHERE codigo = '2020102501';
```

### Ver reservas de un estudiante específico
```sql
SELECT * FROM reserva_comedor WHERE codigo_estudiante = '2020102501';
```

### Ver asistencias de un estudiante en una fecha
```sql
SELECT * FROM registro_comedor WHERE codigo_estudiante = '2020102501' AND TRUNC(fecha_hora) = TO_DATE('2024-06-10', 'YYYY-MM-DD');
```

---

## 3. Insertar Datos (INSERT)

### Insertar un nuevo estudiante
```sql
INSERT INTO estudiante (codigo, nombres, facultad, escuela, carrera, local, dni, foto) VALUES
('2023999999', 'Ejemplo Alumno', 'Ingeniería Industrial y de Sistemas', 'Ingeniería de Sistemas', 'Ingeniería de Sistemas', 'SL07', '79999999', NULL);
```

---

## 4. Actualizar Datos (UPDATE)

### Cambiar el local de un estudiante
```sql
UPDATE estudiante SET local = 'SL08' WHERE codigo = '2020102501';
```

---

## 5. Eliminar Datos (DELETE)

### Eliminar una reserva específica
```sql
DELETE FROM reserva_comedor WHERE id = 1;
```

### Eliminar todos los registros de asistencia
```sql
DELETE FROM registro_comedor;
COMMIT;
```

---

## 6. Consultas de Conteo y Agrupación

### Contar cuántos estudiantes hay
```sql
SELECT COUNT(*) FROM estudiante;
```

### Contar reservas por turno
```sql
SELECT turno, COUNT(*) AS total_reservas FROM reserva_comedor GROUP BY turno;
```

### Contar asistencias por estudiante
```sql
SELECT codigo_estudiante, COUNT(*) AS total_asistencias FROM registro_comedor GROUP BY codigo_estudiante;
```

---

## 7. Consultas con JOIN

### Ver reservas con nombre del estudiante
```sql
SELECT r.id, r.fecha, r.turno, e.nombres
FROM reserva_comedor r
JOIN estudiante e ON r.codigo_estudiante = e.codigo;
```

### Ver asistencias con datos completos del estudiante
```sql
SELECT rc.id, rc.fecha_hora, e.nombres, e.carrera, e.local
FROM registro_comedor rc
JOIN estudiante e ON rc.codigo_estudiante = e.codigo;
```

---

## 8. Consultas con ORDER BY

### Ver estudiantes ordenados por nombre
```sql
SELECT * FROM estudiante ORDER BY nombres ASC;
```

### Ver asistencias más recientes primero
```sql
SELECT * FROM registro_comedor ORDER BY fecha_hora DESC;
```

---

## 9. Consultas de Fechas

### Ver reservas de hoy
```sql
SELECT * FROM reserva_comedor WHERE fecha = TRUNC(SYSDATE);
```

### Ver asistencias de la última semana
```sql
SELECT * FROM registro_comedor WHERE fecha_hora >= SYSDATE - 7;
```

---

## 10. Otros Comandos Útiles

### Ver estructura de una tabla
```sql
DESC estudiante;
```

### Ver los primeros 5 estudiantes
```sql
SELECT * FROM estudiante WHERE ROWNUM <= 5;
```

---

**¡Practica estos comandos y estarás listo para cualquier pregunta de base de datos sobre tu sistema!** 