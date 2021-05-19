package com.sourcery.admissionapp.model.enitityview;

import java.time.LocalDateTime;

public interface AcademyView {

    Long getId();
    Integer getStatus();
    String getAcademyName();
    String getDescription();
    String getCity();
    String getEmail();
    String getTelephone();
    LocalDateTime getTimeStart();
    LocalDateTime getTimeFinish();

}
