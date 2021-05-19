package com.sourcery.admissionapp.repository;

import com.sourcery.admissionapp.model.User;
import com.sourcery.admissionapp.model.enitityview.UserView;
import com.sourcery.admissionapp.security.UserRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findUserByEmail(String email);
    Optional<User> findUserById(Long id);

    @Query(value = "select u from User u, AcademyMembership am " +
            "where u.id=am.id.userId and am.id.academyId=:id and am.isSuspended=false ")
    Page<UserView> getActiveAcademyUsers(@Param("id") Long id, Pageable pageable);

    Long countUserByRoleIs(UserRole role);
}
