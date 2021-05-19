package com.sourcery.admissionapp.repository;

import com.sourcery.admissionapp.model.QuestionAssignment;
import com.sourcery.admissionapp.model.QuestionAssignmentIdentity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionAssignmentRepository extends JpaRepository<QuestionAssignment, QuestionAssignmentIdentity> {
}
