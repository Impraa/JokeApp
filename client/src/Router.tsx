import "./Router.scss";
import { Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Error404 from "./pages/Error404";
import Register from "./pages/Register";
import Login from "./pages/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
}

export default App;
