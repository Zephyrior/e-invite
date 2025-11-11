import { useState } from "react";
import "/src/styles/Header.css";
import "/src/styles/Signup.css";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

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
    console.log({ fullName, email, password, confirmPassword });
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    const { data, error: dbError } = await supabase.from("users").insert([
      {
        id: authData.user.id,
        full_name: fullName,
        email: email,
      },
    ]);

    if (dbError) {
      setError(dbError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    alert("Registration successful! Please check your email to confirm.");
    navigate("/login");
  };
  return (
    <>
      <Container className="header">
        <h1>Sign up</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicName">
            <Form.Label>Full Name</Form.Label>
            <Form.Control type="text" placeholder="Enter your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>E-mail Address</Form.Label>
            <Form.Control type="email" placeholder="Enter your e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} maxLength={20} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
          </Form.Group>
          <Button type="submit" className="w-100 btn-pink">
            Register
          </Button>
        </Form>
        <p className="mt-3">
          Already registered?{" "}
          <a className="loginLink" style={{ textDecoration: "none", fontWeight: "bold" }} onClick={(e) => navigate("/login")}>
            Login
          </a>
        </p>
      </Container>
    </>
  );
};

export default Signup;
