import { Button } from "antd";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserRoleContext } from "../hooks/usersRolesContext";
import { UserEmailContext } from "../hooks/userEmailContext";

const HeaderButton = ({ setIsModalOpen }) => {
  const navigate = useNavigate();
  const { setIsRoleModalOpen } = useContext(UserRoleContext);
  const { setIsEmailModalOpen } = useContext(UserEmailContext);
  return (
    <div>
      {window.location.pathname === "/iod-settings" && (
        <div className="iod-setting-div">
          <Button type="primary">Upload</Button>
          <Button>Connect IOD</Button>
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            Configure IOD settings
          </Button>
        </div>
      )}
      {window.location.pathname === "/institutions" && (
        <div className="iod-setting-div">
          <Button type="primary" onClick={() => navigate("/institutions-logs")}>
            Institution Logs
          </Button>
          <Button type="primary" onClick={() => navigate("/institutions/add")}>
            Add Institution
          </Button>
        </div>
      )}
      {window.location.pathname === "/users" && (
        <div className="iod-setting-div">
          <Button type="primary" onClick={() => navigate("/users/add")}>
            Add Users
          </Button>
        </div>
      )}
      {window.location.pathname === "/users/roles" && (
        <div className="iod-setting-div">
          <Button type="primary" onClick={() => setIsRoleModalOpen(true)}>
            Add Role
          </Button>
        </div>
      )}
      {window.location.pathname === "/users/email" && (
        <div className="iod-setting-div">
          <Button type="primary" onClick={() => setIsEmailModalOpen(true)}>
            Add Email
          </Button>
        </div>
      )}
    </div>
  );
};

export default HeaderButton;
