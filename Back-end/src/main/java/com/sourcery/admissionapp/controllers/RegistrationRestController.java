package com.sourcery.admissionapp.controllers;

import com.sourcery.admissionapp.model.User;
import com.sourcery.admissionapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequiredArgsConstructor
@RequestMapping("/public")
public class RegistrationRestController {

    private final UserService userService;

    /* TODO: uncomment method bellow, when the registration needs to be activated
         and delete disableRegistration() method.*/
    @PostMapping("/register")
    public ResponseEntity<String> createUser(@Valid @RequestBody User user) {
        userService.saveUserIfEmailUnique(user);
        return new ResponseEntity<>("User successfully created", HttpStatus.CREATED);
    }


//    @PostMapping("/register")
//    public ResponseEntity<String> disableRegistration(@RequestBody User user) {
//        return ResponseEntity.badRequest().build();
//    }
}
