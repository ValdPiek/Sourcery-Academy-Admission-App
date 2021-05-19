package com.sourcery.admissionapp.service;

import com.sourcery.admissionapp.model.User;
import com.sourcery.admissionapp.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserPrincipalDetailsService implements UserDetailsService {

    private final UserService userService;

    @Override
    public UserDetails loadUserByUsername(String email) {
        User user = this.userService.getUserByEmail(email);
        return new UserPrincipal(user);
    }
}
