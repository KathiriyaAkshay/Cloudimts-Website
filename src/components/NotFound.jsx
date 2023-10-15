import React from "react";
import "../assets/scss/404.scss";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/Imageinet-logo.png";
import { Button, Typography } from "antd";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        marginTop: "200px",
        display: "flex",
        gap: "20px",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src={logo}
        alt="Logo"
        className={"signup-logo"}
        style={{ width: "200px", height: "120px" }}
      />
      <Typography style={{ fontSize: "50px", fontWeight: "600" }}>
        404 Error
      </Typography>
      <Typography>We can't find the page you are looking for.</Typography>
      <Button type="primary" onClick={() => navigate(-1)}>
        Back
      </Button>
    </div>
  );
};

export default NotFound;
