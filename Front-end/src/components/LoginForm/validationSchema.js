import * as Yup from 'yup';

export const validationSchema = Yup.object({
    email: Yup.string().required('Email required').email('Invalid email address'),
    password: Yup.string().required('Password required').min(8, 'Entered password too short'),
});
