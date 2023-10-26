import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { toast } from 'sonner';
import styled from '@emotion/styled';
import CreateRoomModal from '../../../pages/home/components/CreateRoomModal';
import { getCookie, setTokenCookie } from '../../../auth/cookie';
import addroom from '../../../images/main/addroom.svg';
import { fetchUser } from '../../../axios/api';
import profile from '../../../images/profile.png';
import axios from 'axios';

import { useQuery } from 'react-query';

type MainTopProps = {};

const MainTop: React.FC<MainTopProps> = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [openCreateRoom, setOpenCreateRoom] = useState(false);
  const [user, setUser] = useState<user>();

  const token = getCookie('token');

  const [nickname, setNickname] = useState('');

  const onClickCreateRoomButton = () => {
    setOpenCreateRoom(!openCreateRoom);
  };

  const clickSearch = () => {
    setIsFocused(true);
  };

  const blurSearch = () => {
    setIsFocused(false);
  };

  const onclickSearch = () => {
    toast.message('search click');
  };

  const { data } = useQuery<user>('user', fetchUser, {
    staleTime: Infinity, // 캐시 시간을 무한대로 설정
  });
  console.log('MainTop 렌더링')

  // const fetchUserProfile = async () => {
  //   const { data } = await axios.get(
  //     `${process.env.REACT_APP_SERVER_URL!}/me/profile`,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     },
  //   );
  //   setUser(data);
  // };

  // useEffect(() => {
  //   if (token) {
  //     fetchUserProfile();
  //   }
  // }, [token]);

  return (
    <NavHeader>
      {token ? (
        <User to="/mypage/:id">
          <img
            src={data?.profileImage ? data.profileImage : profile}
            alt="profile image"
          ></img>
          <p>{data?.nickname}</p>
          <span>님의 마이페이지</span>
        </User>
      ) : (
        <User to="/login">
          <img src={profile} alt="login"></img>
          <p>로그인이 필요합니다.</p>
        </User>
      )}

      {/* <Search isFocused={isFocused} justify="space-between">
        <SearchInput
          onFocus={clickSearch}
          onBlur={blurSearch}
          placeholder="검색어입력"
        />
        <SearchButton onClick={onclickSearch}>
          <SearchIcon />
        </SearchButton>
      </Search> */}

      <Link to="/join">회원가입</Link>
      <Link to="/login">로그인</Link>

      <CreateRoomButton type="button" onClick={onClickCreateRoomButton}>
        <img src={addroom} alt="add room button" />
        방만들기
      </CreateRoomButton>
      {openCreateRoom && (
        <CreateRoomModal setOpenCreateRoom={setOpenCreateRoom} user={data!} />
      )}
    </NavHeader>
  );
};

const User = styled(Link)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  font-size: 12px;
  font-weight: 500;
  color: var(--gray-07);
  width: 250px;

  > img {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: #d9d9d9;
    margin-right: 10px;
  }

  > p {
    font-size: 16px;
    color: black;
    overflow: hidden;
  }

  > span {
    margin-left: auto;
  }
`;

const CreateRoomButton = styled.button`
  display: flex;
  width: 200px;
  padding: 10px;
  justify-content: center;
  align-items: center;
  background-color: var(--primary-01);
  border: none;
  font-size: 14px;

  min-width: 100px;
  color: var(--bw-whtie);

  > img {
    width: 24px;
    height: 24px;
    margin-right: 10px;
  }
`;

const NavHeader = styled.div`
  width: 1200px;

  padding-top: 20px;
  margin-bottom: 50px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Search = styled.div<{ isFocused: boolean }>`
  width: 50%;
  height: 48px;
  border: 2px solid var(--gray-06);
  padding: 10px;
  border-radius: 5px;
  background-color: white;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 19px;
  border: none;
  font-size: 15px;
  &:focus {
    outline: none;
  }
  ::placeholder {
    color: rgba(0, 0, 0, 0.2);
  }
`;

const SearchButton = styled.div`
  cursor: pointer;
  opacity: 0.5;
`;

export default MainTop;
