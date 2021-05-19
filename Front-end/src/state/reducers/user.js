let initialState = JSON.parse(sessionStorage.getItem('user'));

if (initialState == null) {
    initialState = {
        credentials: '',
        id: '',
        role: '',
        firstName: '',
    };
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'STORE_USER_INFO': {
            sessionStorage.setItem('user', JSON.stringify(action.payload));
            return { ...action.payload };
        }
        case 'REMOVE_USER_INFO': {
            sessionStorage.removeItem('user');
            return { credentials: '', id: '', role: '', firstName: '' };
        }
        default:
            return state;
    }
};

export default userReducer;
