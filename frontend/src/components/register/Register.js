import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api";
import RegisterForm from "./RegisterForm";
import "./Register.css";

export default function Register({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        const errorMessages = Object.values(data).flat().join(" ");
        throw new Error(errorMessages);
      }

      setSuccess("User registered successfully!");
      setError("");

      // Auto-login
      const token = await login(username, password);
      localStorage.setItem("access_token", token);
      setIsLoggedIn(true);
      navigate("/dashboard/encounters");
    } catch (err) {
      setError(err.message);
      setSuccess("");
    }
  };

  return (
    <div className="container">
      <RegisterForm
        username={username}
        password={password}
        setUsername={setUsername}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
        error={error}
        success={success}
      />
    </div>
  );
}
