package com.campusevents.repositories;

import com.campusevents.models.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    
    @Query("SELECT e FROM Event e WHERE " +
           "(:department IS NULL OR e.department LIKE %:department%) AND " +
           "(:type IS NULL OR e.type LIKE %:type%) AND " +
           "(:startDate IS NULL OR e.eventDate >= :startDate)")
    List<Event> searchEvents(@Param("department") String department,
                             @Param("type") String type,
                             @Param("startDate") LocalDateTime startDate);
}
