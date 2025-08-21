import { useState } from "react";
import { register, login } from "../../api";
import RegisterForm from "./RegisterForm";
import "./Register.css";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use API helper to register user
      await register(username, password);

      setSuccess("User registered successfully!");
      setError("");

      // Auto-login
      await login(username, password);

      // Redirect to dashboard
      navigate("/dashboard/encounters");
    } catch (err) {
      // Show readable backend error messages
      if (err.response?.data) {
        const messages = Object.values(err.response.data).flat().join(" ");
        setError(messages);
      } else {
        setError(err.message || "Something went wrong");
      }
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
