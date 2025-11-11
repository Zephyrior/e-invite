import { useState } from "react";
import "/src/styles/Header.css";
import "/src/styles/Signup.css";
import { Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ fullName, email, password, confirmPassword });
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
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
