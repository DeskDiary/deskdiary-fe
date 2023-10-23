import styled from '@emotion/styled';
import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { logo, kakao, google } from '../../images';
import { colorChecked, unchecked, XIcon } from '../../images';

import { UserAtom } from '../../recoil/UserAtom';

import { useMutation } from 'react-query';

type JoinProps = {};

const Join: React.FC<JoinProps> = () => {
  const navigate = useNavigate();

  const [user, setUser] = useRecoilState(UserAtom);

  const [confirmPassword, setconfirmPassword] = useState('');
  const [isAgreeChecked, setIsAgreeChecked] = useState(false);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [nicknameError, setNicknameError] = useState<string | null>(null);
  const [matchPasswordError, setMatchPasswordError] = useState<string | null>(
    null,
  );

  const [focusedInput, setFocusedInput] = useState<
    'email' | 'password' | 'confirmPassword' | 'nickname' | null
  >(null);

  const handleClearInput = (
    type: 'email' | 'password' | 'confirmPassword' | 'nickname',
  ) => {
    switch (type) {
      case 'email':
        setUser(prevUser => ({ ...prevUser, email: '' }));
        break;
      case 'password':
        setUser(prevUser => ({ ...prevUser, password: '' }));
        break;
      case 'confirmPassword':
        console.log('클릭클릭');
        setconfirmPassword('');
        break;
      case 'nickname':
        setUser(prevUser => ({ ...prevUser, nickname: '' }));
        break;
    }
  };

  const onClickAgree = () => {
    setIsAgreeChecked(!isAgreeChecked);
  };

  const blurConfirmHandler = async () => {
    if (confirmPassword !== user.password) {
      setMatchPasswordError('비밀번호가 일치하지 않습니다.');
    } else {
      setMatchPasswordError(null);
    }
    return;
  };

  const handleFocusInput = (
    type: 'email' | 'password' | 'confirmPassword' | 'nickname',
  ) => {
    setFocusedInput(type);
  };

  const handleBlurInput = () => {
    setFocusedInput(null);
  };

  const joinMutation = useMutation(
    (userData: typeof user) =>
      axios.post(`${process.env.REACT_APP_SERVER_URL!}/auth/join`, userData),
    {
      onSuccess: () => {
        alert('회원가입 성공');
        navigate('/login');
      },
      onError: (error: any) => {
        if (error.response) {
          const message = error.response.data.message;
          console.log(message);

          switch (true) {
            case message.includes('이메일이 이미'):
              setEmailError('이메일이 이미 사용중입니다.');
              break;
            case message.includes('이메일이 형식이'):
              setEmailError('이메일 형식이 아닙니다');
              break;
            case message.includes('이메일이 비어'):
              setEmailError('이메일이 비어 있으면 안됩니다.');
              break;
            case message.includes('닉네임이 비어 있으면 안됩니다.'):
              setNicknameError('닉네임이 비어 있으면 안됩니다.');
              break;
            case message.includes(
              '닉네임은 한글, 알파벳, 숫자만 포함해야 합니다',
            ):
              setNicknameError('닉네임은 특수문자가 포함될 수 없습니다.');
              break;
            case message.includes('비밀번호가 비어 있으면 안됩니다.'):
              setPasswordError('비밀번호가 비어 있으면 안됩니다.');
              break;
            case message.includes(
              '비밀번호는 대문자, 소문자, 숫자, 특수문자를 각각 하나 이상 포함해야 합니다',
            ):
              setPasswordError(
                '비밀번호는 대문자, 소문자, 숫자, 특수문자를 각각 하나 이상 포함한 8자 이상 이어야 합니다',
              );
              break;
            case message.includes('비밀번호는 8자 이상이어야 합니다'):
              setPasswordError('비밀번호는 8자 이상이어야 합니다');
              break;
            default:
              console.log('회원가입에 실패했습니다. 관리자에게 문의해주세요.');
          }
        }
      },
    },
  );

  const onSubmitJoin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    joinMutation.mutate(user);
  };

  return (
    <JoinForm onSubmit={onSubmitJoin}>
      <Logo to="/"></Logo>
      <Title>회원가입</Title>
      <JoinList>
        <Joincontent>
          <JoinLabel focused={focusedInput === 'email'}>이메일</JoinLabel>
          <InputBox focused={focusedInput === 'email'}>
            <JoinInput
              type="text"
              placeholder="예시 ) deskdiary@deskdiary.com"
              onChange={e => setUser({ ...user, email: e.target.value })}
              onFocus={() => handleFocusInput('email')}
              onBlur={() => {
                setEmailError(null);
                handleBlurInput();
              }}
              value={user.email}
            />
            {user.email.length !== 0 && (
              <Clear type="button" onClick={() => handleClearInput('email')}>
                <img src={XIcon} />
              </Clear>
            )}
          </InputBox>
          <Relative>
            {emailError ? <ErrorMessage>{emailError}</ErrorMessage> : null}
          </Relative>
        </Joincontent>

        <Joincontent>
          <JoinLabel focused={focusedInput === 'password'}>비밀번호</JoinLabel>
          <InputBox focused={focusedInput === 'password'}>
            <JoinInput
              type="password"
              placeholder="영어 대소문자,숫자,특수문자 포함 8~16자"
              onChange={e => setUser({ ...user, password: e.target.value })}
              onFocus={() => handleFocusInput('password')}
              onBlur={() => {
                setPasswordError(null);
                blurConfirmHandler();
                handleBlurInput();
              }}
              value={user.password}
            />
            {user.password.length !== 0 && (
              <Clear type="button" onClick={() => handleClearInput('password')}>
                <img src={XIcon} />
              </Clear>
            )}
          </InputBox>

          <Relative>
            {passwordError ? (
              <ErrorMessage>{passwordError}</ErrorMessage>
            ) : null}
          </Relative>
        </Joincontent>

        <Joincontent>
          <JoinLabel focused={focusedInput === 'confirmPassword'}>
            비밀번호 확인
          </JoinLabel>
          <InputBox focused={focusedInput === 'confirmPassword'}>
            <JoinInput
              type="password"
              placeholder="비밀번호를 한 번 더 입력해주세요"
              value={confirmPassword}
              onChange={e => setconfirmPassword(e.target.value)}
              onFocus={() => handleFocusInput('confirmPassword')}
              onBlur={() => {
                blurConfirmHandler();
                handleBlurInput();
              }}
            />
            {confirmPassword.length !== 0 && (
              <Clear
                type="button"
                onClick={() => handleClearInput('confirmPassword')}
              >
                <img src={XIcon} />
              </Clear>
            )}
          </InputBox>
          <Relative>
            {matchPasswordError ? (
              <ErrorMessage>{matchPasswordError}</ErrorMessage>
            ) : null}
          </Relative>
        </Joincontent>

        <Joincontent>
          <JoinLabel focused={focusedInput === 'nickname'}>닉네임</JoinLabel>
          <InputBox focused={focusedInput === 'nickname'}>
            <JoinInput
              type="text"
              placeholder="4~12자"
              onFocus={() => handleFocusInput('nickname')}
              onChange={e => setUser({ ...user, nickname: e.target.value })}
              onBlur={() => {
                setNicknameError(null);
                handleBlurInput();
              }}
              value={user.nickname}
            />
            {user.nickname.length !== 0 && (
              <Clear type="button" onClick={() => handleClearInput('nickname')}>
                <img src={XIcon} />
              </Clear>
            )}
          </InputBox>
          <Relative>
            {nicknameError ? (
              <ErrorMessage>{nicknameError}</ErrorMessage>
            ) : null}
          </Relative>
        </Joincontent>

        <AgreeBox>
          <AgreeCheck type="checkbox" onClick={onClickAgree}></AgreeCheck>
          <AgreeLink to="/">
            <span>(필수)</span>통합서비스 이용약관 및 개인정보 처리방침에 동의
            합니다.
          </AgreeLink>
        </AgreeBox>
      </JoinList>
      <JoinButton type="submit" disabled={!isAgreeChecked}>
        JOIN
      </JoinButton>
      <SocialLoginText>SNS 계정으로 시작하기</SocialLoginText>
      <SocialLoginGroup>
        <SocialLoginLink
          to="/"
          onClick={() => {
            const SERVER_URL = process.env.REACT_APP_SERVER_URL;

            const kakaoOauthURL = `https://kauth.kakao.com/oauth/authorize?response_type=code&redirect_uri=${encodeURIComponent(
              `${SERVER_URL}/kakao-callback`,
            )}&client_id=${process.env.REACT_APP_KAKAO_CLIENT_ID}`;

            window.location.href = kakaoOauthURL;
          }}
        >
          <img src={kakao} />
        </SocialLoginLink>

        <SocialLoginLink to="/">
          <img src={google} />
        </SocialLoginLink>
      </SocialLoginGroup>
    </JoinForm>
  );
};

const Logo = styled(Link)`
  background: url(${logo}) no-repeat center;
  width: 70px;
  height: 70px;
`;

const Clear = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: none;
  cursor: pointer;
`;

const InputBox = styled.div<{ focused: boolean }>`
  display: flex;
  width: 370px;
  height: 28px;
  padding: 10px 15px;
  align-items: center;
  gap: 10px;
  border-radius: 5px;
  border: 1px solid
    ${props => (props.focused ? 'var(--primary-01)' : 'var(--gray-07)')};
  background-color: white;

  &:focus {
    outline-color: var(--primary-01);
  }
`;

const ErrorMessage = styled.div`
  width: 400px;
  padding: 10px;
  color: var(--system-error);
  font-size: 15px;

  top: 85px;
`;

const AgreeBox = styled.div`
  height: 48px;
  width: 100%;

  display: flex;
  flex-direction: row;
  justify-content: space-betweet;
  align-items: center;
`;

const SocialLoginLink = styled(Link)`
  width: 72px;
  height: 72px;

  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 130px;
`;

const SocialLoginText = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 48px;
  margin-top: 8px;
`;

const SocialLoginGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 30px;
`;

const JoinButton = styled.button<{ disabled: boolean }>`
  width: 400px;
  height: 60px;
  padding: 10px;
  justify-content: center;
  align-items: center;

  border: none;
  color: #fff;
  font-size: 24px;
  font-weight: 500;
  line-height: 123.5%; /* 29.64px */

  background-color: rgba(
    0,
    197,
    255,
    ${props => (props.disabled ? '0.2' : '1.0')}
  );
  cursor: ${props => (props.disabled ? '' : 'pointer')};
`;

const AgreeLink = styled(Link)`
  font-size: 14px;
  width: 100%;
  color: var(--primary-01);
  text-decoration: underline;
  font-weight: 500;
  line-height: 123.5%;
  letter-spacing: 0.25px;
  > span {
    color: var(--gray-07);
  }
`;

const AgreeCheck = styled.input`
  appearance: none;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: white;
  border: 1px solid var(--primary-01);
  display: inline-block;
  background: url(${unchecked}) no-repeat center;
  //체크했을 때의post 스타일
  &:checked {
    background: url(${colorChecked}) no-repeat center;
    background-color: var(--primary-01);
  }
`;

const JoinForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  width: 400px;
  height: 100%;
  padding: 110px 0;
`;

const JoinLabel = styled.div<{ focused: boolean }>`
  width: 380px;
  padding: 10px;
  color: ${props => (props.focused ? 'var(--primary-01)' : 'var(--gray-07)')};
  font-size: 15px;
`;

const Joincontent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
`;

const Relative = styled.div`
  height: 40px;
`;

const JoinInput = styled.input`
  width: 100%;
  height: 26px;
  border-radius: 5px;
  border: none;
  background: #fff;
  font-size: 15px;

  ::placeholder {
    opacity: 0.3;
    font-weight: 400;
  }

  &:focus {
    outline: none;
  }
`;

const JoinList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
`;

const Title = styled.div`
  color: #000;
  text-align: center;
  font-size: 32px;
  width: 100%;
  margin-top: 24px;
  margin-bottom: 54px;
`;

export default Join;
