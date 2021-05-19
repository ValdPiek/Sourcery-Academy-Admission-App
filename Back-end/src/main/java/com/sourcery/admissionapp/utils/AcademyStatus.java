package com.sourcery.admissionapp.utils;

public enum AcademyStatus {
    DRAFT(1),
    PUBLISHED(2),
    ACTIVE(3),
    FINISHED(4),
    CANCELLED(5);

    private final Integer status;

    AcademyStatus(Integer status) {
        this.status = status;
    }

    public Integer getStatus() {
        return status;
    }
}