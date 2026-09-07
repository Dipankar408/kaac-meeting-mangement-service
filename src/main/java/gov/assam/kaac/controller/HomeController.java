package gov.assam.kaac.controller;

import gov.assam.kaac.entity.*;
import gov.assam.kaac.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

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
        List<MeetingRoom> availableRoms = roomRepository.findByStatus(RoomStatus.AVAILABLE);
        long totalDepartments = departmentRepository.count();
        long totalUsers = userRepository.count();

        model.addAttribute("meetings", meetings.stream().filter(it -> it.getMeetingDate().equals(today)).collect(Collectors.toSet()));
        model.addAttribute("totalMeetings", totalMeetings);
        model.addAttribute("upcomingMeetings", upcomingCount);
        model.addAttribute("completedMeetings", completedCount);
        model.addAttribute("completedVirtual", completedVcCount);
        model.addAttribute("completedPhysical", completedPhyCount);
        model.addAttribute("upcomingToday", upcomingToday);
        model.addAttribute("completedToday", completedToday);
        model.addAttribute("unoccupiedRooms", CollectionUtils.isEmpty(availableRoms) ? 0 : availableRoms.size());
        model.addAttribute("totalDepartments", totalDepartments);
        model.addAttribute("totalRooms", totalRooms);
        model.addAttribute("totalUsers", totalUsers);
        model.addAttribute("currentUser", totalUsers);

        return "index";
    }
}
