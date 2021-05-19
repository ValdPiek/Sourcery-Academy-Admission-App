package com.sourcery.admissionapp.controllers;

import com.sourcery.admissionapp.model.Academy;
import com.sourcery.admissionapp.model.enitityview.AcademyView;
import com.sourcery.admissionapp.security.AuthorizationRole;
import com.sourcery.admissionapp.security.UserRole;
import com.sourcery.admissionapp.service.AcademyService;
import com.sourcery.admissionapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/academies")
public class AcademyRestController {

    private final AcademyService academyService;
    private final UserService userService;

    @PreAuthorize(AuthorizationRole.ADMIN_ROLE)
    @PostMapping("")
    public ResponseEntity<Academy> createAcademy(@CurrentSecurityContext(expression = "authentication.name") String userEmail,
                                                 @Valid @RequestBody Academy academy) {
        Academy newAcademy = academyService.saveAcademy(userEmail, academy);
        return new ResponseEntity<>(newAcademy, HttpStatus.CREATED);
    }

    @GetMapping("")
    public ResponseEntity<List<AcademyView>> getAcademiesByUserRole(@CurrentSecurityContext(expression = "authentication.name") String userEmail) {
        UserRole currentUserRole = userService.getUserRoleByEmail(userEmail);
        if (currentUserRole.equals(UserRole.ADMIN)) {
            return ResponseEntity.ok(academyService.getAcademies());
        }
        return ResponseEntity.ok(academyService.getAllAcademiesForStudents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AcademyView> viewAcademyById(@PathVariable("id") Long id,
                                                       @CurrentSecurityContext(expression = "authentication.name") String email) {
        UserRole currentUserRole = userService.getUserRoleByEmail(email);
        if (currentUserRole.equals(UserRole.STUDENT)) {
            return ResponseEntity.ok(academyService.getAcademyViewForStudentsById(id));
        }
        return ResponseEntity.ok(academyService.getAcademyViewById(id));
    }

    @PreAuthorize(AuthorizationRole.ADMIN_ROLE)
    @PutMapping("/{id}")
    public ResponseEntity<String> updateAcademyById(@PathVariable("id") Long academyId,
                                                    @CurrentSecurityContext(expression = "authentication.name") String userEmail,
                                                    @Valid @RequestBody Academy academy) {
        academyService.updateAcademy(academyId, userEmail, academy);
        return new ResponseEntity<>("Academy successfully updated", HttpStatus.OK);
    }

    @PreAuthorize(AuthorizationRole.ADMIN_ROLE)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAcademyById(@PathVariable("id") Long academyId) {
        academyService.deleteAcademy(academyId);
        return new ResponseEntity<>("Academy successfully deleted", HttpStatus.OK);
    }
}
