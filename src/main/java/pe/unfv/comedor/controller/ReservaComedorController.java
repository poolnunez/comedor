package pe.unfv.comedor.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.unfv.comedor.entity.Estudiante;
import pe.unfv.comedor.entity.ReservaComedor;
import pe.unfv.comedor.service.ReservaComedorService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reservas")
public class ReservaComedorController {
    @Autowired
    private ReservaComedorService reservaComedorService;

    // Login de estudiante
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String codigo = body.get("codigo");
        String dni = body.get("dni");
        Estudiante estudiante = reservaComedorService.login(codigo, dni);
        if (estudiante == null) {
            return ResponseEntity.status(401).body("Código o DNI incorrecto");
        }
        return ResponseEntity.ok(estudiante);
    }

    // Obtener reserva del día
    @GetMapping("/reserva-hoy/{codigo}")
    public ResponseEntity<?> getReservaHoy(@PathVariable String codigo) {
        return reservaComedorService.getReservaHoy(codigo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.ok().body(null));
    }

    // Reservar turno
    @PostMapping("/reservar")
    public ResponseEntity<?> reservar(@RequestBody Map<String, String> body) {
        String codigo = body.get("codigo");
        String turno = body.get("turno");
        try {
            ReservaComedor reserva = reservaComedorService.reservarTurno(codigo, turno);
            return ResponseEntity.ok(reserva);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Validar reserva para registro comedor
    @PostMapping("/validar")
    public ResponseEntity<?> validar(@RequestBody Map<String, String> body) {
        String codigo = body.get("codigo");
        String turno = body.get("turno");
        boolean valido = reservaComedorService.validarReservaParaHoy(codigo, turno);
        Map<String, Object> resp = new HashMap<>();
        resp.put("valido", valido);
        return ResponseEntity.ok(resp);
    }
} 