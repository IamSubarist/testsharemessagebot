import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import SendLinkButton from "./components/SendLinkButton";
import SendButton from "./components/SendButton";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <SendLinkButton />
      <SendButton />
    </>
  );
}

export default App;
