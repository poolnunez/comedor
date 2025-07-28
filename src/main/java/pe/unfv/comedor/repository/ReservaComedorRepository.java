package pe.unfv.comedor.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.unfv.comedor.entity.ReservaComedor;

import java.time.LocalDate;
import java.util.Optional;
import java.util.List;

public interface ReservaComedorRepository extends JpaRepository<ReservaComedor, Long> {
    Optional<ReservaComedor> findByCodigoEstudianteAndFecha(String codigoEstudiante, LocalDate fecha);
    List<ReservaComedor> findByFecha(LocalDate fecha);
} 