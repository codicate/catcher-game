import styles from 'components/Form/Input.module.scss';
import { createElement } from 'react';

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
  const properties = {
    className: (option === 'textarea') ? styles.textarea : styles.input,
    onChange: changeHandler,
    ...(readOnly ? { defaultValue: value, readOnly: true } : { value: value }),
    ...props
  };

  return (
    <div className={styles.group}>
      { createElement(option || 'input', { ...properties })}
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
