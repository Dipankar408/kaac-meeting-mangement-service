package gov.assam.kaac;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Karbi Anglong Autonomous Council (KAAC) Meeting Management Application
 * Built with Spring MVC, Spring Data JPA, Spring Security, and H2 In-Memory Database.
 */
@SpringBootApplication
public class KaacMeetingApplication {

    public static void main(String[] args) {
        SpringApplication.run(KaacMeetingApplication.class, args);
        System.out.println("=========================================================================");
        System.out.println("  🏛️ KAAC Meeting Management System (Spring MVC + H2 DB) Started!     ");
        System.out.println("  🌐 Web Application: http://localhost:8080                               ");
        System.out.println("  💾 H2 Database Console: http://localhost:8080/h2-console                ");
        System.out.println("     JDBC URL: jdbc:h2:mem:kaac_meetings_db | User: sa | Password: password");
        System.out.println("=========================================================================");
    }
}
