import styles from 'components/RoomInfo.module.scss';

const RoomInfo = ({
  roomName, roomId
}: {
  roomName: string;
  roomId: string;
}) => {
  return (
    <button
      className={styles.roomInfo}
      onClick={async () => {
        await navigator.clipboard.writeText(roomId);
      }}
      onMouseLeave={(e) => {
        (e.target as HTMLButtonElement).blur();
      }}
    >
      <span>{roomName}</span>
      <span className={styles.gap}></span>
      <span>{roomId}</span>
    </button>
  );
};

export default RoomInfo;
