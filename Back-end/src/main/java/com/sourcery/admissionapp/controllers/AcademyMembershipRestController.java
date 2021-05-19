package com.sourcery.admissionapp.controllers;

import com.sourcery.admissionapp.model.Academy;
import com.sourcery.admissionapp.model.AcademyMembership;
import com.sourcery.admissionapp.model.enitityview.UserView;
import com.sourcery.admissionapp.security.AuthorizationRole;
import com.sourcery.admissionapp.service.AcademyMembershipService;
import com.sourcery.admissionapp.service.AcademyService;
import com.sourcery.admissionapp.service.UserService;
import com.sourcery.admissionapp.utils.DefaultPagination;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/academies")
public class AcademyMembershipRestController {

    private final AcademyMembershipService academyMembershipService;
    private final AcademyService academyService;
    private final UserService userService;

    @PreAuthorize(AuthorizationRole.STUDENT_ROLE)
    @PostMapping("/{id}/membership")
    public ResponseEntity<AcademyMembership> applyUserToAcademy(@PathVariable("id") Long academyId,
                                                                @CurrentSecurityContext(expression = "authentication.name") String userEmail) {
        AcademyMembership academyMembership = academyMembershipService.applyUserToAcademy(academyId, userEmail);
        return ResponseEntity.ok(academyMembership);
    }

    @GetMapping("/{academyId}/membership/{userId}")
    public ResponseEntity<Boolean> getStudentStatusInAcademy(@PathVariable("academyId") Long academyId,
                                                             @PathVariable("userId") Long userId) {
        return ResponseEntity.ok(academyMembershipService.checkStudentStatusInAcademy(academyId, userId));
    }

    @DeleteMapping("/{academyId}/membership/{userId}")
    public ResponseEntity<String> dropUserFromAcademy(@PathVariable("academyId") Long academyId,
                                                      @PathVariable("userId") Long userId,
                                                      @CurrentSecurityContext(expression = "authentication.name") String userEmail) {
        String response = academyMembershipService.dropUserFromAcademy(academyId, userId, userEmail);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PreAuthorize(AuthorizationRole.ADMIN_ROLE)
    @GetMapping("/{academyId}/students")
    public Page<UserView> getAllActiveAcademyStudents(
                                        @RequestParam(defaultValue = DefaultPagination.DEFAULT_PAGE) Integer page,
                                        @RequestParam(defaultValue = DefaultPagination.DEFAULT_PAGE_SIZE) Integer size,
                                        @RequestParam(required = false, defaultValue = DefaultPagination.DEFAULT_ORDER_VALUE) String orderBy,
                                        @PathVariable("academyId") Long academyId) {
        Academy existingAcademy = academyService.getAcademyById(academyId);
        return userService.findAllActiveAcademyStudents(existingAcademy.getId(), page, size, orderBy);
    }

    @GetMapping("/{academyId}/students/count")
    public ResponseEntity<Map<String, Long>> getActiveAcademyStudentsCount(@PathVariable("academyId") Long academyId) {
        return ResponseEntity.ok(academyMembershipService.getAllActiveAcademyStudentsCount(academyId));
    }
}
