import React from 'react';
import styled from 'styled-components';
import RoomList from '../home/components/RoomList';

type hobbyCategoryProps = {};

const hobbyCategory: React.FC<hobbyCategoryProps> = () => {
  return (
    <Container col>
      <Info>랭킹</Info>

      <Rooms col>
        <RoomList label="전체 취미룸" show="fetchHobby" />
        {/* <RoomList label="전체 취미룸" show="fetchHobby" /> */}
      </Rooms>
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

const Rooms = styled(FlexContainer)``;

const Container = styled(FlexContainer)`
  width: 1525px;
  height: 100%;
  padding-top: 30px;
`;

const Info = styled(FlexContainer)`
  width: 100%;
  height: 243px;
  border: 1px solid black;
  font-size: 40px;
  font-weight: 800;
`;

export default hobbyCategory;