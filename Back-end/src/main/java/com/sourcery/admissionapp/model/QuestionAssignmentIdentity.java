package com.sourcery.admissionapp.model;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;

@Data
@Embeddable
public class QuestionAssignmentIdentity implements Serializable {

    @Column(name = "form_id")
    private Long formId;

    @Column(name = "question_id")
    private Long questionId;

}
