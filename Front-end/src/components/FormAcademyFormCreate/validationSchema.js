import * as Yup from 'yup';

//validation schema for various validation errors
export const validationSchema = Yup.object({
    formName: Yup.string().required('Form title is required.').min(5, 'Must be 5 characters or longer'),
    status: Yup.string().required('Please select initial form status'),
    timeStart: Yup.date()
        .when('status', {
            is: (status) => status !== '4' && status !== '3',
            then: Yup.date().test('checkStartDate', 'Start date must be at least 48 hours from now', function (value) {
                let acceptableDate = new Date();
                acceptableDate.setDate(acceptableDate.getDate() + 2);
                if (new Date(value) < acceptableDate) return false;
                else return true;
            }),
        })
        .when('status', {
            is: (status) => status === '3',
            then: Yup.date().test(
                'checkIfNowIsLaterThanStartDate',
                "If you want to change form's status to Active, current time has to be later than Start Time",
                function (value) {
                    let acceptableDate = new Date();
                    if (new Date(value) > acceptableDate) return false;
                    else return true;
                }
            ),
        }),
    timeFinish: Yup.date().min(Yup.ref('timeStart'), 'Finish date should be later than start date'),
});
