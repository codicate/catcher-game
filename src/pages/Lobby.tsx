
import { useAppSelector } from 'app/hooks';
import { selectRoomInfo } from 'app/roomSlice';

const Lobby = () => {
  const roomInfo = useAppSelector(selectRoomInfo);
  console.log('roomInfo', roomInfo);
  return (
    <div>
      <p>{roomInfo.roomId}</p>
    </div>
  );
};

export default Lobby;
