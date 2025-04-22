import React from "react";

const SendButton = () => {
  const handleClick = async () => {
    // Данные, которые мы отправляем на сервер
    const data = { message: "Hello from the client!" };

    try {
      // Отправка POST-запроса на сервер
      const response = await fetch("http://localhost:5000/receive-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("Данные отправлены на сервер!");
      } else {
        console.log("Ошибка при отправке данных");
      }
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  return <button onClick={handleClick}>Отправить данные</button>;
};

export default SendButton;
