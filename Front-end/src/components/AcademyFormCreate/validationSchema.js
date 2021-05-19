import * as Yup from 'yup';

const phoneRegExp = /^(\(?\+?[0-9]*\)?)?[0-9_\- ()]*$/;

//validation schema for various validation errors
export const validationSchema = Yup.object({
    academyName: Yup.string().required('Name is required.').min(5, 'Must be 5 characters or longer'),
    city: Yup.string().required('Please enter city(-ies) where academy is going to be held.'),
    status: Yup.string().required('Please select initial academy status'),
    email: Yup.string().email('Invalid email format.'),
    telephone: Yup.string()
        .matches(phoneRegExp, 'Phone number is not valid')
        .min(8, 'Phone should be at least 8 chars long.')
        .max(15, 'Phone should be at most 15 chars long.'),
    timeStart: Yup.date().when('status', {
        is: (status) => status !== '4',
        then: Yup.date().min(new Date().toString(), 'Start time can not be earlier than current time'),
    }),
    timeFinish: Yup.date().min(Yup.ref('timeStart'), 'Finish date should be later than start date'),
});
