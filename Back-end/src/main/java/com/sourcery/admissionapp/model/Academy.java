package com.sourcery.admissionapp.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "academy", schema = "public")
public class Academy {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull()
    @Column(name = "status")
    private Integer status;

    @NotBlank(message = "Enter the name of the academy")
    @Size(min = 5, message = "Academy name must have at least 5 symbols")
    @Column(name = "name")
    private String academyName;

    @Column(name = "description")
    private String description;

    @NotBlank(message = "Enter the names of the cities where the academy will be held")
    @Column(name = "city")
    private String city;

    @Email(message = "Email should be valid")
    private String email;

    @Column(name = "telephone")
    @Size(max = 15, message = "Phone number maximum length 15 numbers")
    private String telephone;

    @Column(name = "time_start")
    private LocalDateTime timeStart;

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

    @JsonManagedReference(value="academy-membership-academy")
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "academy")
    private List<AcademyMembership> academyMemberships  = new ArrayList<>();

}