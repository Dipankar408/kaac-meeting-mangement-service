package gov.assam.kaac.controller;

import gov.assam.kaac.entity.MeetingSchedule;
import gov.assam.kaac.entity.MeetingStatus;
import gov.assam.kaac.entity.MeetingType;
import gov.assam.kaac.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.LocalDate;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class HomeController {

    private final MeetingScheduleRepository scheduleRepository;
    private final DepartmentRepository departmentRepository;
    private final MeetingRoomRepository roomRepository;
    private final UserRepository userRepository;

    @GetMapping("/")
    public String index(Model model) {
        List<MeetingSchedule> meetings = scheduleRepository.findAll();
        LocalDate today = LocalDate.now();

        long totalMeetings = scheduleRepository.count();
        long upcomingCount = meetings.stream().filter(m -> m.getStatus() == MeetingStatus.SCHEDULED).count();
        long completedCount = meetings.stream().filter(m -> m.getStatus() == MeetingStatus.COMPLETED).count();

        long upcomingToday = meetings.stream()
                .filter(m -> m.getStatus() == MeetingStatus.SCHEDULED && today.equals(m.getMeetingDate()))
                .count();

        long completedToday = meetings.stream()
                .filter(m -> m.getStatus() == MeetingStatus.COMPLETED && today.equals(m.getMeetingDate()))
                .count();

        long completedVcCount = meetings.stream()
                .filter(m -> m.getStatus() == MeetingStatus.COMPLETED && MeetingType.VIRTUAL.equals(m.getMeetingType()))
                .count();

        long completedPhyCount = meetings.stream()
                .filter(m -> m.getStatus() == MeetingStatus.COMPLETED && MeetingType.PHYSICAL.equals(m.getMeetingType()))
                .count();

        long totalRooms = roomRepository.count();
        long totalDepartments = departmentRepository.count();
        long totalUsers = userRepository.count();

        model.addAttribute("meetings", meetings);
        model.addAttribute("totalMeetings", totalMeetings);
        model.addAttribute("upcomingMeetings", upcomingCount);
        model.addAttribute("completedMeetings", completedCount);
        model.addAttribute("completedVirtual", completedVcCount);
        model.addAttribute("completedPhysical", completedPhyCount);
        model.addAttribute("upcomingToday", upcomingToday > 0 ? upcomingToday : upcomingCount);
        model.addAttribute("completedToday", completedToday > 0 ? completedToday : completedCount);
        model.addAttribute("unoccupiedRooms", totalRooms > 0 ? totalRooms : 4);
        model.addAttribute("totalDepartments", totalDepartments);
        model.addAttribute("totalRooms", totalRooms);
        model.addAttribute("totalUsers", totalUsers);
        model.addAttribute("currentUser", totalUsers);

        return "index";
    }
}
