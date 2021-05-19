package com.sourcery.admissionapp.repository;

import com.sourcery.admissionapp.model.Academy;
import com.sourcery.admissionapp.model.enitityview.AcademyView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AcademyRepository extends JpaRepository<Academy, Long> {

    @Query("SELECT a FROM Academy a")
    List<AcademyView> findAllAcademies();

    @Query("SELECT a FROM Academy a WHERE a.id = :academyId")
    Optional<AcademyView> findAcademyViewById(@Param("academyId") Long academyId);

}
