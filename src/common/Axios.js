import axios from "axios";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Axios() {
  if (window.localStorage.getItem("jwt") === null) {
    window.localStorage.setItem("jwt", "None");
  }
  let jwt = `Bearer ${window.localStorage.getItem("jwt")}`;
  const res = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
    timeout: 10000,
    headers: {
      Authorization: jwt,
      "Content-Type": "Application/json",
      Accept: "*/*",
    },
  });

  // 攔截器，攔截jwtToken失效
  res.interceptors.response.use(
    function (res) {
      return res;
    },
    function (err) {
      if (err.response && err.response.status === 401) {
        toast.error("您的憑證已失效，請重新登入");
        return <Navigate to="/login" />;
      } else if (err.response && err.response.status === 403) {
        toast.warning("您沒有權限執行此動作，將跳回首頁！敬請見諒");
        return <Navigate to="/" />;
      } else if (err.response && err.response.status === 503) {
        toast.info("伺服器維護中，請稍後再試！");
        return <Navigate to="/" />;
      } else if (err.response && err.response.status === 500) {
        toast.error("發生伺服器意外錯誤，已通報開發者！請稍後再試，造成不便敬請見諒．");
      }
      return Promise.reject(err);
    }
  );

  return res;
}

export default Axios;
