package com.sourcery.admissionapp.service;

import com.sourcery.admissionapp.model.Academy;
import com.sourcery.admissionapp.model.Form;
import com.sourcery.admissionapp.model.User;
import com.sourcery.admissionapp.model.customview.FormView;
import com.sourcery.admissionapp.repository.FormRepository;
import com.sourcery.admissionapp.utils.FormStatus;
import com.sourcery.admissionapp.utils.TimeRestriction;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class FormService {

    private final FormRepository formRepository;
    private final UserService userService;
    private final AcademyService academyService;
    private final AcademyMembershipService academyMembershipService;

    public Form saveForm(Long academyId, String userEmail, Form form) {
        Academy academy = academyService.getAcademyById(academyId);
        User user = userService.getUserByEmail(userEmail);

        form.setAcademy(academy);
        form.setCreatorId(user.getId());
        form.setUpdaterId(user.getId());

        return formRepository.save(form);
    }

    public List<Form> getForms() { return formRepository.findAll(); }

    public List<Form> getFormsByAcademyId(Long academyId) {
        log.info("Retrieving forms by academy {}", academyId);
        return formRepository.findFormsByAcademyId(academyId);
    }

    public List<Form> getFormsByAcademyIdForStudents(Long academyId, User user) {
        if(academyMembershipService.checkStudentStatusInAcademy(academyId, user.getId())) {
            return formRepository
                    .findFormsByAcademyId(academyId)
                    .stream()
                    .filter(form -> (form.getStatus().equals(FormStatus.ACTIVE.getStatus())))
                    .collect(Collectors.toList());
        } else throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User is not a member at the academy the form belongs to");
    }

    public FormView getFormViewById(Long formId, Boolean isStudent, Long academyId) {
        log.info("Getting form view by id: {}", formId);

        Form form = getFormById(formId);
        FormView formView = new FormView();

        formView.setForm(form);
        formView.setIsEditable(checkIfFormIsEditable(form));

        if(!form.getAcademy().getId().equals(academyId)){
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Form does not belong to the provided academy");
        }

        if(isStudent && !formView.getForm().getStatus().equals(FormStatus.ACTIVE.getStatus())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Student cannot access the form");
        }

        return formView;
    }

    public FormView getFormViewByIdForStudents(Long formId, User user, Long academyId) {
        if(academyMembershipService.checkStudentStatusInAcademy(getFormById(formId).getAcademy().getId(), user.getId())) {
            return getFormViewById(formId, userService.isUserStudent(user), academyId);
        } else throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User is not a member at the academy the form belongs to");
    }


    public Form getFormById(Long formId) {
        log.info("Getting form by id: {}", formId);
        return formRepository.findById(formId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND,
                        String.format("Form with id - %d, does not exist", formId)));
    }

    public boolean checkIfFormIsEditable(Form form) {
        long durationUntilFormStart = ChronoUnit.HOURS.between(LocalDateTime.now(), form.getTimeStart());
        return (durationUntilFormStart > TimeRestriction.TIME_PERIOD_ALLOWED &&
                (form.getStatus().equals(FormStatus.DRAFT.getStatus()) || form.getStatus().equals(FormStatus.PUBLISHED.getStatus())));
    }

    public void updateForm(Long formId, String userEmail, Form updatedForm){
        Form oldForm = getFormById(formId);
        User user = userService.getUserByEmail(userEmail);

        if(checkIfFormIsEditable(oldForm) || !oldForm.getStatus().equals(updatedForm.getStatus())){
            updatedForm.setId(formId);
            updatedForm.setAcademy(oldForm.getAcademy());
            updatedForm.setCreatedDate(oldForm.getCreatedDate());
            updatedForm.setCreatorId(oldForm.getCreatorId());
            updatedForm.setUpdaterId(user.getId());
            formRepository.save(updatedForm);
        } else throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Form cannot be edited. Status is Finished or there is less then 48 hours left until form start");

    }

    public void deleteForm(Long formId) {
        log.info("Deleting form with id {}", formId);
        Form form = getFormById(formId);

        if(form.getStatus().equals(FormStatus.DRAFT.getStatus())) {
            formRepository.delete(form);
        } else throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Form cannot be deleted");
    }

    public long getFormsCount() {
        return formRepository.count();
    }

}
