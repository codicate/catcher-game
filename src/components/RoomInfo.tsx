import styles from 'components/RoomInfo.module.scss';

const RoomInfo = ({
  roomName, roomId, theme
}: {
  roomName: string;
  roomId: string;
  theme?: string;
}) => {
  return (
    <button
      className={`${styles.roomInfo} ${(theme || '')}`}
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
