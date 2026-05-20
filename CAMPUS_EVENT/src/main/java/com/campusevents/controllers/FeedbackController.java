package com.campusevents.controllers;

import com.campusevents.models.Feedback;
import com.campusevents.services.FeedbackService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @PostMapping
    public ResponseEntity<Feedback> submitFeedback(@Valid @RequestBody Feedback feedback) {
        return ResponseEntity.ok(feedbackService.submitFeedback(feedback));
    }

    @GetMapping
    public List<Feedback> getEventFeedback(@RequestParam Long eventId) {
        return feedbackService.getEventFeedback(eventId);
    }
}
