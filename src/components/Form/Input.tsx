import styles from 'components/Form/Input.module.scss';

export interface inputOptions {
  option?: 'input' | 'textarea';
  type?: string,
  defaultValue?: string,
  required?: boolean;
  readOnly?: boolean;
}

export type ChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;

const Input = ({
  changeHandler,
  label,
  defaultValue,
  value,
  option,
  readOnly,
  ...props

}: {

  changeHandler?: ChangeHandler;
  name?: string;
  label?: string;
  value: string;

} & inputOptions
) => {
  return (
    <div className={styles.group}>
      {(
        option === 'textarea'
      ) ? (
        <textarea
          className={styles.textarea}
          onChange={changeHandler}
          {...(readOnly ? { defaultValue: value } : { value: value })}
          {...props}
        />
      ) : (
        <input
          className={styles.input}
          onChange={changeHandler}
          {...(readOnly ? { defaultValue: value } : { value: value })}
          {...props}
        />
      )}
      {
        label && (
          <label
            className={`${defaultValue ? styles.shrink : ''}`}
          >
            {label}
          </label>
        )
      }
    </div>
  );
};

export default Input;
