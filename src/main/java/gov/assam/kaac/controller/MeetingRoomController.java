package gov.assam.kaac.controller;

import gov.assam.kaac.entity.MeetingRoom;
import gov.assam.kaac.repository.MeetingRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/rooms")
@RequiredArgsConstructor
public class MeetingRoomController {

    private final MeetingRoomRepository roomRepository;

    @GetMapping
    public String listRooms(Model model) {
        List<MeetingRoom> rooms = roomRepository.findAll();
        model.addAttribute("rooms", rooms);
        model.addAttribute("totalRooms", rooms.size());
        return "room/list";
    }
}
