package com.sourcery.admissionapp.model.customview;

import com.sourcery.admissionapp.model.Form;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class FormView {

    @NotNull
    public Form form;

    @NotNull
    public Boolean isEditable;

}
