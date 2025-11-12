import { Instagram } from "react-bootstrap-icons";
import "/src/styles/Footer.css";

const Footer = () => {
  return (
    <>
      <p className="text-center text-muted fs-6 footer-p" style={{ backgroundColor: "rgba(252, 208, 220, 0.6)" }}>
        <a className="insta-link d-inline-flex align-items-center" href="https://www.instagram.com/zephyrior">
          <Instagram style={{ marginRight: "0.25rem" }} /> @Zephyrior
        </a>{" "}
        | © 2025 E-Invite • All rights reserved
      </p>
    </>
  );
};
export default Footer;
