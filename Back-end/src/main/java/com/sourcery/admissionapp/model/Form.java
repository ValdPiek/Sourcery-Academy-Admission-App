package com.sourcery.admissionapp.model;

import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "form", schema = "public")
public class Form {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull()
    @Column(name = "status")
    private Integer status;

    @NotBlank(message = "Enter the name of the form")
    @Size(min = 5, message = "Form name must have at least 5 symbols")
    @Column(name = "name")
    private String formName;

    @ManyToOne()
    @JoinColumn(name = "academy_id")
    private Academy academy;

    @Column(name = "description")
    private String description;

    @NotNull
    @Column(name = "time_start")
    private LocalDateTime timeStart;

    @NotNull
    @Column(name = "time_finish")
    private LocalDateTime timeFinish;

    @Column(name = "created")
    @CreationTimestamp
    private LocalDateTime createdDate;

    @Column(name = "created_by")
    private Long creatorId;

    @Column(name = "updated")
    @UpdateTimestamp
    private LocalDateTime updatedDate;

    @Column(name = "updated_by")
    private Long updaterId;

}
