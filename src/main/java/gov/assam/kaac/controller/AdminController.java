package gov.assam.kaac.controller;

import gov.assam.kaac.dto.UserDto;
import gov.assam.kaac.entity.*;
import gov.assam.kaac.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@Controller
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final MeetingRoomRepository roomRepository;
    private final MeetingScheduleRepository scheduleRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/dashboard")
    public String dashboard(Model model) {
        model.addAttribute("departments", departmentRepository.findAll());
        model.addAttribute("users", userRepository.findAll());
        model.addAttribute("rooms", roomRepository.findAll());
        model.addAttribute("schedules", scheduleRepository.findAll());
        model.addAttribute("totalDepartments", departmentRepository.count());
        model.addAttribute("totalUsers", userRepository.count());
        model.addAttribute("totalRooms", roomRepository.count());
        model.addAttribute("totalMeetings", scheduleRepository.count());
        return "admin/dashboard";
    }

    // --- Department Master CRUD ---
    @PostMapping("/departments/save")
    public String saveDepartment(@ModelAttribute Department department) {
        departmentRepository.save(department);
        return "redirect:/admin/dashboard?tab=departments";
    }

    @PostMapping("/departments/delete/{id}")
    public String deleteDepartment(@PathVariable Long id) {
        departmentRepository.deleteById(id);
        return "redirect:/admin/dashboard?tab=departments";
    }

    @PostMapping("/departments/update/{id}")
    public String updateDepartment(@PathVariable Long id, @ModelAttribute Department department) {
        // Ensure the ID from the path is set on the entity before saving
        department.setId(id);
        departmentRepository.save(department);

        return "redirect:/admin/dashboard?tab=departments";
    }

    // --- User Master CRUD ---
    @PostMapping("/users/save")
    public String saveUser(@ModelAttribute User user) {
        if (user.getPassword() != null && !user.getPassword().startsWith("$2a$")) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        userRepository.save(user);
        return "redirect:/admin/dashboard?tab=users";
    }

    @PostMapping("/users/delete/{id}")
    public String deleteUser(@PathVariable Long id) {
        userRepository.deleteById(id);
        return "redirect:/admin/dashboard?tab=users";
    }

    @PostMapping("/users/update/{id}")
    public String updateDepartment(@PathVariable Long id, @ModelAttribute UserDto user) {
        // Ensure the ID from the path is set on the entity before saving
        Optional<User> userOptional = userRepository.findById(id);
        if(userOptional.isPresent()) {
            User existing = userOptional.get();
            existing.setPassword(user.getPassword());
            existing.setUsername(user.getUsername());
            existing.setFullName(user.getFullName());
            existing.setEmail(user.getEmail());
            existing.setPhone(user.getPhone());
            existing.setStatus(user.getStatus());
            existing.setDesignation(user.getDesignation());
            existing.setRole(user.getRole());
            existing.setDepartment(departmentRepository.findById(user.getDepartmentId()).get());
            userRepository.save(existing);
        }

        return "redirect:/admin/dashboard?tab=users";
    }

    // --- Meeting Room Master CRUD ---
    @PostMapping("/rooms/save")
    public String saveRoom(@ModelAttribute MeetingRoom room) {
        roomRepository.save(room);
        return "redirect:/admin/dashboard?tab=rooms";
    }

    @PostMapping("/rooms/delete/{id}")
    public String deleteRoom(@PathVariable Long id) {
        roomRepository.deleteById(id);
        return "redirect:/admin/dashboard?tab=rooms";
    }

    @PostMapping("/rooms/update/{id}")
    public String updateDepartment(@PathVariable Long id, @ModelAttribute MeetingRoom meetingRoom) {
        // Ensure the ID from the path is set on the entity before saving
        meetingRoom.setId(id);
        roomRepository.save(meetingRoom);

        return "redirect:/admin/dashboard?tab=rooms";
    }
}
