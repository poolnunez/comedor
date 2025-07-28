package pe.unfv.comedor.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pe.unfv.comedor.entity.Estudiante;
import pe.unfv.comedor.repository.EstudianteRepository;

@RestController
@RequestMapping("/api/estudiantes")
public class EstudianteController {
    @Autowired
    private EstudianteRepository estudianteRepository;

    @GetMapping("/{codigo}")
    public ResponseEntity<?> getEstudiante(@PathVariable String codigo) {
        return estudianteRepository.findById(codigo)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(404).body("Estudiante no encontrado"));
    }
} 