import React from 'react';
import { Routes, Route } from 'react-router-dom'
import Files from './Files';
import Logout from './Logout';
import Login from './Login';

function App() {
  return (
    <>
      <Routes>
        <Route exact path='/' element={<Files/>} />
        <Route exact path='/logout' element={<Logout/>} />
        <Route exact path='/login' element={<Login/>} />
      </Routes>
    </>
  );
}

export default App;