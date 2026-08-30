# Karbi Anglong Autonomous Council (KAAC) Meeting Management System
## Spring MVC, Spring Data JPA, Spring Security & H2 Database

An enterprise-grade Meeting Management System developed for the **Karbi Anglong Autonomous Council (Council Secretariat, Diphu, Assam)** under the Sixth Schedule to the Constitution of India.

---

### 🏛️ Technology Stack

- **Framework**: Spring Boot 3.3.2 / Spring MVC (Java 17/21)
- **Database**: H2 In-Memory Relational Database (`jdbc:h2:mem:kaac_meetings_db`)
- **Persistence**: Spring Data JPA & Hibernate ORM
- **Security**: Spring Security (Role-Based Access Control: `ADMIN`, `STAFF`, `CHAIRPERSON`)
- **Views & UI**: Thymeleaf Server-Side HTML Rendering & Responsive Semantic CSS / Vanilla JS
- **Build Tool**: Apache Maven (`pom.xml`)

---

### 📂 Maven Project Layout

```text
├── pom.xml                                    # Maven Project Object Model
├── src/main/java/gov/assam/kaac/
│   ├── KaacMeetingApplication.java            # Spring Boot Main Entry Point
│   ├── config/
│   │   ├── SecurityConfig.java                # Spring Security RBAC Configuration
│   │   └── WebMvcConfig.java                  # Static Resource Handling
│   ├── model/
│   │   ├── Role.java                          # Enum: ADMIN, STAFF, CHAIRPERSON
│   │   ├── MeetingStatus.java                 # Enum: SCHEDULED, IN_PROGRESS, COMPLETED, etc.
│   │   ├── Department.java                    # JPA Entity (GAD, REV, PWD, AGRI, FOR, etc.)
│   │   ├── User.java                          # JPA Entity (Council Officers & Roles)
│   │   ├── MeetingRoom.java                   # JPA Entity (Council Secretariat Halls)
│   │   └── MeetingSchedule.java               # JPA Entity (Meetings with mandatory Chairperson)
│   ├── repository/
│   │   ├── DepartmentRepository.java          # Spring Data JPA Repo
│   │   ├── UserRepository.java                # Spring Data JPA Repo
│   │   ├── MeetingRoomRepository.java         # Spring Data JPA Repo
│   │   └── MeetingScheduleRepository.java     # Conflict queries & Staff/Chair queries
│   ├── service/
│   │   ├── ConflictService.java               # Real-Time Room & Chairperson Conflict Engine
│   │   ├── CustomUserDetailsService.java      # Spring Security User Authentication
│   │   └── MeetingService.java                # RBAC-enforced Business Logic
│   └── controller/
│       ├── HomeController.java                # Master Schedule Controller (/)
│       ├── DepartmentController.java          # Department Registry Controller (/departments)
│       ├── MeetingRoomController.java         # Conference Rooms Controller (/rooms)
│       ├── UserController.java                # User Directory Controller (/users)
│       ├── AuthController.java                # Authentication & Login (/login, /logout)
│       ├── StaffController.java               # Staff Dashboard & Live Conflict API (/staff/dashboard)
│       ├── AdminController.java               # Master CRUD (Dept, Users, Rooms) (/admin/dashboard)
│       └── MeetingController.java             # Meeting Scheduling & Official Notice Views (/meetings/*)
└── src/main/resources/
    ├── application.properties                 # H2 DB & Server Configuration
    ├── schema.sql                             # H2 Table DDL Scripts
    ├── data.sql                               # Initial Seed Data for KAAC
    ├── static/
    │   └── css/style.css                      # Council UI Design System
    └── templates/
        ├── index.html                         # Master Schedule View
        ├── login.html                         # Officer Login Page
        ├── department/list.html               # Department Cards & Metric Registry
        ├── room/list.html                     # Venue Directory & Hall Facilities
        ├── user/list.html                     # Officers Directory & Role Filters
        ├── admin/dashboard.html               # Admin Master Console
        ├── staff/dashboard.html               # Staff Handling Portal
        └── meeting/
            ├── schedule.html                  # New Meeting Booking Form
            ├── details.html                   # Detailed Meeting Sheet
            └── notice.html                    # Official Council Notice Letterhead
```

---

### 🚀 Running the Spring MVC Application Locally

#### Option 1: Standard Maven CLI
```bash
# Clone or navigate to the project directory
cd kaac-meeting-management

# Run with Spring Boot Maven Plugin
mvn spring-boot:run
```

The application will start at:
- **Web Application**: `http://localhost:8080`
- **H2 Database Web Console**: `http://localhost:8080/h2-console`
  - **JDBC URL**: `jdbc:h2:mem:kaac_meetings_db`
  - **User**: `sa`
  - **Password**: `password`

#### Option 2: IntelliJ IDEA / Eclipse / VS Code
1. Open the project root folder.
2. Let Maven import the dependencies specified in `pom.xml`.
3. Run `gov.assam.kaac.KaacMeetingApplication.java`.

---

### 🛡️ Role-Based Access Control (RBAC) Credentials

| Username | Password | Role | Full Name & Designation |
| :--- | :--- | :--- | :--- |
| `admin` | `password123` | **ADMIN** | Longki Rongpi, Secretary to KAAC |
| `cem_tuliram` | `password123` | **CHAIRPERSON** | Hon. Tuliram Ronghang, Chief Executive Member (CEM) |
| `em_darsing` | `password123` | **CHAIRPERSON** | Hon. Darsing Ronghang, EM (Finance & Revenue) |
| `em_richard` | `password123` | **CHAIRPERSON** | Hon. Richard Tokbi, EM (Education & Culture) |
| `staff_teron` | `password123` | **STAFF** | Sarkhe Teron, Council Meeting Coordinator |
| `staff_menoka`| `password123` | **STAFF** | Menoka Kramsa, Senior Assistant (Revenue) |
