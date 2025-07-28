package pe.unfv.comedor.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pe.unfv.comedor.entity.Estudiante;

import java.util.Optional;

public interface EstudianteRepository extends JpaRepository<Estudiante, String> {
    Optional<Estudiante> findByCodigoAndDni(String codigo, String dni);
} 