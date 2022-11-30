import './App.css';
import React, { useState } from 'react';
import NavigationBar from './Pages/Shared/Navigationbar/NavigationBar';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './Pages/Home/Home/Home';
import Footer from './Pages/Shared/Footer/Footer';
import LogIn from './Pages/LogIn/LogIn/LogIn';
import NotFound from './Pages/Shared/NotFound/NotFound';
import AuthProvider from './Contexts/AuthProvider/AuthProvider';
import PrivateRoute from './Pages/LogIn/PrivateRoute/PrivateRoute';
import SpecialPage from './Pages/SpecialPage/SpecialPage';
import Register from './Pages/LogIn/Register/Register';
import Dashboard from './Pages/Dashboard/Dashboard/Dashboard';
import Header from './Pages/Shared/Header/Header';
import PasswordReset from './Pages/LogIn/LogIn/Password/PasswordReset/PasswordReset';
import ForgetPassword from './Pages/LogIn/LogIn/Password/ForgetPassword/ForgetPassword';


// initializeFirebase();
function App() {
  // const a = React.version;
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header></Header>
        {/* <NavigationBar></NavigationBar> */}
        <Switch>
          <Route exact path='/'>
            <Home></Home>
          </Route>
          <Route path='/home'>
            <Home></Home>
          </Route>
          <Route path='/login'>
            <LogIn></LogIn>
          </Route>
          <Route path='/reset-password/:email/:token'>
            <PasswordReset></PasswordReset>
          </Route>
          <Route path='/forget-password'>
            <ForgetPassword></ForgetPassword>
          </Route>
          <Route path='/register'>
            <Register></Register>
          </Route>
          <PrivateRoute path='/dashboard'>
            <Dashboard></Dashboard>
          </PrivateRoute>
          <Route path='*'>
            <NotFound></NotFound>
          </Route>
        </Switch>
        <Footer></Footer>
      </BrowserRouter>
    </AuthProvider>
  );
}




export default App;

