package gov.assam.kaac.service;

import gov.assam.kaac.entity.MeetingSchedule;
import gov.assam.kaac.repository.MeetingScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ConflictService {

    private final MeetingScheduleRepository meetingScheduleRepository;

    public record ConflictResult(
            boolean hasConflict,
            String conflictType,
            String reason,
            MeetingSchedule conflictingMeeting
    ) {
        public static ConflictResult clean() {
            return new ConflictResult(false, null, "No conflicts detected. Staff, Room, and Chairperson are available.", null);
        }
    }

    /**
     * Checks for room, staff, and chairperson conflicts across all active meetings
     */
    public ConflictResult validateSchedule(
            LocalDate date,
            LocalTime start,
            LocalTime end,
            Long roomId,
            Long staffId,
            Long chairpersonId,
            Long excludeScheduleId
    ) {
        if (date == null || start == null || end == null || roomId == null || staffId == null || chairpersonId == null) {
            return new ConflictResult(true, "INVALID_INPUT", "Missing required schedule fields for conflict check.", null);
        }

        if (!start.isBefore(end)) {
            return new ConflictResult(true, "INVALID_TIME", "Invalid time range: End Time must be strictly later than Start Time.", null);
        }

        // 1. Check Room Conflict
        List<MeetingSchedule> roomConflicts = meetingScheduleRepository.findConflictingRoomMeetings(
                date, roomId, start, end, excludeScheduleId
        );
        if (!roomConflicts.isEmpty()) {
            MeetingSchedule conflict = roomConflicts.get(0);
            return new ConflictResult(
                    true,
                    "ROOM_CONFLICT",
                    String.format("Room Conflict: '%s' is already booked for '%s' (%s - %s) on %s.",
                            conflict.getMeetingRoom().getName(), conflict.getTitle(), conflict.getStartTime(), conflict.getEndTime(), date),
                    conflict
            );
        }

        // 2. Check Staff Conflict
        List<MeetingSchedule> staffConflicts = meetingScheduleRepository.findConflictingStaffMeetings(
                date, staffId, start, end, excludeScheduleId
        );
        if (!staffConflicts.isEmpty()) {
            MeetingSchedule conflict = staffConflicts.get(0);
            return new ConflictResult(
                    true,
                    "STAFF_CONFLICT",
                    String.format("Staff Conflict: Staff member '%s' is already assigned to handle '%s' in %s (%s - %s) on %s.",
                            conflict.getAssignedStaff().getFullName(), conflict.getTitle(), conflict.getMeetingRoom().getName(), conflict.getStartTime(), conflict.getEndTime(), date),
                    conflict
            );
        }

        // 3. Check Chairperson Conflict
        List<MeetingSchedule> chairConflicts = meetingScheduleRepository.findConflictingChairpersonMeetings(
                date, chairpersonId, start, end, excludeScheduleId
        );
        if (!chairConflicts.isEmpty()) {
            MeetingSchedule conflict = chairConflicts.get(0);
            return new ConflictResult(
                    true,
                    "CHAIRPERSON_CONFLICT",
                    String.format("Chairperson Conflict: '%s' is already presiding over '%s' in %s (%s - %s) on %s.",
                            conflict.getChairperson().getFullName(), conflict.getTitle(), conflict.getMeetingRoom().getName(), conflict.getStartTime(), conflict.getEndTime(), date),
                    conflict
            );
        }

        return ConflictResult.clean();
    }
}
