package gov.assam.kaac.repository;

import gov.assam.kaac.entity.MeetingRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MeetingRoomRepository extends JpaRepository<MeetingRoom, Long> {
    Optional<MeetingRoom> findByRoomNumber(String roomNumber);
    List<MeetingRoom> findByStatus(String status);
    boolean existsByRoomNumber(String roomNumber);
}
