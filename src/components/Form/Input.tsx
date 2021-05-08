import styles from 'components/Form/Input.module.scss';

export interface inputOptions {
  option?: 'input' | 'textarea';
  type?: string,
  defaultValue?: string,
  required?: boolean;
  readOnly?: boolean;
  [attr: string]: any;
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
  const InputOrTextarea = option || 'input';

  return (
    <div className={styles.group}>
      <InputOrTextarea
        className={(option === 'textarea') ? styles.textarea : styles.input}
        onChange={changeHandler}
        {...(readOnly ? { defaultValue: value, readOnly: true } : { value: value })}
        {...props}
      />
      {
        label && (
          <label
            className={`${value ? styles.shrink : ''}`}
          >
            {label}
          </label>
        )
      }
    </div>
  );
};

export default Input;
