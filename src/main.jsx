import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./assets/scss/style.scss";
import "./assets/scss/main.scss";
import { BrowserRouter } from "react-router-dom";
import UserDetailsProvider from "./hooks/userDetailsContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <UserDetailsProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </UserDetailsProvider>
  // </React.StrictMode>
);
