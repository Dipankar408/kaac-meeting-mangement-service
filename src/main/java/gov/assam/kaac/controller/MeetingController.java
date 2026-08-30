package gov.assam.kaac.controller;

import gov.assam.kaac.dto.MeetingScheduleDto;
import gov.assam.kaac.entity.*;
import gov.assam.kaac.repository.*;
import gov.assam.kaac.service.MeetingService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/meetings")
@RequiredArgsConstructor
public class MeetingController {

    private final MeetingService meetingService;
    private final MeetingScheduleRepository scheduleRepository;
    private final DepartmentRepository departmentRepository;
    private final MeetingRoomRepository roomRepository;
    private final UserRepository userRepository;

    @GetMapping("/new")
    public String newMeetingForm(Model model) {
        model.addAttribute("meeting", new MeetingSchedule());
        model.addAttribute("departments", departmentRepository.findAll());
        model.addAttribute("rooms", roomRepository.findAll());
        model.addAttribute("chairpersons", userRepository.findByRoleAndStatus(Role.CHAIRPERSON, "ACTIVE"));
        model.addAttribute("assignedStaff", userRepository.findByRoleAndStatus(Role.STAFF, "ACTIVE"));
        return "meeting/schedule";
    }

    @PostMapping("/save")
    public String saveMeeting(@ModelAttribute MeetingScheduleDto meeting, @AuthenticationPrincipal org.springframework.security.core.userdetails.User springUser) {
        User currentUser = null;
        if (springUser != null) {
            currentUser = userRepository.findByUsername(springUser.getUsername()).orElse(null);
        }
        meetingService.createMeeting(meeting, currentUser);
        return "redirect:/?scheduled=true";
    }

    @GetMapping("/view/{id}")
    public String viewMeetingDetails(@PathVariable Long id, Model model) {
        MeetingSchedule meeting = scheduleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Meeting not found with ID: " + id));
        model.addAttribute("meeting", meeting);
        return "meeting/details";
    }

    @GetMapping("/notice/{id}")
    public String printMeetingNotice(@PathVariable Long id, Model model) {
        MeetingSchedule meeting = scheduleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Meeting not found with ID: " + id));
        model.addAttribute("meeting", meeting);
        return "meeting/notice";
    }

    @PostMapping("/cancel/{id}")
    public String cancelMeeting(@PathVariable Long id, @AuthenticationPrincipal org.springframework.security.core.userdetails.User springUser) {
        User currentUser = null;
        if (springUser != null) {
            currentUser = userRepository.findByUsername(springUser.getUsername()).orElse(null);
        }
        if (currentUser == null) {
            currentUser = userRepository.findById(1L).orElse(null);
        }
        if (currentUser != null) {
            meetingService.cancelMeeting(id, currentUser);
        }
        return "redirect:/?cancelled=true";
    }

    @PostMapping("/delete/{id}")
    public String deleteMeeting(@PathVariable Long id, @AuthenticationPrincipal org.springframework.security.core.userdetails.User springUser) {
        User currentUser = null;
        if (springUser != null) {
            currentUser = userRepository.findByUsername(springUser.getUsername()).orElse(null);
        }
        if (currentUser == null) {
            currentUser = userRepository.findById(1L).orElseThrow();
        }
        meetingService.deleteMeeting(id, currentUser);
        return "redirect:/?deleted=true";
    }

    @PostMapping("/update/{id}")
    public String updateMeeting(@PathVariable Long id,
                                @ModelAttribute MeetingScheduleDto updatedMeeting,
                                @AuthenticationPrincipal org.springframework.security.core.userdetails.User springUser) {
        User currentUser = null;
        if (springUser != null) {
            currentUser = userRepository.findByUsername(springUser.getUsername()).orElse(null);
        }

        // Fallback user matching your existing pattern
        if (currentUser == null) {
            currentUser = userRepository.findById(5L).orElseThrow();
        }

        // Ensure the ID from the path is set on the object before updating
//        updatedMeeting.setId(id);

        // Ensure you have an updateMeeting method in your MeetingService
        meetingService.updateMeeting(id, updatedMeeting, currentUser);

        return "redirect:/?updated=true";
    }

    @GetMapping("/edit/{id}")
    public String editMeetingForm(@PathVariable Long id, Model model) {
        MeetingSchedule meeting = scheduleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Meeting not found with ID: " + id));

        // Bind the entire meeting object to the form
        model.addAttribute("meeting", meeting);

        // Pass the full lists for the dropdown options
        model.addAttribute("departments", departmentRepository.findAll());
        model.addAttribute("rooms", roomRepository.findAll());
        model.addAttribute("chairpersons", userRepository.findByRoleAndStatus(Role.CHAIRPERSON, "ACTIVE"));
        model.addAttribute("staffMembers", userRepository.findByRoleAndStatus(Role.STAFF, "ACTIVE"));

        // Route to the new dedicated view
        return "meeting/edit";
    }

    @PostMapping("/start/{id}")
    public String startMeeting(@PathVariable Long id, @AuthenticationPrincipal org.springframework.security.core.userdetails.User springUser) {

        User currentUser = null;
        if (springUser != null) {
            currentUser = userRepository.findByUsername(springUser.getUsername()).orElse(null);
        }

        // Fallback user matching your existing pattern
        if (currentUser == null) {
            currentUser = userRepository.findById(5L).orElseThrow();
        }

        meetingService.startMeeting(id, currentUser);
        return "redirect:/?updated=true";
    }

    @PostMapping("/end/{id}")
    public String endMeeting(@PathVariable Long id, @AuthenticationPrincipal org.springframework.security.core.userdetails.User springUser) {

        User currentUser = null;
        if (springUser != null) {
            currentUser = userRepository.findByUsername(springUser.getUsername()).orElse(null);
        }

        // Fallback user matching your existing pattern
        if (currentUser == null) {
            currentUser = userRepository.findById(5L).orElseThrow();
        }

        meetingService.endMeeting(id, currentUser);
        return "redirect:/?updated=true";
    }
}
