import { useState } from "react";
import "/src/styles/Header.css";
import "/src/styles/Signup.css";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    console.log({ email, password });

    // Sign in with Supabase Auth
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Successful login
    setLoading(false);
    console.log("Logged in user:", data.user);
    navigate("/rsvp"); // redirect to home or user dashboard
  };
  return (
    <>
      <Container className="header">
        <h1>Log in</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>E-mail Address</Form.Label>
            <Form.Control type="email" placeholder="Enter your e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} maxLength={20} required />
            {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
          </Form.Group>
          <Button type="submit" className="w-100 btn-pink">
            Log in
          </Button>
        </Form>
        <p className="mt-3">
          New user?{" "}
          <a className="loginLink" style={{ textDecoration: "none", fontWeight: "bold" }} onClick={(e) => navigate("/signup")}>
            Register here
          </a>
        </p>
      </Container>
    </>
  );
};

export default Login;
