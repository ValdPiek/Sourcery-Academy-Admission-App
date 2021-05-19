package com.sourcery.admissionapp.repository;

import com.sourcery.admissionapp.model.Question;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    Optional<Question> findQuestionById(Long questionId);

    @Query(value = "select q from Question q, QuestionAssignment qa " +
            "where q.id=qa.id.questionId and qa.id.formId=:formId")
    List<Question> findAllByFormId(@Param("formId") Long formId);

    @Query(value = "select q from Question q, QuestionAssignment qa " +
            "where q.id=qa.id.questionId and qa.id.formId=:formId")
    Page<Question> findAllByFormIdAsPage(@Param("formId") Long formId, Pageable pageable);

    @Query(value = "select q from Question q")
    Page<Question> findAllAsPage(Pageable pageable);

}