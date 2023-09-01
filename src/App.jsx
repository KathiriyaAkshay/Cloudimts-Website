import { Route, Routes, Navigate } from "react-router-dom";
import BasicLayout from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import { routes } from "./routes/routes";
import BasicContext from "./hooks";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
        {routes?.map(({ path, component: Component }, index) => (
          <Route
            key={index}
            path={path}
            element={
              <BasicContext>
                <BasicLayout>{Component}</BasicLayout>
              </BasicContext>
            }
          />
        ))}
      </Routes>
    </div>
  );
}

export default App;
