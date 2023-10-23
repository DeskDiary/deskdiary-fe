import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import styled from 'styled-components';
import send from '../../../../images/send.svg';
import 공지사진 from '../../../../images/공지.png';
import Chat from './Chat';


const socket = io('http://localhost:5000');

type ChatBoxProps = {};

type MessageData = {
  message: string;
  user: string;
  time: string;
};

const ChatBox: React.FC<ChatBoxProps> = () => {
  const [username, setUserName] = useState('');
  const [chatActive, setChatActive] = useState(false);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    socket.on('received-message', (message: MessageData) => {
      setMessages(prevMessages => [...prevMessages, message]);
    });
    console.log('messages', messages);

    return () => {
      socket.off('received-message');
    };
  }, [messages, socket]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const now = new Date(Date.now());
    const time = `${now.getHours()}:${now.getMinutes()}`;

    const messageData = {
      message: newMessage,
      user: username,
      time: time,
    };

    newMessage !== ''
      ? socket.emit('send-message', messageData)
      : alert('메세지를 입력해주세요');
    setNewMessage('');
  };

  return (
    <Container col justify="start">
      <ChatImg src={공지사진} />
      <ChatList col justify="start" align="start" gap="15px">
        {messages.map((message, index) => {
          return <Chat key={index} message={message}/>;
        })}
      </ChatList>
      <ChatForm onSubmit={handleSubmit}>
        <UserInput
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
        ></UserInput>
        <SendButton type="submit">
          <img src={send} />
        </SendButton>
      </ChatForm>
    </Container>
  );
};

const FlexContainer = styled.div<{
  col?: boolean;
  align?: string;
  justify?: string;
  gap?: string;
}>`
  display: flex;
  flex-direction: ${props => (props.col ? 'column' : 'row')};
  align-items: ${props => (props.align ? props.align : 'center')};
  justify-content: ${props => (props.justify ? props.justify : 'center')};
  gap: ${props => props.gap || '0'};
`;

const ChatImg = styled.img`
margin: 5px auto 0 5px;
filter: grayscale(100%);
`

const SendMessageBox = styled(FlexContainer)`
  width: 100%;
  height: 10%;
  background-color: green;
`

const SendButton = styled.button`
  width: 35px;
  height: 35px;
  border: none;
  margin: 10px;
  background-color: transparent;
  cursor: pointer;
`;

const UserInput = styled.input`
  width: 100%;
  border-radius: 5px;
  border: none;
  padding: 10px 15px;
  font-size: 15px;
  &:focus {
    outline: none;
  }
  background-color: transparent;
  color: var(--gray-01);
`;

const ChatForm = styled.form`
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  height: 42px;
  width: 92%;
  margin: 12px;
  border: 1px solid var(--primary-01);
  border-radius: 5px;
  background-color: transparent;
`;

const ChatList = styled(FlexContainer)`
  height: 100%;
  width: calc(100% - 40px);
  padding: 20px;
  border-bottom: 1px solid var(--gray-05);
`;

const Container = styled(FlexContainer)`
  width: 100%;
  height: 100%;
  border: 1px solid var(--gray-07);
`;

export default ChatBox;
