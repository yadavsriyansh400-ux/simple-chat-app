import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./loginpage.css";

function RegisterPage() {
    const [username, setUsername] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [password, setPassword] =
        useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post(
                "/auth/register",
                {
                    username,
                    email,
                    password,
                }
            );

            alert(res.data.message);

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Something went wrong"
            );
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <h1 className="auth-title">
                    🌿 JungleChat
                </h1>

                <h2>Create Account</h2>

                <form onSubmit={handleSubmit}>

                    <input
                        className="auth-input"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) =>
                            setUsername(e.target.value)
                        }
                    />

                    <input
                        className="auth-input"
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />

                    <input
                        className="auth-input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />

                    <button
                        className="auth-button"
                        type="submit"
                    >
                        Register
                    </button>

                    <p className="auth-link">
                        Already have an account?

                        <span
                            onClick={() =>
                                navigate("/login")
                            }
                        >
                            Login
                        </span>
                    </p>

                </form>

            </div>

        </div>
    );
}

export default RegisterPage;