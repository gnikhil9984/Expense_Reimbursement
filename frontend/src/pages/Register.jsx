import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/api";
import "../App.css";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    }

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setSuccess("");

        const {
            name,
            email,
            password,
            confirmPassword,
        } = formData;

        // Validation
        if (!name.trim() || !email.trim() || !password) {
            setError("Please fill in all required fields.");
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            const response = await registerUser(
                name.trim(),
                email.trim(),
                password
            );

            console.log("Registration response:", response);

            setSuccess(
                "Registration successful! Redirecting to login..."
            );

            setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
            });

            setTimeout(() => {
                navigate("/login");
            }, 1200);

        } catch (error) {
            console.error("Registration error:", error);

            setError(
                error.message ||
                "Registration failed. Please try again."
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

                    <h1>Create Account</h1>

                    <p>
                        Create your employee account to manage
                        expense reimbursements.
                    </p>

                </div>

                {/* Error */}
                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                {/* Success */}
                {success && (
                    <div className="alert alert-success">
                        {success}
                    </div>
                )}

                {/* Register Form */}
                <form onSubmit={handleSubmit}>

                    {/* Full Name */}
                    <div className="form-group">

                        <label htmlFor="name">
                            Full Name
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            disabled={loading}
                        />

                    </div>

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

                    {/* Confirm Password */}
                    <div className="form-group">

                        <label htmlFor="confirmPassword">
                            Confirm Password
                        </label>

                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
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
                            ? "Creating Account..."
                            : "Create Account"}
                    </button>

                </form>

                {/* Footer */}
                <div className="auth-footer">

                    <p>
                        Already have an account?{" "}
                        <Link to="/login">
                            Login
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

export default Register;