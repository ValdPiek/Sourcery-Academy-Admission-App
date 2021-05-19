package com.sourcery.admissionapp.controllers;

import com.sourcery.admissionapp.service.AcademyService;
import com.sourcery.admissionapp.service.FormService;
import com.sourcery.admissionapp.service.QuestionService;
import com.sourcery.admissionapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/stats")
public class StatisticsRestController {

    private final AcademyService academyService;
    private final UserService userService;
    private final FormService formService;
    private final QuestionService questionService;

    @GetMapping("/counter")
    public ResponseEntity<Map<String, Long>> getAllStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("academies", academyService.getAcademiesCount());
        stats.put("students", userService.getStudentsCount());
        stats.put("forms", formService.getFormsCount());
        stats.put("questions", questionService.getQuestionsCount());
        return ResponseEntity.ok(stats);
    }
}
