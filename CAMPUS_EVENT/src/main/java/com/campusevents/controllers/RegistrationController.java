package com.campusevents.controllers;

import com.campusevents.models.Registration;
import com.campusevents.services.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {

    @Autowired
    private RegistrationService registrationService;

    @PostMapping
    public ResponseEntity<?> registerForEvent(@RequestBody Map<String, Long> payload) {
        Long userId = payload.get("userId");
        Long eventId = payload.get("eventId");
        Registration registration = registrationService.registerForEvent(userId, eventId);
        return ResponseEntity.ok(registration);
    }

    @DeleteMapping("/user/{userId}/event/{eventId}")
    public ResponseEntity<?> unregisterForEvent(@PathVariable Long userId, @PathVariable Long eventId) {
        registrationService.unregisterForEvent(userId, eventId);
        return ResponseEntity.ok(Map.of("message", "Successfully unregistered"));
    }

    @GetMapping
    public List<Registration> getAllRegistrations() {
        return registrationService.getAllRegistrations();
    }

    @GetMapping("/user/{id}")
    public List<Registration> getUserRegistrations(@PathVariable Long id) {
        return registrationService.getUserRegistrations(id);
    }

    @GetMapping("/event/{id}")
    public List<Registration> getEventRegistrations(@PathVariable Long id) {
        return registrationService.getEventRegistrations(id);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(registrationService.getRegistrationStats());
    }
}
