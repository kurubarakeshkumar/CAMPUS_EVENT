package com.campusevents.controllers;

import com.campusevents.models.User;
import com.campusevents.services.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody Map<String, Object> request) {
        String name = (String) request.get("name");
        String email = (String) request.get("email");
        String password = (String) request.get("password");
        String role = (String) request.get("role");
        String department = (String) request.get("department");

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(password);
        user.setRole(role);
        user.setDepartment(department);

        return ResponseEntity.ok(userService.registerUser(user));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");
        User user = userService.loginUser(email, password);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/user/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        String name = (String) request.get("name");
        String department = (String) request.get("department");
        String password = (String) request.get("password");

        User userDetails = new User();
        userDetails.setName(name);
        userDetails.setDepartment(department);
        userDetails.setPassword(password);

        return ResponseEntity.ok(userService.updateUser(id, userDetails));
    }
}

