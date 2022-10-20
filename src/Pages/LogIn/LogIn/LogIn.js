import { useState } from 'react';
import { Redirect } from 'react-router-dom';
import apiAuth from '../../../api/apiAuth';
// import useM from '../../../api/apiAuth';
// import { login } from '../../../api/apiAuth';
import { authenticate, isAuthenticated, userInfo } from '../../../utils/auth';
// import Layout from './Layout';
// import Layout from '../Layout';
// import { showError, showLoading } from '../../utils/messages';
// import { login } from '../../api/apiAuth';
// import { authenticate, isAuthenticated, userInfo } from '../../utils/auth';

const Login = () => {
    const { login } = apiAuth();
    const [values, setValues] = useState({
        email: '',
        password: '',
        error: false,
        loading: false,
        disabled: false,
        redirect: false
    });

    const { email, password, loading, error, redirect, disabled } = values;


    const handleChange = e => {
        setValues({
            ...values,
            error: false,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = e => {
        e.preventDefault();
        setValues({ ...values, error: false, loading: true, disabled: true });

        login({ email, password })
            .then(response => {
                console.log(response.data.data.token)
                console.log(response)
                authenticate(response.data.data.token, () => {
                    setValues({
                        // email: '',
                        // password: '',
                        success: true,
                        disabled: false,
                        loading: false,
                        redirect: true
                    })
                })
            })
            .catch(err => {
                let errMsg = 'Something went wrong!';
                if (err.response) {
                    errMsg = err.response.data;
                } else {
                    errMsg = 'Something went wrong!';
                }
                setValues({ ...values, error: errMsg, disabled: false, loading: false })
            })
    }


    const signInForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="text-muted">Email:</label>
                <input name='email' type="email" className="form-control"
                    value={email} required onChange={handleChange} />
            </div>
            <div className="form-group">
                <label className="text-muted">Password:</label>
                <input name="password" type="password" onChange={handleChange} className="form-control"
                    value={password} required />
            </div>
            <button type="submit" className="btn btn-outline-primary" disabled={disabled}>Login</button>
        </form>
    );

    const redirectUser = () => {
        if (redirect) {
            console.log(redirect)
            return <Redirect to={`${userInfo().role}/dashboard`} />
        }
        if (isAuthenticated()) return <Redirect to="/" />
    }
    return (
        <div title="Login" className="container col-md-8 offset-md-2">

            {signInForm()}
            {/* {redirectUser()} */}
            <hr />
        </div>
        // <div title="Login" className="container col-md-8 offset-md-2">
        //     {redirectUser()}
        //     {/* {showLoading(loading)} */}
        //     {/* {showError(error, error)} */}
        //     <h3>Login Here,</h3>
        //     <hr />
        //     {signInForm()}
        //     <hr />
        // </div>

    );
}

export default Login;