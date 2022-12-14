import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useEffect, useState } from 'react';
// const API1 = process.env.API;
// const API = 'https://mbstu-panel-server.onrender.com/api/v1';
const API = 'https://mbstu-panel-server.onrender.com/api/v1';
const useMongoose = () => {
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    // const [isLoadingRole, setIsLoadingRole] = useState(true);
    const [isLoadingRegister, setIsLoadingRegister] = useState(true);
    // const [isLoadingLogin, setIsLoadingLogin] = useState(true);
    // const [authError, setAuthError] = useState('empty');
    const [admin, setAdmin] = useState(false);
    const [token, setToken] = useState('');
    const [student, setStudent] = useState(false);
    const [teacher, setTeacher] = useState(false);
    const [deptChairman, seDeptChairman] = useState(false);
    const [dept, setDept] = useState('');
    const [changeState, setChangeState] = useState(false);


    // set token in local storage
    const authenticate = (token, cb) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('jwt', JSON.stringify(token));

        }
        setChangeState(!changeState)
        cb();

    }

    // check if token in local storage is valid
    const isAuthenticated = () => {
        if (typeof window === 'undefined') return false;
        if (localStorage.getItem('jwt')) {

            const { exp } = jwt_decode(JSON.parse(localStorage.getItem('jwt')));
            if ((new Date()).getTime() <= exp * 1000) {
                return true
            } else {
                localStorage.removeItem('jwt');
                return false;
            }
        }
        else {
            return false;
        }
    }

    useEffect(() => {
        console.log('inside useEffect');
        const jwt = JSON.parse(localStorage.getItem('jwt'));
        // no jwt means no user logged in
        if (jwt === null) {
            setUser({});
            setIsLoading(false);
            return;
        }
        //decode jwt
        const decoded = jwt_decode(jwt);

        // if jwt session expires then remove that jwt
        if ((new Date()).getTime() >= decoded.exp * 1000) {
            setUser({});
            setIsLoading(false);
            localStorage.removeItem('jwt');
            return;
        }
        // valid jwt, so set the information to user
        // console.log('decodes ', decoded)
        setUser({ ...decoded });
        setIsLoading(false);
    }, [changeState])




    //get user info from token
    const userInfo = () => {
        const jwt = JSON.parse(localStorage.getItem('jwt'));

        if (jwt === null) {
            setUser({});
        }
        console.log('jwt ==== ', jwt)
        const decoded = jwt_decode(jwt);

        setUser(decoded);
    }


    //register a user
    const register = (user) => {
        // return axios.post(`${API}/user/signup`, user, {
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // })
        return fetch(`${API}/user/signup`, {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
    };

    // login a user
    const login = (user) => {
        // return axios.post(`${API}/user/login`, user, {
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // })
        return fetch(`${API}/user/login`, {
            method: 'post',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
    };

    //signOut and remove token from local storage
    const logOut = () => {
        console.log('logging out')
        if (typeof window !== 'undefined') {
            localStorage.removeItem('jwt');
            setUser({});
        }
    }



    return {
        user,
        admin,
        token,
        setToken,
        isLoading,
        register,
        login,
        isAuthenticated,
        authenticate,
        userInfo,
        logOut,
        setUser,
        setIsLoading,
        isLoadingRegister,
        setIsLoadingRegister,
        student,
        teacher,
        deptChairman,
        dept,

    }
}
export default useMongoose;