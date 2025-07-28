package pe.unfv.comedor.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pe.unfv.comedor.entity.RegistroComedor;
import pe.unfv.comedor.repository.RegistroComedorRepository;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RegistroComedorService {

    private final RegistroComedorRepository repository;

    @Autowired
    public RegistroComedorService(RegistroComedorRepository repository) {
        this.repository = repository;
    }

    public RegistroComedor crearRegistro(String codigoEstudiante) {
        if (codigoEstudiante == null || codigoEstudiante.trim().isEmpty()) {
            throw new IllegalArgumentException("El código de estudiante no puede ser nulo o vacío");
        }

        RegistroComedor nuevoRegistro = new RegistroComedor();
        nuevoRegistro.setCodigoEstudiante(codigoEstudiante);
        nuevoRegistro.setFechaHora(LocalDateTime.now());

        return repository.save(nuevoRegistro);
    }

    public List<RegistroComedor> obtenerTodos() {
        return repository.findAll();
    }
} 