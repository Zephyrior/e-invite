import { useNavigate } from "react-router-dom";
import "/src/styles/Header.css";

const Header = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="header">
        <h3 className="mt-5">Join us for a</h3>
        <h1>Graduation party</h1>
        <p style={{ fontSize: "1rem" }}>of</p>
        <h2 style={{ fontSize: "3rem" }}>Carla Joanna</h2>
        <h2>Temblique</h2>
        <p className="pt-5 text-center">
          {" "}
          November 25th at 19.30
          <br />
          <a href="https://maps.app.goo.gl/mve2sif4e1GAXK3E7" style={{ color: " #da77aa" }}>
            Hokkaido Restaurant
          </a>
          <br />
          Via del Castro Pretorio, 10/12
          <br />
          00185 Roma
        </p>

        <p className="pt-3 text-center">
          <span>
            Please{" "}
            <a id="link" className="p-1" style={{ fontWeight: "bold" }} onClick={() => navigate("/login")}>
              sign up/log in
            </a>{" "}
            to <span style={{ fontWeight: "bold", fontFamily: "Pacifico, cursive", textShadow: "2px 2px 4px rgba(200, 67, 67, 0.3)" }}>RSVP</span>
          </span>
          <br />
          <br />
          <span style={{ textDecoration: "underline" }}>
            Your reply is requested by
            <br />
            20th of November
          </span>
        </p>
      </div>
    </>
  );
};

export default Header;
