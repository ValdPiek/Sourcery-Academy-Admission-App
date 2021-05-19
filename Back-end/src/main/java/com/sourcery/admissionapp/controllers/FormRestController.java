package com.sourcery.admissionapp.controllers;

import com.sourcery.admissionapp.model.Form;
import com.sourcery.admissionapp.model.User;
import com.sourcery.admissionapp.model.customview.FormView;
import com.sourcery.admissionapp.security.AuthorizationRole;
import com.sourcery.admissionapp.security.UserRole;
import com.sourcery.admissionapp.service.FormService;
import com.sourcery.admissionapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/forms")
public class FormRestController {

    private final FormService formService;
    private final UserService userService;

    @PreAuthorize(AuthorizationRole.ADMIN_ROLE)
    @PostMapping("")
    public ResponseEntity<Form> createForm(@RequestParam Long academyId,
                                           @CurrentSecurityContext(expression = "authentication.name") String userEmail,
                                           @Valid @RequestBody Form form) {
        Form newForm = formService.saveForm(academyId, userEmail, form);
        return new ResponseEntity<>(newForm, HttpStatus.CREATED);
    } 

    @GetMapping("")
    public ResponseEntity<List<Form>> getAllFormsByAcademyIdAndUserRole(@RequestParam(required = false) Long academyId,
                                                                        @CurrentSecurityContext(expression = "authentication.name") String userEmail) {
        User user = userService.getUserByEmail(userEmail);

        if (user.getRole().equals(UserRole.ADMIN)) {
            if(academyId != null){
                return ResponseEntity.ok(formService.getFormsByAcademyId(academyId));
            }
            return ResponseEntity.ok(formService.getForms());
        }

        if (user.getRole().equals(UserRole.STUDENT) && academyId != null) {
            return ResponseEntity.ok(formService.getFormsByAcademyIdForStudents(academyId, user));
        }

        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Academy id must be provided");
    }

    @GetMapping("/{id}")
    public ResponseEntity<FormView> viewFormById(@PathVariable("id") Long formId,
                                                 @CurrentSecurityContext(expression = "authentication.name") String userEmail,
                                                 @RequestParam(required = false) Long academyId) {
        User user = userService.getUserByEmail(userEmail);

        if (user.getRole().equals(UserRole.ADMIN)) {
            return ResponseEntity.ok(formService.getFormViewById(formId, userService.isUserStudent(user), academyId));
        }

        return ResponseEntity.ok(formService.getFormViewByIdForStudents(formId, user, academyId));
    }

    @PreAuthorize(AuthorizationRole.ADMIN_ROLE)
    @PutMapping("/{id}")
    public ResponseEntity<String> updateFormById(@PathVariable("id") Long formId,
                                                 @CurrentSecurityContext(expression = "authentication.name") String userEmail,
                                                 @Valid @RequestBody Form form) {
        formService.updateForm(formId, userEmail, form);
        return new ResponseEntity<>("Form successfully updated", HttpStatus.OK);
    }

    @PreAuthorize(AuthorizationRole.ADMIN_ROLE)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFormById(@PathVariable("id") Long formId) {
        formService.deleteForm(formId);
        return new ResponseEntity<>("Form successfully deleted", HttpStatus.OK);
    }

}
