package com.sourcery.admissionapp.service;

import com.sourcery.admissionapp.model.User;
import com.sourcery.admissionapp.model.enitityview.UserView;
import com.sourcery.admissionapp.repository.UserRepository;
import com.sourcery.admissionapp.security.UserRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public void saveUserIfEmailUnique(User user) {
        if (userRepository.findUserByEmail(user.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User with this email already exist");
        }
        User newUser = saveNewUser(user);
        setUserReferences(newUser);
        saveNewUser(newUser);
    }

    public void setUserReferences(User user) {
        user.setCreatorId(user.getId());
        user.setUpdaterId(user.getId());
    }

    public User saveNewUser(User user) {
        log.info("Saving new user: {}", user);
        return userRepository.save(user);
    }

    public User getUserByEmail(String userEmail) {
        log.info("Searching user by email: {}", userEmail);
        return userRepository.findUserByEmail(userEmail)
                .orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        String.format("User with email - %s, does not exist", userEmail)));
    }

    public User getUserById(Long userId) {
        return userRepository.findUserById(userId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND,
                        String.format("User with id - %d, does not exist", userId)));
    }

    public UserRole getUserRoleByEmail(String userEmail) {
        log.info("Retrieving user role by email: {}", userEmail);
       return getUserByEmail(userEmail).getRole();
    }

    public Page<UserView> findAllActiveAcademyStudents(Long academyId, Integer pageNumber, Integer pageSize, String orderBy) {
        log.info("Retrieving active students from academy: {}", academyId);
        return userRepository.getActiveAcademyUsers(academyId,
                PageRequest.of(pageNumber, pageSize, Sort.by(orderBy).ascending()));
    }

    public long getStudentsCount() {
        return userRepository.countUserByRoleIs(UserRole.STUDENT);
    }

    public boolean isUserStudent(User user){
        return user.getRole().equals(UserRole.STUDENT);
    }

    public boolean isUserAdmin(User user){
        return user.getRole().equals(UserRole.ADMIN);
    }

}
