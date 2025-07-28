package pe.unfv.comedor.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pe.unfv.comedor.entity.ReservaComedor;
import pe.unfv.comedor.entity.Estudiante;
import pe.unfv.comedor.repository.ReservaComedorRepository;
import pe.unfv.comedor.repository.EstudianteRepository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class ReservaComedorService {
    @Autowired
    private ReservaComedorRepository reservaComedorRepository;
    @Autowired
    private EstudianteRepository estudianteRepository;

    // Login: validar código y dni
    public Estudiante login(String codigo, String dni) {
        return estudianteRepository.findByCodigoAndDni(codigo, dni).orElse(null);
    }

    // Obtener reserva del día
    public Optional<ReservaComedor> getReservaHoy(String codigoEstudiante) {
        return reservaComedorRepository.findByCodigoEstudianteAndFecha(codigoEstudiante, LocalDate.now());
    }

    // Reservar turno (si no reservó antes)
    @Transactional
    public ReservaComedor reservarTurno(String codigoEstudiante, String turno) {
        Optional<ReservaComedor> existente = getReservaHoy(codigoEstudiante);
        if (existente.isPresent()) {
            throw new RuntimeException("Ya tienes una reserva para hoy");
        }
        ReservaComedor reserva = new ReservaComedor();
        reserva.setCodigoEstudiante(codigoEstudiante);
        reserva.setFecha(LocalDate.now());
        reserva.setTurno(turno);
        return reservaComedorRepository.save(reserva);
    }

    // Validar reserva para registro comedor
    public boolean validarReservaParaHoy(String codigoEstudiante, String turno) {
        Optional<ReservaComedor> reserva = getReservaHoy(codigoEstudiante);
        return reserva.isPresent() && reserva.get().getTurno().equals(turno);
    }
} 