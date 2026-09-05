import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/api";
import "../App.css";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");

        // Frontend validation
        if (!formData.email.trim() || !formData.password) {
            setError("Email and password are required.");
            return;
        }

        try {
            setLoading(true);

            // Call backend login API
            const data = await loginUser(
                formData.email.trim(),
                formData.password
            );

            console.log("Login response:", data);

            // Validate response
            if (!data || !data.token || !data.user) {
                throw new Error(
                    "Invalid login response from server."
                );
            }

            // Save JWT token
            localStorage.setItem(
                "token",
                data.token
            );

            // Save user information
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            // Navigate according to role
            if (data.user.role === "approver") {
                navigate("/approver");
            } else {
                navigate("/employee");
            }

        } catch (err) {
            console.error("Login error:", err);

            setError(
                err.message ||
                "Login failed. Please check your credentials."
            );

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">

            <div className="auth-card">

                {/* Header */}
                <div className="auth-header">

                    <p className="eyebrow">
                        EXPENSE MANAGEMENT SYSTEM
                    </p>

                    <h1>Welcome Back</h1>

                    <p>
                        Login to manage your expense
                        reimbursements.
                    </p>

                </div>

                {/* Error */}
                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit}>

                    {/* Email */}
                    <div className="form-group">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={loading}
                        />

                    </div>

                    {/* Password */}
                    <div className="form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={loading}
                        />

                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="btn btn-primary btn-full"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>

                {/* Footer */}
                <div className="auth-footer">

                    <p>
                        Don't have an account?{" "}
                        <Link to="/register">
                            Create Account
                        </Link>
                    </p>

                    <Link to="/" className="back-link">
                        ← Back to Home
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default Login;