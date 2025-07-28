package pe.unfv.comedor.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "reserva_comedor")
public class ReservaComedor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "codigo_estudiante", nullable = false, length = 20)
    private String codigoEstudiante;

    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;

    @Column(name = "turno", nullable = false, length = 20)
    private String turno;

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCodigoEstudiante() { return codigoEstudiante; }
    public void setCodigoEstudiante(String codigoEstudiante) { this.codigoEstudiante = codigoEstudiante; }

    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }

    public String getTurno() { return turno; }
    public void setTurno(String turno) { this.turno = turno; }
} 