import React from "react";
import "../assets/scss/404.scss";
import { useNavigate } from "react-router-dom";

import logo from "../assets/images/Imageinet-logo.png";
import { Button, Typography,Row,Col  } from "antd";

const NotFound = () => {
  const navigate = useNavigate();


  const goBack = () => {
    // Check if there is a previous entry in the history stack
    if (window.history.length >= 2) {
      navigate(-2);
    } else if (window.history.length == 1) {
      navigate(-1);
    } else {
      // If no previous page exists, navi gate to a default path
      navigate('/institutions');
    }
  }


  const logout=()=>{
    localStorage.clear();
    navigate("/login");

  }
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
      <Row gutter={[16, 16]}>
        <Col>
        <Button type="primary" onClick={() => goBack()}>
          Back
        </Button>
        </Col>
        <Col>
        <Button type="primary" onClick={() => logout()}>
          Log out
        </Button>
        
        </Col>

       
      </Row>

    </div>
  );
};

export default NotFound;
