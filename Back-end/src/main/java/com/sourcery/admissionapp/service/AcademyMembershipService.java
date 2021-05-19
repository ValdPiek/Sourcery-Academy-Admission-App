package com.sourcery.admissionapp.service;

import com.sourcery.admissionapp.model.Academy;
import com.sourcery.admissionapp.model.AcademyMembership;
import com.sourcery.admissionapp.model.User;
import com.sourcery.admissionapp.repository.AcademyMembershipRepository;
import com.sourcery.admissionapp.security.UserRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AcademyMembershipService {

    private final AcademyMembershipRepository academyMembershipRepository;
    private final UserService userService;
    private final AcademyService academyService;

    public AcademyMembership applyUserToAcademy(Long academyId, String userEmail) {
        log.info("Applying user {} to academy {}", userEmail, academyId);
        User user = userService.getUserByEmail(userEmail);
        Academy academy = academyService.getAcademyById(academyId);
        return academyMembershipMapper(academy, user);
    }

    public AcademyMembership academyMembershipMapper(Academy academy, User user) {
        AcademyMembership academyMembership = new AcademyMembership();

        academyMembership.setAcademy(academy);
        academyMembership.setUser(user);
        academyMembership.setIsSuspended(false);
        academyMembership.setCreatorId(user.getId());
        academyMembership.setCreatedDate(LocalDateTime.now());
        academyMembership.setUpdaterId(user.getId());
        academyMembership.setUpdatedDate(LocalDateTime.now());
        user.getAcademyMemberships().add(academyMembership);
        academy.getAcademyMemberships().add(academyMembership);
        academyMembershipRepository.save(academyMembership);

        return academyMembership;
    }

    public String dropUserFromAcademy(Long academyId, Long userId, String userEmail) {
        log.info("Droping user by academy id {}, user id {} and userEmail {}", academyId, userId, userEmail);
        User userWithMembership = userService.getUserById(userId);
        User userWhoDrops = userService.getUserByEmail(userEmail);
        Academy academy = academyService.getAcademyById(academyId);
        AcademyMembership academyMembership = getAcademyMembershipById(academyId, userId);

        if(userWhoDrops.getRole().equals(UserRole.STUDENT) && userWhoDrops.getId().equals(academyMembership.getCreatorId())){
            userWithMembership.getAcademyMemberships().remove(academyMembership);
            academy.getAcademyMemberships().remove(academyMembership);
            academyMembershipRepository.delete(academyMembership);
            return "User's academy membership deleted successfully";
        } else if (userWhoDrops.getRole().equals(UserRole.ADMIN)) {
            academyMembership.setIsSuspended(true);
            academyMembership.setUpdaterId(userWhoDrops.getId());
            academyMembership.setUpdatedDate(LocalDateTime.now());
            academyMembershipRepository.save(academyMembership);
            return "User removed from academy successfully";
        } else throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Do not have permissions to drop user from academy");

    }

    public AcademyMembership getAcademyMembershipById(Long academyId, Long userId) {
        log.info("Retrieving membership by academy id {} and user id {}", academyId, userId);
        return academyMembershipRepository
                .findAcademyMembershipByIdAcademyIdAndUserId(academyId, userId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND,
                                String.format("User with id - %d, is not a member of academy with id - %d", userId, academyId)));
    }

    public Map<String, Long> getAllActiveAcademyStudentsCount(Long academyId) {
        log.info("Retrieving students count from academy: {}", academyId);
        Map<String, Long> studentsCount = new HashMap<>();
        studentsCount.put("activeStudents", academyMembershipRepository.getActiveAcademyStudentsCount(academyId));
        return studentsCount;
    }

    public boolean checkStudentStatusInAcademy(Long academyId, Long userId) {
        log.info("Checking if user {} is student in academy {}", userId, academyId);
        Optional<AcademyMembership> academyMembership = academyMembershipRepository.findAcademyMembershipByIdAcademyIdAndUserId(academyId, userId);

        if(academyMembership.isPresent()){
            if(academyMembership.get().getIsSuspended()){
                throw new ResponseStatusException(HttpStatus.CONFLICT, "The user is suspended from academy by an administrator");
            } else return true;
        } else return false;
    }
}
