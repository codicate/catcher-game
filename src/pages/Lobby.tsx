import { useContext } from 'react';
import { Context } from 'App';

const Lobby = () => {
  const { roomId } = useContext(Context);

  return (
    <div>
      <p>{roomId}</p>
    </div>
  );
};

export default Lobby;
