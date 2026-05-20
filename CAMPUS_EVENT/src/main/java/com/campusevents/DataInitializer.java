package com.campusevents;

import com.campusevents.models.User;
import com.campusevents.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    public DataInitializer(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        // Create Default Admin
        if (userRepository.findByEmail("admin@campus.com").isEmpty()) {
            User admin = new User();
            admin.setName("System Admin");
            admin.setEmail("admin@campus.com");
            admin.setPassword("admin123");
            admin.setRole("ADMIN");
            admin.setDepartment("Administration");
            userRepository.save(admin);
            System.out.println("Default Admin account created: admin@campus.com / admin123");
        }

        // Create Default Student
        if (userRepository.findByEmail("student@campus.com").isEmpty()) {
            User student = new User();
            student.setName("Test Student");
            student.setEmail("student@campus.com");
            student.setPassword("student123");
            student.setRole("STUDENT");
            student.setDepartment("Computer Science");
            userRepository.save(student);
            System.out.println("Default Student account created: student@campus.com / student123");
        }
    }
}
