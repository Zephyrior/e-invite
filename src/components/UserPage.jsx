import { Button, ButtonGroup, Container, Form, ToggleButton } from "react-bootstrap";
import "/src/styles/Header.css";
import "/src/styles/UserPage.css";
import { useState } from "react";

const UserPage = () => {
  const [response, setResponse] = useState("");
  const [numVisitor, setNumVisitor] = useState(1);
  const [notes, setNotes] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (response === "No" || response === "Maybe") {
      setNumVisitor(0);
    }
    alert(`You selected: ${response}
        number of visitors: ${numVisitor}`);
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
