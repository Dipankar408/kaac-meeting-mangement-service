package gov.assam.kaac.controller;

import gov.assam.kaac.entity.User;
import gov.assam.kaac.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

import java.security.Principal;

@ControllerAdvice
@RequiredArgsConstructor
public class GlobalControllerAdvice {

    private final UserRepository userRepository;

    // This method runs automatically before every single view is rendered
    @ModelAttribute("activeUser")
    public User getCurrentUser(Principal principal) {
        if (principal != null) {
            // Find the user from the database using their logged-in username
            return userRepository.findByUsername(principal.getName()).orElse(null);
        }

        // Return null if no one is logged in (triggers your "Public View Mode" HTML)
        return null;
    }
}