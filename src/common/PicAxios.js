import axios from "axios"
import { attachCsrfHeader } from "./Axios"

// 認證方式與 Axios.js 相同（HttpOnly cookie + X-CSRFToken），不再使用 localStorage 的 jwt。
function PicAxios(){
  const res = axios.create(
    {
      baseURL: process.env.REACT_APP_BASE_URL,
      timeout:10000,
      withCredentials: true,
      headers:{
        'Content-Type':'Application/json',
        'Accept':'*/*',
      }
    }
  )

  res.interceptors.request.use(attachCsrfHeader);

  // 攔截器，攔截憑證失效
  res.interceptors.response.use(
    function (res) {
      return res;
    },
    function (err) {
      if (err.response && err.response.status === 401) {
        alert("您的憑證已失效，請重新登入");
      }
      return Promise.reject(err);
    }
  );
  return res;
}


export default PicAxios
