import * as Yup from 'yup';

/*A regular expression to match phone numbers, allowing for an international dialing code 
at the start and hyphenation and spaces that are sometimes entered.*/
const phoneRegExp = /^(\(?\+?[0-9]*\)?)?[0-9_\- ()]*$/;

//regular expresion so that all chars in string are digits
const yearRegExp = /^\d+$/;

//validation schema for various validation errors
export const validationSchema = Yup.object({
    firstName: Yup.string().required('Name is required.').min(3, 'Must be 3 characters or longer'),
    lastName: Yup.string().required('Surname is required.').min(3, 'Must be 3 characters or longer'),
    telephone: Yup.string()
        .matches(phoneRegExp, 'Phone number is not valid')
        .min(8, 'Phone number should be at least 8 chars long.')
        .max(15, 'Phone number should be at most 15 chars long.'),
    email: Yup.string().email('Invalid email format.').required('Email is required.'),
    gender: Yup.string().required('Please select your gender!'),
    education: Yup.string().required('Please enter your education!'),
    yearOfBirth: Yup.string()
        .required('Please enter your year of birth!')
        .min(4, 'Year should be 4 characters long')
        .max(4, 'Year should be 4 characters long')
        .matches(yearRegExp, 'Year should be a number')
        .test('checkRange', 'Year of birth must be between 1910 and 2020', function (value) {
            let convertedInt = parseInt(value);
            if (convertedInt >= 1910 && convertedInt <= 2020) return true;
            else return false;
        }),
    password: Yup.string().required('Password is required.').min(8, 'Must be 8 characters or longer'),
    password2: Yup.string()
        .required('Password is required.')
        .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});
