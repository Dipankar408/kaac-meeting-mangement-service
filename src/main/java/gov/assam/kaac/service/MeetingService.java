package gov.assam.kaac.service;

import gov.assam.kaac.dto.MeetingScheduleDto;
import gov.assam.kaac.entity.*;
import gov.assam.kaac.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MeetingService {

    private final MeetingScheduleRepository scheduleRepository;
    private final DepartmentRepository departmentRepository;
    private final MeetingRoomRepository roomRepository;
    private final UserRepository userRepository;
    private final ConflictService conflictService;

    @Transactional(readOnly = true)
    public List<MeetingSchedule> getAllMeetings() {
        return scheduleRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<MeetingSchedule> getMeetingsCreatedBy(Long userId) {
        return scheduleRepository.findByCreatedByIdOrderByMeetingDateDescStartTimeDesc(userId);
    }

    @Transactional(readOnly = true)
    public List<MeetingSchedule> getMeetingsChairedBy(Long chairpersonId) {
        return scheduleRepository.findByChairpersonIdOrderByMeetingDateDescStartTimeDesc(chairpersonId);
    }

    @Transactional
    public MeetingSchedule createMeeting(MeetingScheduleDto meetingDto, User currentUser) {
        // Enforce Chairperson requirement: Any one creating any meeting must select one Chairperson whose role is Role.CHAIRPERSON
        if (meetingDto.getChairpersonId() == null) {
            throw new IllegalArgumentException("Mandatory: A designated Chairperson with role CHAIRPERSON must be selected for every meeting.");
        }

        User chair = userRepository.findById(meetingDto.getChairpersonId())
                .orElseThrow(() -> new IllegalArgumentException("Selected chairperson user not found"));

        if (chair.getRole() != Role.CHAIRPERSON) {
            throw new IllegalArgumentException("Selected user does not have the required CHAIRPERSON role.");
        }

        // Validate Assigned Staff
        if (meetingDto.getAssignedStaffId() == null) {
            throw new IllegalArgumentException("Mandatory: An assigned staff member must be designated to handle the meeting.");
        }

        User staff = userRepository.findById(meetingDto.getAssignedStaffId())
                .orElseThrow(() -> new IllegalArgumentException("Selected staff user not found"));

        // Perform Real-Time Conflict Check
        ConflictService.ConflictResult conflict = conflictService.validateSchedule(
                meetingDto.getMeetingDate(),
                meetingDto.getStartTime(),
                meetingDto.getEndTime(),
                meetingDto.getMeetingRoomId(),
                staff.getId(),
                chair.getId(),
                null
        );

        if (conflict.hasConflict()) {
            throw new IllegalStateException(conflict.reason());
        }


        MeetingSchedule meeting = buildMeetingSchedule(meetingDto, currentUser, chair, staff);

        return scheduleRepository.save(meeting);
    }

    private MeetingSchedule buildMeetingSchedule(MeetingScheduleDto meetingDto, User currentUser, User chair, User staff) {
        Optional<Department> optionalDepartment = departmentRepository.findById(meetingDto.getDepartmentId());
        Optional<MeetingRoom> meetingRoom = roomRepository.findById(meetingDto.getMeetingRoomId());
        MeetingSchedule meeting = MeetingSchedule.builder()
                .title(meetingDto.getTitle())
                .meetingDate(meetingDto.getMeetingDate())
                .startTime(meetingDto.getStartTime())
                .endTime(meetingDto.getEndTime())
                .department(optionalDepartment.isPresent() ? optionalDepartment.get() : null)
                .meetingRoom(meetingRoom.isPresent() ? meetingRoom.get() : null)
                .chairperson(chair)
                .assignedStaff(staff)
                .createdBy(currentUser)
                .status(meetingDto.getStatus())
                .agenda(meetingDto.getAgenda())
                .attendees(meetingDto.getAttendees())
                .decisionNotes(meetingDto.getDecisionNotes())
                .meetingType(meetingDto.getMeetingType())
                .priority(meetingDto.getPriority())
                .virtualLink(meetingDto.getVirtualLink())
                .build();
        return meeting;
    }

    @Transactional
    public MeetingSchedule updateMeeting(Long id, MeetingScheduleDto updated, User currentUser) {
        MeetingSchedule existing = scheduleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Meeting schedule not found with id: " + id));

        // Authorization check: ADMIN can update all. STAFF and CHAIRPERSON can ONLY update meetings created by them.
        if (currentUser.getRole() != Role.ADMIN && !existing.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Unauthorized: You can only update meetings created by you.");
        }

        User chair = userRepository.findById(updated.getChairpersonId())
                .orElseThrow(() -> new IllegalArgumentException("Selected chairperson user not found"));

        if (chair.getRole() != Role.CHAIRPERSON) {
            throw new IllegalArgumentException("Selected user does not have the required CHAIRPERSON role.");
        }

        // Validate Assigned Staff
        if (updated.getAssignedStaffId() == null) {
            throw new IllegalArgumentException("Mandatory: An assigned staff member must be designated to handle the meeting.");
        }

        User staff = userRepository.findById(updated.getAssignedStaffId())
                .orElseThrow(() -> new IllegalArgumentException("Selected staff user not found"));

        // Conflict check on update
        ConflictService.ConflictResult conflict = conflictService.validateSchedule(
                updated.getMeetingDate() != null ? updated.getMeetingDate() : existing.getMeetingDate(),
                updated.getStartTime() != null ? updated.getStartTime() : existing.getStartTime(),
                updated.getEndTime() != null ? updated.getEndTime() : existing.getEndTime(),
                updated.getMeetingRoomId(),
                updated.getAssignedStaffId(),
                updated.getChairpersonId(),
                id
        );

        if (conflict.hasConflict() && updated.getStatus() != MeetingStatus.CANCELLED) {
            throw new IllegalStateException(conflict.reason());
        }

        existing = buildMeetingSchedule(updated, existing.getCreatedBy(), chair, staff);
        existing.setId(id);

        return scheduleRepository.save(existing);
    }

    @Transactional
    public MeetingSchedule cancelMeeting(Long id, User currentUser) {
        MeetingSchedule existing = scheduleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Meeting schedule not found with id: " + id));

        // Authorization check: ADMIN can cancel all. STAFF and CHAIRPERSON can cancel meetings they created or are designated for.
        if (currentUser != null && currentUser.getRole() != Role.ADMIN
                && !existing.getCreatedBy().getId().equals(currentUser.getId())
                && (existing.getChairperson() == null || !existing.getChairperson().getId().equals(currentUser.getId()))
                && (existing.getAssignedStaff() == null || !existing.getAssignedStaff().getId().equals(currentUser.getId()))) {
            throw new AccessDeniedException("Unauthorized: You can only cancel meetings you created or are designated for.");
        }

        existing.setStatus(MeetingStatus.CANCELLED);
        return scheduleRepository.save(existing);
    }

    @Transactional
    public void deleteMeeting(Long id, User currentUser) {
        MeetingSchedule existing = scheduleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Meeting schedule not found with id: " + id));

        // Authorization check: ADMIN can delete all. STAFF and CHAIRPERSON can ONLY delete meetings created by them.
        if (currentUser.getRole() != Role.ADMIN && !existing.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Unauthorized: You can only delete meetings created by you.");
        }

        scheduleRepository.delete(existing);
    }

    @Transactional
    public void startMeeting(Long id, User currentUser) {
        MeetingSchedule existing = scheduleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Meeting schedule not found with id: " + id));

        // Authorization check: ADMIN can delete all. STAFF and CHAIRPERSON can ONLY delete meetings created by them.
        if (currentUser.getRole() != Role.ADMIN && !existing.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Unauthorized: You can only delete meetings created by you.");
        }

        existing.setStatus(MeetingStatus.IN_PROGRESS);
        existing.setStartTime(LocalTime.now());
        existing.setMeetingDate(LocalDate.now());
        scheduleRepository.save(existing);
    }

    @Transactional
    public void endMeeting(Long id, User currentUser) {
        MeetingSchedule existing = scheduleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Meeting schedule not found with id: " + id));

        // Authorization check: ADMIN can delete all. STAFF and CHAIRPERSON can ONLY delete meetings created by them.
        if (currentUser.getRole() != Role.ADMIN && !existing.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Unauthorized: You can only delete meetings created by you.");
        }

        existing.setStatus(MeetingStatus.COMPLETED);
        existing.setEndTime(LocalTime.now());
        scheduleRepository.save(existing);
    }
}
