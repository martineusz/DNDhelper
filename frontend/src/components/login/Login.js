import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {login} from "../../api";
import LoginForm from "./LoginForm";
import "./Login.css";

export default function Login({setIsLoggedIn}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(username, password); // returns { access, refresh }
            localStorage.setItem("access_token", data.access); // save only access
            setIsLoggedIn(true);
            navigate("/dashboard/encounters");
        } catch (err) {
            setError("Invalid credentials");
        }
    };

    return (
        <div className="login-container">
            <LoginForm
                username={username}
                password={password}
                setUsername={setUsername}
                setPassword={setPassword}
                handleSubmit={handleSubmit}
                error={error}
            />
        </div>
    );
}
