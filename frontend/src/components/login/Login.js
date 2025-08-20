import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api";
import LoginForm from "./LoginForm";
import "./Login.css";

export default function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await login(username, password); // assume login() returns token
      localStorage.setItem("token", token);
      setIsLoggedIn(true); // update App state
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
