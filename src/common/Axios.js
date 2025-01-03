import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Axios() {
  const token = window.localStorage.getItem("jwt");

  // If no token is found, we use 'None' (can adjust based on API behavior)
  const jwt = token ? `Bearer ${token}` : "None";

  const res = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    timeout: 10000, // Timeout set to 10 seconds
    headers: {
      Authorization: jwt,
      "Content-Type": "application/json",
      Accept: "*/*",
    },
  });

  // Interceptor for handling token expiration and other status codes
  res.interceptors.response.use(
    function (response) {
      return response; // If the response is successful, just return it
    },
    function (err) {
      if (axios.isCancel(err)) {
        // Handle cancellation explicitly if needed
        toast.warning("請求已被取消！");
      } else if (err.code === "ECONNABORTED") {
        // Specific handling for timeout
        toast.error("請求超時，請檢查您的網路連線或稍後再試！");
      } else if (err.response) {
        const status = err.response.status;

        // Handle different status codes
        switch (status) {
          case 401:
            toast.error("您的憑證已失效，請重新登入");
            window.localStorage.removeItem("jwt"); // Clear the invalid token
            window.location.href = "/login"; // Redirect to login page
            break;
          case 403:
            toast.warning("您沒有權限執行此動作，將跳回首頁！敬請見諒");
            window.location.href = "/"; // Redirect to the homepage
            break;
          case 429:
            toast.error("您在短期內發出太多請求，請稍後再試：）");
            window.location.href = "/"; // Redirect to the homepage
            break;
          case 503:
            toast.info("伺服器維護中，請稍後再試！");
            break;
          case 500:
            toast.error("發生伺服器意外錯誤，已通報開發者！請稍後再試，造成不便敬請見諒。");
            break;
        }
      } else if (err.request) {
        // Handle no response from the server (network issues, etc.)
        toast.error("無法連接到伺服器，請稍後再試！");
      } else {
        // Handle other unexpected errors
        toast.error(`發生錯誤: ${err.message}`);
      }

      return Promise.reject(err); // Always return a rejected promise to handle the error in the calling code
    }
  );

  return res;
}

export default Axios;
