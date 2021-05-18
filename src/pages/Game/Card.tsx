import styles from 'pages/Game/Card.module.scss';

const Card = ({
  text, type, onClick
}: {
  text: string;
  type?: 'question' | 'choiceA' | 'choiceB';
  onClick: () => void;
}) => {
  return (
    <div
      className={`${styles.card} ${type && styles[type]}`}
      onClick={onClick}
    >
      {text}
    </div>
  );
};

export default Card;
