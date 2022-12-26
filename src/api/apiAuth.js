import axios from 'axios';
// import { API } from '../utils/config';
// const API = process.env.API;

const API = 'https://mbstu-panel-server.onrender.com/api/v1';
const apiAuth = () => {
    const register = (user) => {
        // console.log('API = ', API)
        // console.log('API = ', user)
        return axios.post(`${API}/user/signup`, user, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    };

    const login = (user) => {
        return axios.post(`${API}/user/login`, user, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
    };

    return {
        register,
        login
    }

}
export default apiAuth;