package pe.unfv.comedor.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pe.unfv.comedor.entity.RegistroComedor;
 
@Repository
public interface RegistroComedorRepository extends JpaRepository<RegistroComedor, Long> {
} 