import { useState, useEffect } from "react";
// import Button from "../../../../components/button/Button";
import axios from "axios";
import { toast } from "react-toastify";

export default function TgPopup({ taskId, redirectURL, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [widgetReady, setWidgetReady] = useState(false);

  /* === 1. Подгружаем telegram‑widget.js один раз === */
  useEffect(() => {
    if (window.Telegram && window.Telegram.Login) {
      setWidgetReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.onload = () => setWidgetReady(true);
    script.onerror = () =>
      console.error("Telegram widget script failed to load");
    document.body.appendChild(script);
  }, []);

  /* === 2. Нажатие кнопки «Telegram» === */
  const handleTelegramCheck = async () => {
    try {
      setLoading(true);

      // 2.1 Сначала, при необходимости, открываем redirectURL
      if (redirectURL) window.open(redirectURL, "_blank");

      // 2.2 Авторизация Telegram
      const tgData = await new Promise((resolve, reject) => {
        const telegram = window.Telegram;
        if (telegram && telegram.Login) {
          telegram.Login.auth(
            { bot_id: "8159992448", request_access: true },
            (data) => {
              if (data) resolve(data);
              else reject(new Error("Telegram login failed"));
            }
          );
        } else {
          reject(new Error("Telegram API not loaded"));
        }
      });

      // 2.3 Формируем payload
      const payload = {
        task_id: 6,
        user_input: "",
        extra_data: { additionalProp1: tgData },
      };
      console.log("CHECK_TASK payload →", payload);

      // 2.4 POST /task/check_task
      const token = localStorage.getItem("token");
      await axios.post(
        `https://gs.sjp-asia.group/api/task/check_task`,
        payload,
        {
          headers: { Authorization: token },
        }
      );

      toast.success("Задание отправлено на проверку");
      onSuccess && onSuccess();
    } catch (err) {
      toast.error(err.message || "Ошибка Telegram");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tg-task-popover-container">
      <div className="tg-task-popover-instruction">
        Для проверки задания нажмите на кнопку
      </div>

      <div style={{ marginTop: "24px", width: "100%" }}>
        <button
          text="Telegram"
          onClick={handleTelegramCheck}
          disabled={loading || !widgetReady}
        >
          Telegram
        </button>
      </div>
    </div>
  );
}
