package gov.assam.kaac.repository;

import gov.assam.kaac.entity.Role;
import gov.assam.kaac.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    List<User> findByRole(Role role);
    List<User> findByRoleAndStatus(Role role, String status);
    List<User> findByDepartmentId(Long departmentId);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
