package com.campusevents.services;

import com.campusevents.models.Event;
import com.campusevents.repositories.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event getEventById(Long id) {
        return eventRepository.findById(id).orElseThrow(() -> new RuntimeException("Event not found"));
    }

    public Event createEvent(Event event) {
        return eventRepository.save(event);
    }

    public Event updateEvent(Long id, Event eventDetails) {
        Event event = getEventById(id);
        event.setTitle(eventDetails.getTitle());
        event.setDescription(eventDetails.getDescription());
        event.setDepartment(eventDetails.getDepartment());
        event.setType(eventDetails.getType());
        event.setVenue(eventDetails.getVenue());
        event.setEventDate(eventDetails.getEventDate());
        event.setEventTime(eventDetails.getEventTime());
        if (eventDetails.getCapacity() != null) {
            event.setCapacity(eventDetails.getCapacity());
        }
        return eventRepository.save(event);
    }

    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }

    public List<Event> searchEvents(String department, String type, String startDateStr) {
        LocalDateTime startDate = null;
        if (startDateStr != null && !startDateStr.isEmpty()) {
            startDate = LocalDateTime.parse(startDateStr);
        }
        return eventRepository.searchEvents(department, type, startDate);
    }
}
