package gov.assam.kaac.dto;

import gov.assam.kaac.entity.Department;
import gov.assam.kaac.entity.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDto {
    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @Email
    @NotBlank(message = "Email is required")
    private String email;

    private String phone;

    private String designation;

    @NotNull(message = "Role is required")
    @Enumerated(EnumType.STRING)
    private Role role; // ADMIN, STAFF, CHAIRPERSON

    @NotNull(message = "Department is required")
    private Long departmentId;

    @Builder.Default
    private String status = "ACTIVE";
}
