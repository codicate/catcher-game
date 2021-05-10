import styles from 'components/Form/Input.module.scss';
import { useRef } from 'react';

export interface InputOptions {
  option?: 'input' | 'textarea';
  type?: string,
  defaultValue?: string,
  required?: boolean;
  readOnly?: boolean;
  selectAllOnFocus?: boolean;
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
  selectAllOnFocus,
  ...props
}: {
  changeHandler?: ChangeHandler;
  name?: string;
  label?: string;
  value: string;
} & InputOptions
) => {
  const InputOrTextarea = option || 'input';
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

  return (
    <InputOrTextarea
      ref={inputRef}
      className={(
        option === 'textarea'
      ) ? styles.textarea
        : styles.input
      }
      onChange={changeHandler}
      {...((selectAllOnFocus)
        && { onFocus: () => inputRef.current?.select() }
      )}
      {...((readOnly)
        ? { defaultValue: value, readOnly: true }
        : { value: value }
      )}
      {...props}
    />
  );
};

export default Input;
