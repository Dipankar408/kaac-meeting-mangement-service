package gov.assam.kaac.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleAllExceptions(Exception ex) {
        Map<String, String> errorResponse = new HashMap<>();

        // Put a friendly message or the exact error message
        errorResponse.put("error", ex.getMessage());

        // Return a Bad Request (400) or Internal Server Error (500) status
        return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
    }
}
