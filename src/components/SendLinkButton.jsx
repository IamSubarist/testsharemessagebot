import React, { useEffect } from "react";
import WebApp from "@twa-dev/sdk";

const SendLinkButton = () => {
  // Функция для проверки, запущен ли в Telegram Web App
  const handleCheck = () => {
    if (WebApp.isWebApp) {
      alert("123э");
    } else {
      alert("Не в Telegram Web App");
    }
  };

  // Эффект для инициализации Web App
  useEffect(() => {
    // Ждем инициализации Web App перед вызовом проверок
    WebApp.onEvent("initialized", () => {
      // Выполняем проверку при инициализации
      handleCheck();
    });
  }, []);

  const handleSendLink = async () => {
    const url = window.location.href; // Получаем текущую ссылку

    // Проверяем доступность Telegram Web App через SDK
    if (WebApp.isWebApp) {
      try {
        // Запрос на сервер для получения подготовленного сообщения
        const response = await fetch("http://localhost:5000/save-message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messageText: "Click here to open the link",
            url,
          }),
        });

        const data = await response.json();
        const messageId = data.message_id;
        console.log(data);

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
      <button onClick={handleSendLink}>Отправить ссылку</button>
      <button onClick={handleCheck}>test</button>
    </>
  );
};

export default SendLinkButton;
