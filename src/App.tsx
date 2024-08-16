import { useEffect } from "react";

import "./App.css";

function App() {
  const fetchData = async () => {
    const response = await fetch(
      "https://ciphersprint.pulley.com/bazellMP@gmail.com"
    );
    const data = await response.json();
    console.log(data);
  };

  useEffect(() => {
    fetchData();

    return () => {};
  }, []);

  return (
    <>
      <h1>Pulley + React</h1>
    </>
  );
}

export default App;
