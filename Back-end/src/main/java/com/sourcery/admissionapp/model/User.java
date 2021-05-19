package com.sourcery.admissionapp.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.sourcery.admissionapp.security.UserRole;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.hibernate.validator.constraints.Range;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name = "user", schema = "public")
public class User {

    private static final PasswordEncoder pwEncoder = new BCryptPasswordEncoder();

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Enter Your First Name")
    @Size(min = 3, message = "First name length at least 3 symbols")
    @Column(name = "first_name")
    private String firstName;

    @NotBlank(message = "Enter Your Last Name")
    @Size(min = 3, message = "Last name length at least 3 symbols")
    @Column(name = "last_name")
    private String lastName;

    @NotNull
    @Column(length = 1, columnDefinition = "CHAR")
    private Character gender;

    @NotNull(message = "Select Your Birth Year")
    @Column(name = "year_of_birth")
    @Range(min = 1920, max = 2020, message = "Select year of birth between 1910 and 2020")
    private Integer yearOfBirth;

    @NotBlank(message = "Enter Education Information")
    private String education;

    @Column(name = "telephone")
    @Size(max = 15, message = "Phone number maximum length 15 numbers")
    private String telephone;

    @NotBlank(message = "Enter Your Email")
    @Column(unique = true)
    @Email(message = "Email should be valid")
    private String email;

    @NotBlank(message = "Enter Your Password")
    @Size(min = 8, max = 60, message = "Password length at least 8 symbols")
    private String password;

    @Column(name = "active")
    private Boolean isActive;

    @Column(name = "is_not_suspended")
    private Boolean isNotSuspended;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    @Column(name = "created")
    @CreationTimestamp
    public LocalDateTime createdDate;

    @Column(name = "created_by")
    private Long creatorId;

    @Column(name = "updated")
    @UpdateTimestamp
    private LocalDateTime updateDate;

    @Column(name = "updated_by")
    private Long updaterId;

    @PrePersist
    private void setOnCreate() {
        this.role = UserRole.STUDENT;
        this.isActive = true;
        this.isNotSuspended = true;
        this.password = pwEncoder.encode(password);
    }

    @JsonManagedReference(value="academy-membership-user")
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "user")
    private List<AcademyMembership> academyMemberships = new ArrayList<>();

}