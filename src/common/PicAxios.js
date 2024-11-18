import axios from "axios"
import { Navigate } from "react-router-dom"


function PicAxios(){
  // const navigate = useNavigate()
  if (window.localStorage.getItem('jwt') === null){
  window.localStorage.setItem('jwt','None')
  }
  let jwt = `Bearer ${(window.localStorage.getItem('jwt'))}`
  const res = axios.create(
    {
      baseURL: process.env.REACT_APP_BASE_URL,
      timeout:10000,
      headers:{
        'Authorization':jwt,
        'Content-Type':'Application/json',
        'Accept':'*/*',
        'Access-Control-Allow-Origin':'*'
      }
    }
  )

  // 攔截器，攔截jwtToken失效
  res.interceptors.response.use(
    function (res) {
      return res;
    },
    function (err) {
      if (err.response && err.response.status === 401) {
        alert("您的憑證已失效，請重新登入");
        <Navigate to="/LoginPage"/>;
      }
      return Promise.reject(err);
    }
  );
  return res;
}


export default PicAxios