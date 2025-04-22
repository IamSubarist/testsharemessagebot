import React from "react";

const SendLinkButton = () => {
  const handleSendLink = () => {
    const url = window.location.href; // Получаем текущую ссылку

    if (window.Telegram) {
      // Telegram Web App
      window.Telegram.WebApp.sendData(url);
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
