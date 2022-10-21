import React, { createContext } from 'react';
import apiAuth from '../../api/apiAuth';
// import useM from '../../api/apiAuth';
import useFirebase from '../../Hooks/useFirerbase';
import useMongoose from '../../Hooks/useMongoose';


export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const allContexts = useMongoose();
    return (
        <AuthContext.Provider value={allContexts}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;