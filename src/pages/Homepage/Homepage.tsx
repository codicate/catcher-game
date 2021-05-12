import styles from 'pages/Homepage/Homepage.module.scss';
import { Link } from 'react-router-dom';

const Homepage = () => {

  return (
    <div className={styles.homepage}>
      <Link className={styles.join} to='/join'>
        Join Room
      </Link>
      <Link className={styles.create} to='/create'>
        Create Room
      </Link>
    </div >
  );
};

export default Homepage;
