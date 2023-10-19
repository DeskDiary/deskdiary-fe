import axios from "axios";
import { getCookie, setTokenCookie } from '../auth/cookie';

const token = getCookie('token');

// user 프로필 가져오기
export const fetchUser = async () => {
  const { data } = await axios.get(
    `${process.env.REACT_APP_SERVER_URL!}/auth/profile`,
    {
      headers: {
        Authorization: `Bearer ${token}`, // 여기서 토큰을 헤더에 추가해줘
      },
    },
  );
  console.log('main top 유저정보 data', data);
  return data;
};

const instance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_URL,
  withCredentials: true
});

instance.interceptors.request.use(
  // 요청을 보내기 전 수행되는 함수
  function (config) {
    console.log("인터셉터 요청 성공");
    return config;
  },
  // 오류 요청을 보내기 전 수행되는 함수
  function (error) {
    console.log("인터셉터 요청 오류");
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  // 응답을 내보내기 전 수행되는 함수
  function (response) {
    console.log("인터셉터 응답 받았습니다");
    return response;
  },
  // 오류 응답을 내보내기 전 수행되는 함수
  function (error) {
    console.log("인터셉터 응답 오류 발생");
    return Promise.reject(error);
  }
);

export default instance;