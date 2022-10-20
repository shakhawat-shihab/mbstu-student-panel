import initializeFirebase from '../Pages/LogIn/Firebase/firebase.init';
import { useState, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, GoogleAuthProvider, signInWithPopup, updateProfile, getIdToken, signOut } from "firebase/auth";


// initialize firebase app
initializeFirebase();

const useFirebase = () => {
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingRole, setIsLoadingRole] = useState(true);
    const [isLoadingRegister, setIsLoadingRegister] = useState(true);
    const [isLoadingLogin, setIsLoadingLogin] = useState(true);
    const [authError, setAuthError] = useState('empty');
    const [admin, setAdmin] = useState(false);
    const [token, setToken] = useState('');
    const [student, setStudent] = useState(false);
    // const [studentId, setStudentId] = useState('');
    const [teacher, setTeacher] = useState(false);
    const [deptChairman, seDeptChairman] = useState(false);
    const [dept, setDept] = useState('');

    const auth = getAuth();
    const googleProvider = new GoogleAuthProvider();

    const registerUser = (email, password, name, history) => {
        setIsLoadingRegister(true);
        return createUserWithEmailAndPassword(auth, email, password);
        // createUserWithEmailAndPassword(auth, email, password)
        //     .then((userCredential) => {
        //         setAuthError('');
        //         const newUser = { email, displayName: name };
        //         setUser(newUser);
        //         // save user to the database
        //         saveUser(email, name, 'put');
        //         // send name to firebase after creation
        //         updateProfile(auth.currentUser, {
        //             displayName: name
        //         }).then(() => {
        //             //console.log("use firebase er modde isLoadingRegister ", isLoadingRegister)
        //             setIsLoadingRegister(false);
        //             //console.log("use firebase er modde isLoadingRegister 1 ", isLoadingRegister)
        //         }).catch((error) => {
        //         });
        //         history.replace('/');
        //     })
        //     .catch((error) => {
        //         setAuthError(error.message);
        //         console.log(error);
        //     })
        //     .finally(() => setIsLoadingRegister(false));
    }

    const loginUser = (email, password, location, history) => {
        setIsLoadingLogin(true);
        return signInWithEmailAndPassword(auth, email, password);
        // signInWithEmailAndPassword(auth, email, password)
        //     .then((userCredential) => {
        //         const destination = location?.state?.from || '/';
        //         history.replace(destination);
        //         console.log('inside log in 1');
        //         setAuthError('');
        //     })
        //     .catch((error) => {
        //         setAuthError(error.message);
        //         console.log('inside log in 2');
        //         setIsLoadingLogin(false);
        //     })
        //     .finally(() => setIsLoadingLogin(false));
    }

    const signInWithGoogle = () => {
        setIsLoading(true);
        return signInWithPopup(auth, googleProvider)
        // signInWithPopup(auth, googleProvider)
        //     .then((result) => {
        //         const user = result.user;
        //         // saveUser(user.email, user.displayName, 'PUT');
        //         setAuthError('');
        //         const destination = location?.state?.from || '/';
        //         history.replace(destination);
        //     }).catch((error) => {
        //         setAuthError(error.message);
        //     }).finally(() => setIsLoading(false));
    }

    // observer user state
    useEffect(() => {
        const unsubscribed = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                getIdToken(user)
                    .then(idToken => {
                        setToken(idToken);
                        //console.log('print idToken = ', idToken);
                    })
            } else {
                setUser({})
            }
            setIsLoading(false);
        });
        return () => unsubscribed;
    }, [auth])

    useEffect(() => {
        setIsLoadingRole(true);
        fetch(`http://localhost:5000/users/role/${user.email}`)
            .then(res => res.json())
            .then(data => {
                console.log("users role ", data?.isStudent, data?.isTeacher);
                setStudent(data?.isStudent);
                // setStudentId(data?.s_id);
                setTeacher(data?.isTeacher);
                seDeptChairman(data?.isDeptChairman);
                setDept(data?.department);
                setIsLoadingRole(false);
            })
    }, [user.email])

    const logout = () => {
        setIsLoading(true);
        signOut(auth).then(() => {
            // Sign-out successful.
        }).catch((error) => {
            // An error happened.
        })
            .finally(() => setIsLoading(false));
    }

    const saveUser = (email, displayName, method) => {
        const user = { email, displayName };
        fetch('http://localhost:5000/users', {
            method: method,
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
            })
    }

    return {
        user,
        admin,
        token,
        isLoading,
        authError,
        registerUser,
        loginUser,
        signInWithGoogle,
        logout,
        saveUser,
        setUser,
        setIsLoading,
        isLoadingRegister,
        setIsLoadingRegister,
        student,
        // studentId,
        teacher,
        deptChairman,
        dept,
        isLoadingRole
    }
}

export default useFirebase;