import React from "react";

const SettingPopup = (props) => {
  const { popupMenus, width, handleMenu, className } = props || [];

  return (

      <div>
      <div className={`setting-handle ${className}`}>
        {popupMenus?.length &&
          popupMenus?.map((item) => {
            return (
              <>
              <div
              className="setting-handle-container"
                onClick={() => handleMenu(item?.name)}
                style={{ width: width, cursor: "pointer" }}
              >
                {item?.name}
              </div>
              <hr style={{ margin : '0px'}}/>
              </>
            );
          })}
      </div>
    </div>
  );
};

export default SettingPopup;
