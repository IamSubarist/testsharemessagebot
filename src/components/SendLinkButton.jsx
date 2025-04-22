import React, { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk";

const SendLinkButton = () => {
  // Функция для проверки, запущен ли в Telegram Web App
  const handleCheck = () => {
    if (
      typeof window.Telegram !== "undefined" &&
      typeof window.Telegram.WebApp !== "undefined" &&
      window.Telegram.WebApp.initData !== ""
    ) {
      alert("Запущено в Telegram Web App");
    } else {
      alert("Не в Telegram Web App");
    }
  };

  const handleSendLink = async () => {
    const url = window.location.href; // Получаем текущую ссылку

    // Проверяем доступность Telegram Web App через SDK
    if (
      typeof window.Telegram !== "undefined" &&
      typeof window.Telegram.WebApp !== "undefined" &&
      window.Telegram.WebApp.initData !== ""
    ) {
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
            messageText: "https://socket.dev/npm/package/@twa-dev/sdk",
            url,
          }),
        });

        const data = await response.json();
        const messageId = data.message_id;

        if (!messageId) {
          console.error("Message ID is not defined");
          alert("Не удалось получить идентификатор сообщения");
          return;
        }

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
