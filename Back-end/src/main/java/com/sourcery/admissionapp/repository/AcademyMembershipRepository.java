package com.sourcery.admissionapp.repository;

import com.sourcery.admissionapp.model.AcademyMembership;
import com.sourcery.admissionapp.model.AcademyMembershipIdentity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AcademyMembershipRepository extends JpaRepository<AcademyMembership, AcademyMembershipIdentity> {

    Optional<AcademyMembership> findAcademyMembershipByIdAcademyIdAndUserId(Long academyId, Long userId);

    @Query(value = "select COUNT(u) from User u, AcademyMembership am " +
            "where u.id=am.id.userId and am.id.academyId=:id and am.isSuspended=false ")
    Long getActiveAcademyStudentsCount(@Param("id") Long id);
}
