import {useState} from "react";
import {Link, useNavigate} from "react-router-dom"; // Import Link
import {login} from "../../api";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,} from "../ui/card";
import {Input} from "../ui/input";
import {Button} from "../ui/button";
import {Label} from "../ui/label";
import dndLogo from '../../assets/logo512.png';

export default function Login({setIsLoggedIn}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(username, password);
            localStorage.setItem("access_token", data.access);
            localStorage.setItem("username", username);   // 👈 save username
            setIsLoggedIn(true);
            navigate("/dashboard/encounters");
        } catch (err) {
            setError("Invalid credentials. Please try again.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-green-50 p-4">
            <Card className="w-full max-w-sm border-green-200 bg-white">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-4">
                        <img src={dndLogo} alt="DNDHelper Logo" className="h-20 w-20"/>
                    </div>
                    <CardTitle className="text-4xl font-extrabold text-green-800">D&D Encounter Helper</CardTitle>
                    <CardDescription className="text-green-600">
                        Enter your username and password to access your account.
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="username" className="text-green-700">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="bg-green-50 border-green-200 text-green-800 focus-visible:ring-green-400"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password" className="text-green-700">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-green-50 border-green-200 text-green-800 focus-visible:ring-green-400"
                            />
                        </div>
                        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                        <Button type="submit" className="w-full bg-green-700 hover:bg-green-800 text-white">
                            Login
                        </Button>
                        <Link to="/register" className="w-full">
                            <Button type="button" variant="outline"
                                    className="w-full bg-green-100 text-green-700 hover:bg-green-200">
                                Register
                            </Button>
                        </Link>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}