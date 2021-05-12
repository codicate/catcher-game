import styles from 'pages/Homepage/Homepage.module.scss';
import { Link } from 'react-router-dom';

const Homepage = () => {

  return (
    <div id={styles.homepage}>
      <Link id={styles.join} to='/join'>
        Join Room
      </Link>
      <Link id={styles.create} to='/create'>
        Create Room
      </Link>
    </div >
  );
};

export default Homepage;
