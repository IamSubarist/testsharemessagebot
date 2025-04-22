import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import SendLinkButton from "./components/SendLinkButton";
import SendButton from "./components/SendButton";
import WebApp from "@twa-dev/sdk";

function App() {
  const [count, setCount] = useState(0);
  if (
    typeof window.Telegram !== "undefined" &&
    typeof window.Telegram.WebApp !== "undefined" &&
    window.Telegram.WebApp.initData !== ""
  ) {
    console.log("Ты в браузере");
  } else {
    WebApp.showAlert("Hey there!");
  }

  return (
    <>
      <SendLinkButton />
      <SendButton />
    </>
  );
}

export default App;
