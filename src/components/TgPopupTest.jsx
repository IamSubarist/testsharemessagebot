import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const TgPopupTest = ({ text, height = 48, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [widgetReady, setWidgetReady] = useState(false);

  // Подгрузка Telegram скрипта
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

  // Авторизация через Telegram
  const handleTelegramLogin = async () => {
    try {
      setLoading(true);

      const telegram = window.Telegram;

      if (telegram?.Login) {
        // Запрашиваем авторизацию через Telegram
        const tgData = await new Promise((resolve, reject) => {
          telegram.Login.auth(
            { bot_id: "8159992448", request_access: true },
            (data) => {
              if (data) resolve(data);
              else reject(new Error("Telegram login failed"));
            }
          );
        });

        // Сохраняем данные в localStorage
        localStorage.setItem("tgAuthData", JSON.stringify(tgData));
        toast.success("Телеграм привязан!");

        // Отправляем данные на сервер без редиректа
        const payload = {
          task_id: 6,
          user_input: "",
          extra_data: { additionalProp1: tgData },
        };
        const token = localStorage.getItem("token");

        await axios.post(
          "https://gs.sjp-asia.group/api/task/check_task",
          payload,
          {
            headers: { Authorization: token },
          }
        );

        toast.success("Задание отправлено на проверку");
        onSuccess && onSuccess();
      } else {
        toast.error("Telegram API не загружен");
      }
    } catch (err) {
      toast.error(err.message || "Ошибка при авторизации через Telegram");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      width: "100%",
      height: `${height}px`,
      display: "flex",
      padding: "12px 32px",
      fontWeight: "500",
      fontSize: "16px",
      lineHeight: "16px",
      justifyContent: "center",
      alignItems: "center",
      color: "white",
      gap: "10px",
      borderRadius: "4px",
      border: "none",
      background:
        "radial-gradient(50% 100% at 50% 0%, #00A2FF 0%, #0063A6 100%)",
      boxShadow:
        "0px 6px 14px 2px #0000004D, -1px -1px 0px 0px #00000059 inset, 1px 1px 0px 0px #FFFFFF5C inset",
    },
  };

  return (
    <div className="button-telegram-container">
      <button
        style={styles.container}
        onClick={handleTelegramLogin}
        disabled={loading || !widgetReady}
      >
        {loading ? "Загрузка..." : text ?? "Привязать через Telegram"}
      </button>
    </div>
  );
};

export default TgPopupTest;
