import React, { createContext } from 'react';
import apiAuth from '../../api/apiAuth';
// import useM from '../../api/apiAuth';
import useFirebase from '../../Hooks/useFirerbase';


export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
    const allContexts = apiAuth();
    return (
        <AuthContext.Provider value={allContexts}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;