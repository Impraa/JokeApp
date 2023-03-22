import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import axios from "axios";

function App() {
  const [backendData, setBackendData] = useState<String>();

  useEffect(() => {
    axios("http://localhost:3000/register")
      .then((response) => console.log(response))
      .then((data) => console.log(data))
      .catch((error) => console.error(error));
  }, []);

  return <div className="App"></div>;
}

export default App;
