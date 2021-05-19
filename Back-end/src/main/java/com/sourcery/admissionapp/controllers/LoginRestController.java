package com.sourcery.admissionapp.controllers;

import com.sourcery.admissionapp.model.User;
import com.sourcery.admissionapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("")
public class LoginRestController {

    private final UserService userService;

    @GetMapping("/login")
    public ResponseEntity<Map<String, Object>> loggedInUser(@CurrentSecurityContext(expression = "authentication.name") String email) {
        User user = userService.getUserByEmail(email);
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("role", user.getRole());
        response.put("firstName", user.getFirstName());
        return ResponseEntity.ok(response);
    }
}
