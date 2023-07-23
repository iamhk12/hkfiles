import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const navigate = useNavigate()

    const appStyles = {
        fontFamily : "'Poppins', sans-serif",
        textAlign: 'center',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: 'white',
        background: 'linear-gradient(-150deg, #222222, #373737, #3c4859)',
        backgroundPosition: 'center',
        backgroundRepeat: 'repeat-y',
        backgroundSize: 'cover',
    };

    const headerStyles = {
        marginBottom: '30px',
        marginTop: "200px",
    };

    const submitBtnStyle = {
        
        padding: "10px 15px",
        borderRadius: "20px",
        background: "#1c84ff",
        color : "#fff",
        fontWeight : "600"
    }

    const formStyles = {
        display: "flex",
        flexDirection: "column"
    }

    const inputStyles = {
        border: '2px solid white',
        backgroundColor: 'transparent',
        outline: 'none',
        color: 'white',
        fontSize: '16px',
        padding: '8px 12px',
        borderRadius: '5px',
    };

    const [pass, setPassword] = useState("");

    const Verify = () => {
        if (pass !== "Kothari@111" || pass !== "@iamHK12") {
            alert("Incorrect Password");
            return;
        }
        if (pass === "Kothari@111" ||  pass === "@iamHK12") {
            localStorage.setItem("password", pass);
            navigate("/")
        }

    }

    return (
        <div style={appStyles}>
            <h1 style={headerStyles}>Enter Password</h1>
            <form style={formStyles} onSubmit={Verify}>
                <input
                    type="password"
                    style={inputStyles}
                    placeholder="Password"
                    onChange={(e) => { setPassword(e.target.value) }}
                />
                <div style={{ marginTop: "10px" }}><button style={submitBtnStyle} type='submit'>Submit</button></div>
            </form>
        </div>
    );
};

export default Login;
