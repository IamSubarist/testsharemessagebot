import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import SendLinkButton from "./components/SendLinkButton";
import SendButton from "./components/SendButton";
import WebApp from "@twa-dev/sdk";
import TgPopup from "./components/TgPopup";
import TgPopup2 from "./components/TgPopup2";

function App() {
  const [count, setCount] = useState(0);
  if (
    typeof window.Telegram !== "undefined" &&
    typeof window.Telegram.WebApp !== "undefined" &&
    window.Telegram.WebApp.initData !== ""
  ) {
    WebApp.showAlert("Hey there!");
  } else {
    console.log("Ты в браузере");
  }

  return (
    <>
      <SendLinkButton />
      <TgPopup />
      <TgPopup2 />
      <SendButton />
    </>
  );
}

export default App;
