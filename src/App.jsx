import { Route, Routes, Navigate } from "react-router-dom";
import BasicLayout from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";

import { routes } from "./routes/routes";
import BasicContext from "./hooks";
import NotFound from "./components/NotFound";
import ReportSummary from "./components/ReportSummary";
import Downloads from "./pages/Downloads/Downloads";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="/patientreport/:id" element={<ReportSummary />} />
        <Route path="/downloads" element={<Downloads/>} />     
        <Route path="*" element={<Navigate to="/not-found" />} />
        {routes?.map(({ path, component: Component }, index) => (
          <Route
            key={index}
            path={path}
            element={
              <BasicContext>
                <BasicLayout>
                  <ProtectedRoute path={path}>{Component}</ProtectedRoute>
                </BasicLayout>
              </BasicContext>
            }
          />
        ))}
      </Routes>
    </div>
  );
}

export default App;
