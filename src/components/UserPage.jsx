import { Button, ButtonGroup, Container, Form, ToggleButton } from "react-bootstrap";
import "/src/styles/Header.css";
import "/src/styles/UserPage.css";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

const UserPage = () => {
  const navigate = useNavigate();
  const [response, setResponse] = useState("");
  const [numVisitor, setNumVisitor] = useState(1);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const radios = [
    { name: "Yes", value: "Yes" },
    { name: "No", value: "No" },
    { name: "Maybe", value: "Maybe" },
  ];

  const increment = () => {
    if (numVisitor < 6) setNumVisitor(numVisitor + 1);
  };

  const decrement = () => {
    if (numVisitor > 1) setNumVisitor(numVisitor - 1);
  };

  // const handleChange = (e) => {
  //   setResponse(e.target.value);
  //   console.log("RSVP response:", e.target.value);
  // };

  useEffect(() => {
    const fetchRSVP = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const userId = session.user.id;

      // Fetch the RSVP for this user
      const { data, error } = await supabase.from("users").select("is_coming, num_visitors, notes").eq("id", userId).single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching RSVP:", error.message);
        return;
      }

      if (data) {
        setResponse(data.is_coming ? "Yes" : data.notes ? "Maybe" : "No");
        setNumVisitor(data.num_visitors || 1);
        setNotes(data.notes || "");
      }
    };

    fetchRSVP();
  }, []);

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (response === "No" || response === "Maybe") {
      setNumVisitor(0);
    }

    // Get current session & user info
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      alert("You must be logged in to submit RSVP.");
      setLoading(false);
      return;
    }
    const userId = session.user.id;
    const userEmail = session.user.email;
    const userFullName = session.user.user_metadata?.full_name || "Unknown";

    // Upsert RSVP
    const { error } = await supabase.from("users").upsert(
      {
        id: userId,
        full_name: userFullName,
        email: userEmail,
        is_coming: response === "Yes",
        num_visitors: response === "Yes" ? numVisitor : 0,
        notes: response === "No" || response === "Maybe" ? notes : null,
      },
      { onConflict: ["id"] }
    );

    if (error) {
      alert("Error submitting RSVP: " + error.message);
    } else {
      alert("RSVP submitted successfully!");
    }

    setLoading(false);
  };
  return (
    <Container className="header">
      <Form onSubmit={handleSubmit}>
        <div className="text-center mt-4">
          <h1>RSVP</h1>
          <h2>Hi, will you attend?</h2>
          <ButtonGroup className="mt-3">
            {radios.map((radio, idx) => (
              <ToggleButton
                key={idx}
                id={`radio-${idx}`}
                type="radio"
                variant="secondary"
                name="radio"
                value={radio.value}
                checked={response === radio.value}
                onChange={(e) => {
                  const value = e.currentTarget.value;
                  setResponse(value);

                  if (value === "No" || value === "Maybe") {
                    setNumVisitor(0);
                  } else if (value === "Yes" && numVisitor === 0) {
                    setNumVisitor(1);
                  }
                }}
                className="btn-pinkUser btn-lg"
              >
                {radio.name}
              </ToggleButton>
            ))}
          </ButtonGroup>

          {response && (
            <p className="mt-3">
              You selected: <span style={{ fontWeight: "bold" }}>{response}</span>
            </p>
          )}

          {response === "Yes" && (
            <div>
              <h3>Number of visitors</h3>
              <div className="counter-buttons">
                <button type="button" className="counter-btn btn-lg" onClick={decrement}>
                  -
                </button>
                <span className="counter-value">{numVisitor}</span>
                <button type="button" className="counter-btn btn-lg" onClick={increment}>
                  +
                </button>
              </div>
            </div>
          )}

          {(response === "No" || response === "Maybe") && (
            <div>
              <Form.Group>
                <Form.Control as="textarea" rows={2} placeholder="Add notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
              </Form.Group>
            </div>
          )}

          <div className="mt-4">
            <Button type="submit" onClick={handleSubmit} className="btn-pinkUser btn-lg px-4">
              Submit
            </Button>
          </div>
        </div>
      </Form>
    </Container>
  );
};

export default UserPage;
