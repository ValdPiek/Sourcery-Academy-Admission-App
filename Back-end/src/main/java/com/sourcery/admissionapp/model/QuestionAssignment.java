package com.sourcery.admissionapp.model;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "form_has_question", schema = "public")
public class QuestionAssignment {

    @EmbeddedId
    private QuestionAssignmentIdentity id = new QuestionAssignmentIdentity();

    @ManyToOne
    @MapsId("formId")
    private Form form;

    @ManyToOne
    @MapsId("questionId")
    private Question question;

    @NotNull()
    @Column(name = "number")
    private Integer numberInOrder;

    @Column(name = "created")
    private LocalDateTime createdDate;

    @NotNull
    @Column(name = "created_by")
    private Long creatorId;

    @Column(name = "updated")
    private LocalDateTime updatedDate;

    @NotNull
    @Column(name = "updated_by")
    private Long updaterId;

}
