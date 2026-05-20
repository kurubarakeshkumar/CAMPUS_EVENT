package com.campusevents.services;

import com.campusevents.models.Event;
import com.campusevents.models.Registration;
import com.campusevents.models.User;
import com.campusevents.repositories.EventRepository;
import com.campusevents.repositories.RegistrationRepository;
import com.campusevents.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RegistrationService {

    @Autowired
    private RegistrationRepository registrationRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    public Registration registerForEvent(Long userId, Long eventId) {
        if (registrationRepository.existsByUserIdAndEventId(userId, eventId)) {
            throw new RuntimeException("User already registered for this event");
        }

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (event.getCapacity() != null && event.getRegisteredCount() >= event.getCapacity()) {
            throw new RuntimeException("Event is already at full capacity");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Registration registration = new Registration();
        registration.setUser(user);
        registration.setEvent(event);

        event.setRegisteredCount(event.getRegisteredCount() + 1);
        eventRepository.save(event);

        Registration savedRegistration = registrationRepository.save(registration);
        
        // Send confirmation email
        emailService.sendRegistrationConfirmation(user, event);
        
        return savedRegistration;
    }

    @Transactional
    public void unregisterForEvent(Long userId, Long eventId) {
        Registration registration = registrationRepository.findByUserIdAndEventId(userId, eventId)
                .orElseThrow(() -> new RuntimeException("Registration not found"));

        Event event = registration.getEvent();
        event.setRegisteredCount(Math.max(0, event.getRegisteredCount() - 1));
        eventRepository.save(event);

        registrationRepository.delete(registration);
    }

    public List<Registration> getUserRegistrations(Long userId) {
        return registrationRepository.findByUserId(userId);
    }

    public List<Registration> getEventRegistrations(Long eventId) {
        return registrationRepository.findByEventId(eventId);
    }

    public List<Registration> getAllRegistrations() {
        return registrationRepository.findAll();
    }

    public Map<String, Object> getRegistrationStats() {
        Map<String, Object> stats = new HashMap<>();
        long totalEvents = eventRepository.count();
        long totalRegistrations = registrationRepository.count();
        long totalUsers = userRepository.count();

        stats.put("totalEvents", totalEvents);
        stats.put("totalRegistrations", totalRegistrations);
        stats.put("totalUsers", totalUsers);
        return stats;
    }
}
