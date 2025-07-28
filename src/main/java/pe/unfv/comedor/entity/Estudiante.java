package pe.unfv.comedor.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "estudiante")
public class Estudiante {
    @Id
    @Column(name = "codigo", length = 20)
    private String codigo;

    @Column(name = "nombres", nullable = false, length = 100)
    private String nombres;

    @Column(name = "facultad", nullable = false, length = 100)
    private String facultad;

    @Column(name = "escuela", nullable = false, length = 100)
    private String escuela;

    @Column(name = "carrera", nullable = false, length = 100)
    private String carrera;

    @Column(name = "local", nullable = false, length = 100)
    private String local;

    @Column(name = "dni", nullable = false, length = 15)
    private String dni;

    @Column(name = "foto", length = 255)
    private String foto;

    // Getters y Setters
    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }

    public String getNombres() { return nombres; }
    public void setNombres(String nombres) { this.nombres = nombres; }

    public String getFacultad() { return facultad; }
    public void setFacultad(String facultad) { this.facultad = facultad; }

    public String getEscuela() { return escuela; }
    public void setEscuela(String escuela) { this.escuela = escuela; }

    public String getCarrera() { return carrera; }
    public void setCarrera(String carrera) { this.carrera = carrera; }

    public String getLocal() { return local; }
    public void setLocal(String local) { this.local = local; }

    public String getDni() { return dni; }
    public void setDni(String dni) { this.dni = dni; }

    public String getFoto() { return foto; }
    public void setFoto(String foto) { this.foto = foto; }
} 