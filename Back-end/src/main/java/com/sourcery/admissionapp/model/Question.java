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
@Table(name = "question", schema = "public")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull()
    @Column(name = "type")
    private Integer type;

    @NotBlank(message = "Enter the question")
    @Size(min = 5, message = "Question must have at least 5 symbols")
    @Column(name = "value")
    private String value;

    @NotBlank(message = "Enter category of the question")
    @Column(name = "category")
    private String category;

    @Column(name = "picture")
    private String pictureUrl;

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
