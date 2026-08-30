package gov.assam.kaac.dto;

import gov.assam.kaac.entity.MeetingStatus;
import gov.assam.kaac.entity.MeetingType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MeetingScheduleDto {
    private String title;

    private String agenda;

    @NotNull(message = "Meeting date is required")
    private LocalDate meetingDate;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

    @NotNull(message = "Department is required")
    private Long departmentId;

    @NotNull(message = "Meeting room is required")
    private Long meetingRoomId;

    @NotNull(message = "A designated Chairperson must be selected for every meeting")
    private Long chairpersonId;

    @NotNull(message = "An assigned Staff member must be designated to handle the meeting")
    private Long assignedStaffId;

    @NotNull
    @Builder.Default
    private MeetingStatus status = MeetingStatus.SCHEDULED;

    @Builder.Default
    private String priority = "NORMAL";

    @Builder.Default
    private MeetingType meetingType = MeetingType.PHYSICAL;

    private String virtualLink;

    private String attendees;

    private String minutesOfMeeting;

    private String decisionNotes;
}
