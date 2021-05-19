import React from 'react';
import TextField from '@material-ui/core/TextField';
import { Field, ErrorMessage } from 'formik';
import './FormikInputField.scss';
import PropTypes from 'prop-types';

FormikInputField.propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    type: PropTypes.string,
    required: PropTypes.bool,
    errors: PropTypes.object.isRequired,
    touched: PropTypes.object.isRequired,
    variant: PropTypes.string,
    multiline: PropTypes.bool,
    rowsMax: PropTypes.number,
    disabled: PropTypes.bool,
};

function FormikInputField({
    name,
    label,
    type = 'text',
    required = false,
    errors,
    touched,
    variant = 'standard',
    multiline = false,
    rowsMax = 1,
    disabled = false,
}) {
    return (
        <div className="formik-field">
            <Field
                as={TextField}
                label={label}
                fullWidth
                name={name}
                helperText={<ErrorMessage name={name} />}
                type={type}
                required={required}
                variant={variant}
                error={errors[name] && touched[name] ? true : false}
                multiline={multiline}
                rowsMax={rowsMax}
                disabled={disabled}
            />
        </div>
    );
}

export default FormikInputField;
