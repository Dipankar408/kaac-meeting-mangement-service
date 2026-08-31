package gov.assam.kaac.repository;

import gov.assam.kaac.entity.MeetingRoom;
import gov.assam.kaac.entity.RoomStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MeetingRoomRepository extends JpaRepository<MeetingRoom, Long> {
    Optional<MeetingRoom> findByRoomNumber(String roomNumber);
    List<MeetingRoom> findByStatus(RoomStatus status);
    boolean existsByRoomNumber(String roomNumber);
}
