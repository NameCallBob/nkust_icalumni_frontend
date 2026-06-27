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
      // 可以在這裡添加成功狀態的處理（如有需要）
      if (response.status === 201) {
        toast.success("資料新增成功！");
      } else if (response.status === 204) {
        toast.success("操作已成功完成！");
      }
      return response; // If the response is successful, just return it
    },
    function (err) {
      if (axios.isCancel(err)) {
        // Handle cancellation explicitly if needed
        toast.warning("請求已被取消，別擔心，這不會影響您的操作。");
      } else if (err.code === "ECONNABORTED") {
        // Specific handling for timeout
        toast.error("連線似乎有點慢，請檢查網路後再試一次。我們隨時都在這裡等您！");
      } else if (err.response) {
        const status = err.response.status;

        // Handle different status codes
        switch (status) {
          // case 400:
          //   toast.warning("您提交的資料格式可能有誤，請重新檢查後再試。我們很樂意協助您！");
          //   break;
          // case 401:
          //   toast.info("您的登入狀態已過期，請重新登入以繼續使用服務。");
          //   window.localStorage.removeItem("jwt"); // Clear the invalid token
          //   window.location.href = "/login"; // Redirect to login page
          //   break;
          case 403:
            toast.warning("此功能需要特定權限，我們將帶您回到首頁。如有疑問，請聯繫客服。");
            window.location.href = "/"; // Redirect to the homepage
            break;
          // case 404:
          //   toast.warning("抱歉，您尋找的資源不存在。請確認網址是否正確，或回到首頁尋找其他精彩內容。");
          //   break;
          case 405:
            toast.warning("系統無法處理此操作方式，請嘗試其他方法或回到上一頁。");
            break;
          case 406:
            toast.warning("抱歉，系統無法提供您請求的格式。請嘗試使用其他格式或聯繫客服。");
            break;
          case 409:
            toast.warning("資料似乎發生了衝突，可能是已經存在相同資料。請重新確認後再試！");
            break;
          case 413:
            toast.warning("您上傳的資料太大了，請嘗試減少檔案大小後再試。我們期待您的成功上傳！");
            break;
          case 422:
            toast.warning("您提供的資料無法被處理，請依照提示修改後再次提交。");
            break;
          case 429:
            toast.info("系統正在努力處理大量請求，請稍候片刻再重試。感謝您的耐心等候！");
            break;
          case 500:
            toast.error("系統暫時出現了一點小問題，我們的工程師已收到通知並正在全力修復。請稍後再試，謝謝您的理解與包容。");
            break;
          case 502:
            toast.error("連接伺服器時出現問題，這通常是暫時性的。請稍後再試，我們會盡快恢復服務。");
            break;
          case 503:
            toast.info("系統正在進行維護升級，以提供您更好的服務體驗。請稍後再回來，我們很期待您的再次造訪！");
            break;
          case 504:
            toast.error("伺服器回應時間較長，這可能是網路壅塞造成的。請稍後再試，感謝您的耐心！");
            break;
          default:
            // toast.error("發生了一些意外狀況，但別擔心，這不是您的錯。請稍後再試或聯繫客服尋求協助。");
            break;
        }
      } else if (err.request) {
        // Handle no response from the server (network issues, etc.)
        toast.error("無法連接到伺服器，可能是網路波動造成的。請確認您的網路連線後再試一次，我們隨時都在這裡等您！");
      } else {
        // Handle other unexpected errors
        toast.error(`發生了一點小插曲: ${err.message}。別擔心，休息一下再試試看吧！`);
      }

      return Promise.reject(err); // Always return a rejected promise to handle the error in the calling code
    }
  );

  return res;
}

export default Axios;