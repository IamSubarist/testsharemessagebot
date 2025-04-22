import React, { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";

const SendLinkButton = () => {
  const [isWebApp, setIsWebApp] = useState(false);

  // Функция для проверки, запущен ли в Telegram Web App
  const handleCheck = () => {
    if (isWebApp) {
      alert("Запущено в Telegram Web App");
    } else {
      alert("Не в Telegram Web App");
    }
  };

  // Эффект для инициализации Web App
  useEffect(() => {
    // Проверяем наличие WebApp после инициализации
    if (typeof WebApp !== "undefined") {
      setIsWebApp(WebApp.isWebApp);
      WebApp.onEvent("initialized", () => {
        setIsWebApp(WebApp.isWebApp);
      });
    }
  }, []);

  const handleSendLink = async () => {
    const url = window.location.href; // Получаем текущую ссылку

    // Проверяем доступность Telegram Web App через SDK
    if (isWebApp) {
      try {
        // Получаем user_id из initData
        const initData = WebApp.initDataUnsafe;
        const userId = initData.user.id;

        // Запрос на сервер для получения подготовленного сообщения
        const response = await fetch("http://localhost:5000/save-message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            messageText: "Click here to open the link",
            url,
          }),
        });

        const data = await response.json();
        const messageId = data.message_id;

        // Отправляем ссылку через Telegram Web App
        WebApp.shareMessage(messageId, (success) => {
          if (success) {
            console.log("Message successfully sent!");
          } else {
            console.log("Failed to send the message");
          }
        });
      } catch (error) {
        console.error("Error sending link:", error);
      }
    } else {
      // В браузере — копируем ссылку в буфер обмена
      navigator.clipboard
        .writeText(url)
        .then(() => {
          alert("Ссылка скопирована в буфер обмена");
        })
        .catch((error) => {
          alert("Не удалось скопировать ссылку");
        });
    }
  };

  return (
    <>
      <button onClick={handleSendLink}>Отправить ссылку1</button>
      <button onClick={handleCheck}>Проверить Web App</button>
    </>
  );
};

export default SendLinkButton;
