package gov.assam.kaac.controller;

import gov.assam.kaac.entity.*;
import gov.assam.kaac.repository.*;
import gov.assam.kaac.service.ConflictService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/staff")
@RequiredArgsConstructor
public class StaffController {

    private final MeetingScheduleRepository scheduleRepository;
    private final DepartmentRepository departmentRepository;
    private final MeetingRoomRepository roomRepository;
    private final UserRepository userRepository;
    private final ConflictService conflictService;

    @GetMapping("/dashboard")
    public String viewStaffAssignments(Model model) {
        // 1. Fetch all meetings
        List<MeetingSchedule> allMeetings = scheduleRepository.findAll();

        // 2. Group meetings by Date and sort them ascending (as seen in the image)
        Map<LocalDate, List<MeetingSchedule>> meetingsByDate = allMeetings.stream()
                .filter(m -> m.getMeetingDate() != null)
                .sorted(Comparator.comparing(MeetingSchedule::getMeetingDate))
                .collect(Collectors.groupingBy(
                        MeetingSchedule::getMeetingDate,
                        LinkedHashMap::new, // Maintains sorted order
                        Collectors.toList()
                ));

        // 3. Calculate summary metrics for the top cards
        List<User> staffMembers = userRepository.findByRoleAndStatus(Role.STAFF, "ACTIVE");
        Map<Long, Long> assignedCounts = new HashMap<>();
        Map<Long, Long> activeDatesCounts = new HashMap<>();

        for (User staff : staffMembers) {
            // NOTE: Change getCreatedById() to getAssignedStaff() if your entity is different
            List<MeetingSchedule> staffMeetings = allMeetings.stream()
                    .filter(m -> m.getCreatedBy() != null && m.getCreatedBy().getId().equals(staff.getId()))
                    .toList();

            assignedCounts.put(staff.getId(), (long) staffMeetings.size());

            long uniqueDates = staffMeetings.stream()
                    .map(MeetingSchedule::getMeetingDate)
                    .filter(Objects::nonNull)
                    .distinct()
                    .count();
            activeDatesCounts.put(staff.getId(), uniqueDates);
        }

        model.addAttribute("meetingsByDate", meetingsByDate);
        model.addAttribute("staffMembers", staffMembers);
        model.addAttribute("assignedCounts", assignedCounts);
        model.addAttribute("activeDatesCounts", activeDatesCounts);

        return "staff/dashboard";
    }
    // Real-time AJAX Conflict Check API
    @GetMapping("/check-conflict")
    @ResponseBody
    public ConflictService.ConflictResult checkConflict(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime end,
            @RequestParam Long roomId,
            @RequestParam Long staffId,
            @RequestParam Long chairpersonId,
            @RequestParam(required = false) Long excludeScheduleId
    ) {
        return conflictService.validateSchedule(date, start, end, roomId, staffId, chairpersonId, excludeScheduleId);
    }
}
