import Form from 'components/Form/Form';

const Header = () => {
  return (
    <div>
      <button>
        Create Room
      </button>
      <Form
        submitFn={() => {
          return true;
        }}
        inputItems={[
          ['join', 'Join Room', { type: 'number' }]
        ]}
      />
    </div>
  );
};

export default Header;
