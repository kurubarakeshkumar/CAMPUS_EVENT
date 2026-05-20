package com.campusevents.services;

import com.campusevents.models.Feedback;
import com.campusevents.repositories.FeedbackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    public Feedback submitFeedback(Feedback feedback) {
        return feedbackRepository.save(feedback);
    }

    public List<Feedback> getEventFeedback(Long eventId) {
        return feedbackRepository.findByEventId(eventId);
    }
}
