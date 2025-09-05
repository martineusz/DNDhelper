import {useState} from "react";
import {login, register} from "../../api";
import {Link, useNavigate} from "react-router-dom";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "../ui/card";
import {Input} from "../ui/input";
import {Button} from "../ui/button";
import {Label} from "../ui/label";
import dndLogo from '../../assets/logo512.png';
import darkModeIcon from "../../assets/dark-mode.svg";
import {useDarkMode} from "../../context/DarkModeContext";

export default function Register({setIsLoggedIn}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const {darkMode, setDarkMode} = useDarkMode();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors

        if (password !== repeatPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            await register(username, password);

            setSuccess("User registered successfully!");
            setError("");

            const data = await login(username, password);
            localStorage.setItem("access_token", data.access);
            localStorage.setItem("username", username);
            setIsLoggedIn(true);

            navigate("/dashboard/encounters");
        } catch (err) {
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
        <div className="flex justify-center items-center min-h-screen bg-green-50 dark:bg-gray-950 p-4">
            <Card className="w-full max-w-sm border-green-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <img src={dndLogo} alt="DNDHelper Logo" className="h-20 w-20"/>
                    </div>
                    <CardTitle className="text-4xl font-extrabold text-green-800 dark:text-gray-100">D&D Encounter Helper</CardTitle>
                    <CardDescription className="text-green-600 dark:text-gray-300">
                        Create an account to manage your encounters.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="username" className="text-green-700 dark:text-gray-200">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="bg-green-50 dark:bg-gray-700 border-green-200 dark:border-gray-600 text-green-800 dark:text-gray-100 focus-visible:ring-green-400 dark:focus-visible:ring-green-500"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-green-700 dark:text-gray-200">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-green-50 dark:bg-gray-700 border-green-200 dark:border-gray-600 text-green-800 dark:text-gray-100 focus-visible:ring-green-400 dark:focus-visible:ring-green-500"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="repeatPassword" className="text-green-700 dark:text-gray-200">Repeat Password</Label>
                            <Input
                                id="repeatPassword"
                                type="password"
                                placeholder="Repeat Password"
                                value={repeatPassword}
                                onChange={(e) => setRepeatPassword(e.target.value)}
                                className="bg-green-50 dark:bg-gray-700 border-green-200 dark:border-gray-600 text-green-800 dark:text-gray-100 focus-visible:ring-green-400 dark:focus-visible:ring-green-500"
                            />
                        </div>
                        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                        {success && <p className="text-sm text-green-500 text-center">{success}</p>}
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                        <Button type="submit" className="w-full bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 text-white">
                            Register
                        </Button>
                        <Link to="/login" className="w-full">
                            <Button type="button" variant="outline"
                                    className="w-full bg-green-100 text-green-700 hover:bg-green-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                                Back to Login
                            </Button>
                        </Link>
                    </CardFooter>
                </form>
            </Card>
            <Button
                variant="ghost"
                onClick={() => setDarkMode(!darkMode)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
                <img
                    src={darkModeIcon}
                    alt="Toggle Dark Mode"
                    className={`h-6 w-6 ${darkMode ? "filter brightness-0 invert" : ""}`}
                />
            </Button>
        </div>
    );
}