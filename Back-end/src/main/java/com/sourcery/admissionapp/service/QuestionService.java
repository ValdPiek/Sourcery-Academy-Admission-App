package com.sourcery.admissionapp.service;

import com.sourcery.admissionapp.model.Form;
import com.sourcery.admissionapp.model.Question;
import com.sourcery.admissionapp.model.QuestionAssignment;
import com.sourcery.admissionapp.model.User;
import com.sourcery.admissionapp.repository.QuestionAssignmentRepository;
import com.sourcery.admissionapp.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final QuestionAssignmentRepository questionAssignmentRepository;
    private final UserService userService;
    private final FormService formService;

    public Question saveQuestion(String userEmail, Question newQuestion, Long formId, Integer numberInOrder) {
        User user = userService.getUserByEmail(userEmail);
        newQuestion.setCreatorId(user.getId());
        newQuestion.setUpdaterId(user.getId());

        Question savedQuestion = questionRepository.save(newQuestion);

        if(formId != null && numberInOrder != null){
            assignQuestionToForm(user.getId(), formId, savedQuestion, numberInOrder);
        }
        return savedQuestion;
    }

    public void assignQuestionToForm(Long userId, Long formId, Question savedQuestion, Integer numberInOrder) {
        Form form = formService.getFormById(formId);
        QuestionAssignment questionAssignment = new QuestionAssignment();

        questionAssignment.setForm(form);
        questionAssignment.setQuestion(savedQuestion);
        questionAssignment.setNumberInOrder(numberInOrder);
        questionAssignment.setCreatorId(userId);
        questionAssignment.setCreatedDate(LocalDateTime.now());
        questionAssignment.setUpdaterId(userId);
        questionAssignment.setUpdatedDate(LocalDateTime.now());

        questionAssignmentRepository.save(questionAssignment);
    }

    public List<Question> getQuestions(Long formId) {
        if(formId != null) {
            return questionRepository.findAllByFormId(formId);
        }
        return questionRepository.findAll();
    }

    public Page<Question> getQuestionsPage(Long formId, Integer pageNumber, Integer pageSize, String orderBy) {
        log.info("Retrieving questions for form: {}", formId);

        if(formId != null) {
            return questionRepository.findAllByFormIdAsPage(formId,
                    PageRequest.of(pageNumber, pageSize, Sort.by(orderBy).ascending()));
        }
        return questionRepository.findAllAsPage(PageRequest.of(pageNumber, pageSize, Sort.by(orderBy).ascending()));
    }

    public Question getQuestionById(Long questionId) {
        log.info("Getting question by id: {}", questionId);

        return questionRepository.findQuestionById(questionId).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND,
                        String.format("Question with id - %d, does not exist", questionId)));
    }

    public void updateQuestion(Long questionId, String userEmail, Question updatedQuestion){
        User user = userService.getUserByEmail(userEmail);
        Question oldQuestion = getQuestionById(questionId);

        updatedQuestion.setId(questionId);
        updatedQuestion.setCreatedDate(oldQuestion.getCreatedDate());
        updatedQuestion.setCreatorId(oldQuestion.getCreatorId());
        updatedQuestion.setUpdaterId(user.getId());

        questionRepository.save(updatedQuestion);
    }

    public void deleteQuestion(Long questionId) {
        Question question = getQuestionById(questionId);

        /*TODO: Add check if question has answers
        if(checkIfQuestionIsSuitableForDeletion(question) ) {
            questionRepository.delete(question);
        } else throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Question cannot be deleted");
        */

        questionRepository.delete(question);
    }

    public long getQuestionsCount() {
        return questionRepository.count();
    }

}
