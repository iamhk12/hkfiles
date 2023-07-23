import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
const Logout = () => {
    const navigate = useNavigate();
    useEffect(() => {
        localStorage.removeItem('password');
        navigate('/login');
        //eslint-disable-next-line
    }, []);

    return <>
    </>
}

export default Logout