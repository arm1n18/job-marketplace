import axios from "axios";

export const LogOutUser = async () => {
  try {
    // Отправка запроса на сервер для выхода
    const response = await axios.post(
      "http://192.168.0.106:8080/auth/logout",
      {},
      { withCredentials: true }
    );

  } catch (error) {
    console.error("Ошибка при отправке запроса на выход", error);
  }
};
