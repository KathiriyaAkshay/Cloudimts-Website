import { Spin } from "antd";
import React, { Suspense } from "react";

const Loader = ({ component: Component, props }) => {
  return (
    <Suspense
      fallback={
        <Spin
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50% , -50%)",
          }}
        />
      }
    >
      <Component {...props} />
    </Suspense>
  );
};

export default Loader;
