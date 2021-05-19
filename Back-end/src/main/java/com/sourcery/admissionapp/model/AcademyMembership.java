package com.sourcery.admissionapp.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "academy_has_user", schema = "public")
public class AcademyMembership {

    @EmbeddedId
    private AcademyMembershipIdentity id  = new AcademyMembershipIdentity();

    @JsonBackReference(value = "academy-membership-academy")
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("academyId")
    private Academy academy;

    @JsonBackReference(value = "academy-membership-user")
    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("userId")
    private User user;

    @NotNull
    @Column(name = "is_suspended")
    private Boolean isSuspended;

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
