import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./loginpage.css";

function LoginPage() {
    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post(
                "/auth/login",
                {
                    email,
                    password,
                }
            );

            localStorage.setItem(
                "token",
                res.data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(res.data.user)
            );

            navigate("/");

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Login failed"
            );
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1 className="auth-title">
                    🌿 JungleChat
                </h1>

                <h2>
                    Welcome Back
                </h2>

                <form onSubmit={handleSubmit}>
                    <input
                        className="auth-input"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />

                    <br />
                    <br />

                    <input
                        className="auth-input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />

                    <br />
                    <br />

                    <button className="auth-button" type="submit">
                        Login
                    </button>

                    <p className="auth-link">
                        New to JungleChat?

                        <span
                            onClick={() => navigate("/register")}
                        >
                            Register
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;