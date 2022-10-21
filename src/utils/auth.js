import jwt_decode from 'jwt-decode';

// set token in local storage
export const authenticate = (token, cb) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('jwt', JSON.stringify(token));
        cb();
    }
}

// check if token in local storage is valid
export const isAuthenticated = () => {
    if (typeof window === 'undefined') return false;
    if (localStorage.getItem('jwt')) {
        const { exp } = jwt_decode(JSON.parse(localStorage.getItem('jwt')));
        if ((new Date()).getTime() <= exp * 1000) {
            return true
        } else {
            localStorage.removeItem('jwt');
            return false;
        }
    } else return false;
}

//get user info from token
export const userInfo = () => {
    const jwt = JSON.parse(localStorage.getItem('jwt'));
    if (jwt === null) {
        return null;
    }
    console.log('jwt ==== ', jwt)
    const decoded = jwt_decode(jwt);
    return { ...decoded, token: jwt }
}

//signOut and remove token from local storage
export const signOut = (cb) => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('jwt');
        cb();
    }
}