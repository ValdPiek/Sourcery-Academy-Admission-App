package com.sourcery.admissionapp.model;

import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;

@Data
@Embeddable
public class AcademyMembershipIdentity implements Serializable {

    @Column(name = "academy_id")
    private Long academyId;

    @Column(name = "user_id")
    private Long userId;

}