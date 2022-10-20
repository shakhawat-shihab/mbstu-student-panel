import React from 'react';
import { Spinner } from 'react-bootstrap';
import { Route, Redirect } from 'react-router-dom';
import useAuth from '../../../../Hooks/useAuth';

const TeacherRoute = ({ children, ...rest }) => {
    const { user, teacher, isLoading, isLoadingRole } = useAuth();
    // console.log(teacher, user, isLoadingRole);
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
                user.email && teacher ? (
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

export default TeacherRoute;