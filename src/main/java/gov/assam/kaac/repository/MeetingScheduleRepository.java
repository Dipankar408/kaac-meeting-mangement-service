package gov.assam.kaac.repository;

import gov.assam.kaac.entity.MeetingSchedule;
import gov.assam.kaac.entity.MeetingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface MeetingScheduleRepository extends JpaRepository<MeetingSchedule, Long> {

    // Find all meetings created by a specific user (Staff / Chairperson boundary)
    List<MeetingSchedule> findByCreatedByIdOrderByMeetingDateDescStartTimeDesc(Long userId);

    // Find all meetings where a user is the presiding CHAIRPERSON
    List<MeetingSchedule> findByChairpersonIdOrderByMeetingDateDescStartTimeDesc(Long chairpersonId);

    // Find meetings by department
    List<MeetingSchedule> findByDepartmentId(Long departmentId);

    // Find meetings by date
    List<MeetingSchedule> findByMeetingDateOrderByStartTimeAsc(LocalDate meetingDate);

    // Find all meetings handled by an assigned staff member
    List<MeetingSchedule> findByAssignedStaffIdOrderByMeetingDateDescStartTimeDesc(Long staffId);

    // Find all meetings handled by an assigned staff on a specific date
    List<MeetingSchedule> findByAssignedStaffIdAndMeetingDateOrderByStartTimeAsc(Long staffId, LocalDate meetingDate);

    // Real-Time Conflict Check: Meeting Room Overlap on given date
    @Query("SELECT m FROM MeetingSchedule m WHERE m.meetingDate = :meetingDate " +
           "AND m.meetingRoom.id = :roomId " +
           "AND m.status != 'CANCELLED' " +
           "AND (:excludeId IS NULL OR m.id != :excludeId) " +
           "AND (m.startTime < :endTime AND m.endTime > :startTime)")
    List<MeetingSchedule> findConflictingRoomMeetings(
            @Param("meetingDate") LocalDate meetingDate,
            @Param("roomId") Long roomId,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("excludeId") Long excludeId
    );

    // Real-Time Conflict Check: Staff Overlap on given date
    @Query("SELECT m FROM MeetingSchedule m WHERE m.meetingDate = :meetingDate " +
           "AND m.assignedStaff.id = :staffId " +
           "AND m.status != 'CANCELLED' " +
           "AND (:excludeId IS NULL OR m.id != :excludeId) " +
           "AND (m.startTime < :endTime AND m.endTime > :startTime)")
    List<MeetingSchedule> findConflictingStaffMeetings(
            @Param("meetingDate") LocalDate meetingDate,
            @Param("staffId") Long staffId,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("excludeId") Long excludeId
    );

    // Real-Time Conflict Check: Chairperson Overlap on given date
    @Query("SELECT m FROM MeetingSchedule m WHERE m.meetingDate = :meetingDate " +
           "AND m.chairperson.id = :chairpersonId " +
           "AND m.status != 'CANCELLED' " +
           "AND (:excludeId IS NULL OR m.id != :excludeId) " +
           "AND (m.startTime < :endTime AND m.endTime > :startTime)")
    List<MeetingSchedule> findConflictingChairpersonMeetings(
            @Param("meetingDate") LocalDate meetingDate,
            @Param("chairpersonId") Long chairpersonId,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime,
            @Param("excludeId") Long excludeId
    );

    long countByCreatedById(Long userId);
    long countByChairpersonId(Long chairpersonId);
    long countByStatus(MeetingStatus status);
}
