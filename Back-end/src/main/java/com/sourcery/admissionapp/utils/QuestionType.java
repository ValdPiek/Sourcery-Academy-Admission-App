package com.sourcery.admissionapp.utils;

public enum QuestionType {
    SINGLE(1),
    MULTI(2),
    OPEN(3);

    private final Integer status;

    QuestionType(Integer status) {
        this.status = status;
    }

    public Integer getStatus() {
        return status;
    }

}
