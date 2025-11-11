import { useNavigate } from "react-router-dom";
import "/src/styles/Header.css";

const Header = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="header">
        <h3>Join us for a</h3>
        <h1>Graduation party</h1>
        <p>of</p>
        <h2>Carla Joanna</h2>
        <h2>Temblique</h2>
        <p className="pt-5 text-center">
          {" "}
          November 25th at 19.30
          <br />
          Hokkaido Restaurant
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
            to RSVP
          </span>
          <br />
          Your reply is requested by
          <br />
          20th of November
        </p>
      </div>
    </>
  );
};

export default Header;
