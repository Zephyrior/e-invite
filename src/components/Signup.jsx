import { useState } from "react";
import "/src/styles/Header.css";
import "/src/styles/Signup.css";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const CREATE_USER_URL = "https://sbzqoertdmbssxudqlnk.functions.supabase.co/createUser"; // deployed Edge Function

const Signup = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Sign up via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (authError) throw new Error(authError.message);

      if (!authData.user) throw new Error("User creation failed");

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      // 2️⃣ Insert user directly into `users` table
      const { data, error: dbError } = await supabase.from("users").insert([
        {
          id: authData.user.id,
          auth_id: authData.user.id,
          full_name: fullName,
          email: authData.user.email,
        },
      ]);

      if (dbError) throw new Error(dbError.message);

      alert("Registration successful! Please check your email to confirm.");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <Container className="header">
      <h1>Sign up</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formFullName">
          <Form.Label>Full Name</Form.Label>
          <Form.Control type="text" placeholder="Enter your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Label>E-mail Address</Form.Label>
          <Form.Control type="email" placeholder="Enter your e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} maxLength={20} required />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formConfirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </Form.Group>

        {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

        <Button type="submit" className="w-100 btn-pink" disabled={loading}>
          {loading ? "Signing up..." : "Register"}
        </Button>
      </Form>

      <p className="mt-3">
        Already registered?{" "}
        <a className="loginLink" style={{ textDecoration: "none", fontWeight: "bold" }} onClick={() => navigate("/login")}>
          Login
        </a>
      </p>
    </Container>
  );
};

export default Signup;
