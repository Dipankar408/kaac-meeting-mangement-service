package gov.assam.kaac.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "meeting_schedules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MeetingSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Meeting title is required")
    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String agenda;

    @NotNull(message = "Meeting date is required")
    @Column(name = "meeting_date", nullable = false)
    private LocalDate meetingDate;

    @NotNull(message = "Start time is required")
    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @NotNull(message = "Department is required")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;

    @NotNull(message = "Meeting room is required")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "meeting_room_id", nullable = false)
    private MeetingRoom meetingRoom;

    /**
     * MANDATORY REQUIREMENT:
     * Anyone creating any meeting MUST select one designated Chairperson
     * whose role is Role.CHAIRPERSON.
     */
    @NotNull(message = "A designated Chairperson must be selected for every meeting")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "chairperson_id", nullable = false)
    private User chairperson;

    @NotNull(message = "An assigned Staff member must be designated to handle the meeting")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_staff_id", nullable = false)
    private User assignedStaff;

    @NotNull(message = "Creator user reference is required")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "created_by_user_id", nullable = false)
    private User createdBy;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private MeetingStatus status = MeetingStatus.SCHEDULED;

    @Column(length = 20)
    @Builder.Default
    private String priority = "NORMAL";

    @Enumerated(EnumType.STRING)
    @Column(name = "meeting_type", length = 20)
    @Builder.Default
    private MeetingType meetingType = MeetingType.PHYSICAL;

    @Column(name = "virtual_link", length = 255)
    private String virtualLink;

    @Column(columnDefinition = "TEXT")
    private String attendees;

    @Column(name = "minutes_of_meeting", columnDefinition = "TEXT")
    private String minutesOfMeeting;

    @Column(name = "decision_notes", columnDefinition = "TEXT")
    private String decisionNotes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
