package com.sourcery.admissionapp.service;

import com.sourcery.admissionapp.model.Academy;
import com.sourcery.admissionapp.model.User;
import com.sourcery.admissionapp.model.enitityview.AcademyView;
import com.sourcery.admissionapp.repository.AcademyRepository;
import com.sourcery.admissionapp.utils.AcademyStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AcademyService {

    private final AcademyRepository academyRepository;
    private final UserService userService;

    public Academy saveAcademy(String userEmail, Academy academy) {
        setNewAcademyReferences(userEmail, academy);
        academyRepository.save(academy);
        return academy;
    }

    public void setNewAcademyReferences(String userEmail, Academy academy) {
        User user = userService.getUserByEmail(userEmail);
        academy.setCreatorId(user.getId());
        academy.setUpdaterId(user.getId());
    }

    public List<AcademyView> getAcademies() { return academyRepository.findAllAcademies(); }

    public Academy getAcademyById(Long academyId) {
        log.info("Getting academy by id: {}", academyId);
        return academyRepository.findById(academyId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND,
                        String.format("Academy with id - %d, does not exist", academyId)));
    }

    public AcademyView getAcademyViewById(Long academyId) {
        log.info("Getting academy by id: {}", academyId);
        return academyRepository.findAcademyViewById(academyId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND,
                        String.format("Academy with id - %d, does not exist", academyId)));
    }

    public List<AcademyView> getAllAcademiesForStudents() {
        return academyRepository
                .findAllAcademies()
                .stream()
                .filter(academy -> (academy.getStatus()
                        .equals(AcademyStatus.PUBLISHED.getStatus())) ||
                        (academy.getStatus().equals(AcademyStatus.ACTIVE.getStatus())))
                .collect(Collectors.toList());
    }

    public void updateAcademy(Long academyId, String userEmail, Academy updatedAcademy){
        Academy oldAcademy = getAcademyById(academyId);
        updatedAcademy.setId(academyId);
        updatedAcademy.setCreatedDate(oldAcademy.getCreatedDate());
        updatedAcademy.setCreatorId(oldAcademy.getCreatorId());
        setAcademyReferences(userEmail, updatedAcademy);
        academyRepository.save(updatedAcademy);
    }

    public void setAcademyReferences(String userEmail, Academy academy) {
        User user = userService.getUserByEmail(userEmail);
        academy.setUpdaterId(user.getId());
    }

    public void deleteAcademy(Long academyId) {
        Academy academy = getAcademyById(academyId);

        if(checkIfAcademyIsSuitableForDeletion(academy) ) {
            academyRepository.delete(academy);
        } else throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Academy cannot be deleted");
    }

    public boolean checkIfAcademyIsSuitableForDeletion(Academy academy) {
        return academy.getStatus().equals(AcademyStatus.DRAFT.getStatus()) ||
                academy.getStatus().equals(AcademyStatus.CANCELLED.getStatus()) &&
                        academy.getAcademyMemberships().isEmpty();
    }

    public AcademyView getAcademyViewForStudentsById(Long academyId) {
        log.info("Getting academy for students by id: {}", academyId);
        return academyRepository.findAcademyViewById(academyId)
                .filter(academyFound -> academyFound.getStatus().equals(AcademyStatus.PUBLISHED.getStatus()) ||
                        (academyFound.getStatus().equals(AcademyStatus.ACTIVE.getStatus())))
                .orElseThrow(()->
                        new ResponseStatusException(HttpStatus.NOT_FOUND,
                                String.format("Academy with id - %d, does not exist", academyId)
                ));
    }

    public long getAcademiesCount() {
        return academyRepository.count();
    }

}




