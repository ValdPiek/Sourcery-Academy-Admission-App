package com.sourcery.admissionapp.controllers;

import com.sourcery.admissionapp.model.Question;
import com.sourcery.admissionapp.security.AuthorizationRole;
import com.sourcery.admissionapp.service.QuestionService;
import com.sourcery.admissionapp.utils.DefaultPagination;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;

@RestController
@RequiredArgsConstructor
@RequestMapping("/questions")
public class QuestionRestController {

    private final QuestionService questionService;

    @PreAuthorize(AuthorizationRole.ADMIN_ROLE)
    @PostMapping("")
    public ResponseEntity<Question> createQuestion(@CurrentSecurityContext(expression = "authentication.name") String userEmail,
                                                   @Valid @RequestBody Question question,
                                                   @RequestParam(required = false) Long formId,
                                                   @RequestParam(required = false) Integer numberInOrder) {
        Question newQuestion = questionService.saveQuestion(userEmail, question, formId, numberInOrder);
        return new ResponseEntity<>(newQuestion, HttpStatus.CREATED);
    }

    @PreAuthorize(AuthorizationRole.ADMIN_ROLE)
    @GetMapping("")
    public Page<Question> getAllQuestions(
                                @RequestParam(defaultValue = DefaultPagination.DEFAULT_PAGE) Integer page,
                                @RequestParam(defaultValue = DefaultPagination.DEFAULT_PAGE_SIZE) Integer size,
                                @RequestParam(required = false, defaultValue = DefaultPagination.DEFAULT_ORDER_VALUE) String orderBy,
                                @RequestParam(required = false) Long formId) {
        return questionService.getQuestionsPage(formId, page, size, orderBy);
    }

    @PreAuthorize(AuthorizationRole.ADMIN_ROLE)
    @GetMapping("/{id}")
    public ResponseEntity<Question> getQuestionById(@PathVariable("id") Long questionId) {
        return ResponseEntity.ok(questionService.getQuestionById(questionId));
    }

    @PreAuthorize(AuthorizationRole.ADMIN_ROLE)
    @PutMapping("/{id}")
    public ResponseEntity<String> updateQuestionById(@PathVariable("id") Long questionId,
                                                     @CurrentSecurityContext(expression = "authentication.name") String userEmail,
                                                     @Valid @RequestBody Question question) {
        questionService.updateQuestion(questionId, userEmail, question);
        return new ResponseEntity<>("Question successfully updated", HttpStatus.OK);
    }

    @PreAuthorize(AuthorizationRole.ADMIN_ROLE)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteQuestionById(@PathVariable("id") Long questionId) {
        questionService.deleteQuestion(questionId);
        return new ResponseEntity<>("Question successfully deleted", HttpStatus.OK);
    }

}
