import React from 'react';
import { Spinner } from 'react-bootstrap';
import { Route, Redirect } from 'react-router-dom';
import useAuth from '../../../../Hooks/useAuth';

const DeptChairmanRoute = ({ children, ...rest }) => {
    const { user, deptChairman, isLoading, isLoadingRole } = useAuth();
    //console.log(deptChairman, user, isLoadingRole);
    if (isLoading || isLoadingRole) {
        return <div className='text-center my-5 py-5 '>
            <Spinner className='align-items-center justify-content-start mx-auto' animation="grow" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    }
    return (
        <Route
            {...rest}
            render={({ location }) =>
                user.email && deptChairman ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/",
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    );
};

export default DeptChairmanRoute;