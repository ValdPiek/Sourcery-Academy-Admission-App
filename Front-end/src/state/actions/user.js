export const storeUserInfo = (user) => {
    return {
        type: 'STORE_USER_INFO',
        payload: user,
    };
};

export const removeUserInfo = () => {
    return {
        type: 'REMOVE_USER_INFO',
    };
};
