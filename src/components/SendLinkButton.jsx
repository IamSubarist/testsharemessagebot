import React from "react";

const SendLinkButton = () => {
  const handleSendLink = async () => {
    const url = window.location.href; // Получаем текущую ссылку

    if (window.Telegram) {
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
        const messageId = data.message_id; // ID подготовленного сообщения

        // Отправляем ссылку через Telegram Web App
        window.Telegram.WebApp.shareMessage(messageId, (success) => {
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

  return <button onClick={handleSendLink}>Отправить ссылку</button>;
};

export default SendLinkButton;
