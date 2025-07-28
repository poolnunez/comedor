package pe.unfv.comedor.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pe.unfv.comedor.controller.dto.RegistroRequest;
import pe.unfv.comedor.entity.RegistroComedor;
import pe.unfv.comedor.service.RegistroComedorService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.util.List;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.Map;

@RestController
@RequestMapping("/api/registros")
public class RegistroComedorController {

    private final RegistroComedorService service;

    @Autowired
    public RegistroComedorController(RegistroComedorService service) {
        this.service = service;
    }

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping
    public ResponseEntity<RegistroComedor> registrarIngreso(@RequestBody RegistroRequest request) {
        RegistroComedor nuevoRegistro = service.crearRegistro(request.getCodigoEstudiante());
        return new ResponseEntity<>(nuevoRegistro, HttpStatus.CREATED);
    }

    @GetMapping("/excel")
    public ResponseEntity<byte[]> descargarExcel() {
        List<RegistroComedor> registros = service.obtenerTodos();
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Registros");
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("ID");
            header.createCell(1).setCellValue("Código Estudiante");
            header.createCell(2).setCellValue("Fecha y Hora");

            int rowIdx = 1;
            for (RegistroComedor reg : registros) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(reg.getId());
                row.createCell(1).setCellValue(reg.getCodigoEstudiante());
                row.createCell(2).setCellValue(reg.getFechaHora() != null ? reg.getFechaHora().toString() : "");
            }
            workbook.write(out);
            byte[] bytes = out.toByteArray();
            HttpHeaders headers = new HttpHeaders();
            headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=registros_comedor.xlsx");
            headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
            return ResponseEntity.ok().headers(headers).body(bytes);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/columnas-tabla")
    public List<Map<String, Object>> obtenerColumnasTabla() {
        String sql = """
            SELECT 
                column_name as nombre_columna,
                data_type as tipo_dato,
                data_length as longitud,
                nullable as permite_nulo,
                column_id as orden
            FROM user_tab_columns 
            WHERE table_name = 'REGISTRO_COMEDOR'
            ORDER BY column_id
            """;
        
        return jdbcTemplate.queryForList(sql);
    }
} 