package com.sourcery.admissionapp.utils;

public enum FormStatus {
    DRAFT(1),
    PUBLISHED(2),
    ACTIVE(3),
    FINISHED(4);

    private final Integer status;

    FormStatus(Integer status) {
        this.status = status;
    }

    public Integer getStatus() { return status; }
}
