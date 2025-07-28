package pe.unfv.comedor;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HolaController {
    @GetMapping("/")
    public String hola() {
        return "¡Hola, bienvenido a tu aplicación Spring Boot!";
    }
} 