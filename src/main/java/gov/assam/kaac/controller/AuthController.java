package gov.assam.kaac.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class AuthController {

    @GetMapping("/login")
    public String login(@RequestParam(value = "error", required = false) String error,
                        @RequestParam(value = "logout", required = false) String logout,
                        Model model) {
        if (error != null) {
            if ("inactive".equalsIgnoreCase(error)) {
                model.addAttribute("errorMessage", "Your council user account has been disabled. Please contact the Council Admin Secretary.");
            } else if ("unauthorized".equalsIgnoreCase(error)) {
                model.addAttribute("errorMessage", "You must log in with an Administrator account to access that section.");
            } else {
                model.addAttribute("errorMessage", "Invalid username or password. Please verify your credentials and try again.");
            }
        }
        if (logout != null) {
            model.addAttribute("logoutMessage", "You have been successfully signed out.");
        }
        return "login";
    }

    @GetMapping("/logout")
    public String logoutPage(HttpServletRequest request, HttpServletResponse response) {
        // Fetch the current authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth != null) {
            // Safely log the user out and invalidate the session
            new SecurityContextLogoutHandler().logout(request, response, auth);
        }

        // Redirect to the login page with the logout parameter
        return "redirect:/login?logout=true";
    }
}
