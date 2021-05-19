import React, { useEffect, useState } from 'react';
import { Field, ErrorMessage } from 'formik';
import './FormikSelectField.scss';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';

const MaterialUISelectField = ({
    errorString,
    label,
    children,
    value = '',
    name,
    onChange,
    onBlur,
    required,
    error,
    multiple,
    setFieldValue,
    disabled,
}) => {
    let stringOrArray = value;
    if (multiple && value === '') {
        stringOrArray = [];
    }

    //variable for multiSelect
    const [variable, setVariable] = useState(stringOrArray);

    //when variable updates, we set formik field value
    useEffect(() => {
        setFieldValue(name, variable);
    }, [variable, name, setFieldValue]);

    const handleChange = (event) => {
        setVariable(event.target.value);
    };

    return (
        <FormControl fullWidth error={error}>
            <InputLabel required={required}>{label}</InputLabel>
            <Select
                name={name}
                onChange={handleChange}
                onBlur={onBlur}
                value={variable}
                multiple={multiple}
                disabled={disabled}
            >
                {children}
            </Select>
            <FormHelperText>{errorString}</FormHelperText>
        </FormControl>
    );
};

MaterialUISelectField.propTypes = {
    errorString: PropTypes.object.isRequired,
    label: PropTypes.string.isRequired,
    children: PropTypes.array.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func.isRequired,
    required: PropTypes.bool,
    error: PropTypes.bool,
    multiple: PropTypes.bool,
    setFieldValue: PropTypes.func,
    disabled: PropTypes.bool,
};

const FormikSelectField = ({
    label,
    items,
    name,
    required = false,
    errors,
    touched,
    multiple = false,
    setFieldValue,
    value,
    disabled = false,
}) => {
    return (
        <div className="formik-select">
            <Field
                name={name}
                as={MaterialUISelectField}
                label={label}
                errorString={<ErrorMessage name={name} />}
                required={required}
                error={errors[name] && touched[name] ? true : false}
                multiple={multiple}
                setFieldValue={setFieldValue}
                disabled={disabled}
            >
                {items.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                        {item.label}
                    </MenuItem>
                ))}
            </Field>
        </div>
    );
};

FormikSelectField.propTypes = {
    label: PropTypes.string.isRequired,
    items: PropTypes.array,
    name: PropTypes.string.isRequired,
    required: PropTypes.bool,
    errors: PropTypes.object.isRequired,
    touched: PropTypes.object.isRequired,
    multiple: PropTypes.bool,
    setFieldValue: PropTypes.func,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    disabled: PropTypes.bool,
};

export default FormikSelectField;
