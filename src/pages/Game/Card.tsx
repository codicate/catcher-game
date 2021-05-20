import styles from 'pages/Game/Card.module.scss';

const Card = ({
  text, type, onClick
}: {
  text: string;
  type: string;
  onClick?: () => void;
}) => {
  return (
    <div
      className={`${styles.card} ${type && type.split(' ').map(type => styles[type]).join(' ')}`}
      onClick={onClick}
    >
      {text}
    </div>
  );
};

export default Card;
