package com.campusevents.services;

import com.campusevents.models.Event;
import com.campusevents.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendRegistrationConfirmation(User user, Event event) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("kurubarakesh47@gmail.com");
            message.setTo(user.getEmail());
            message.setSubject("Registration Confirmation: " + event.getTitle());
            
            String content = String.format(
                "Dear %s,\n\n" +
                "You have successfully registered for the event: %s.\n\n" +
                "Details:\n" +
                "Venue: %s\n" +
                "Time: %s\n" +
                "Department: %s\n\n" +
                "Thank you for using Smart Campus Event Management System!",
                user.getName(),
                event.getTitle(),
                event.getVenue(),
                event.getEventTime(),
                event.getDepartment()
            );
            
            message.setText(content);
            mailSender.send(message);
            System.out.println("Confirmation email sent to: " + user.getEmail());
        } catch (Exception e) {
            System.err.println("Failed to send confirmation email: " + e.getMessage());
        }
    }
}
