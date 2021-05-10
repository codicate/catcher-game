import { useState, FormEvent } from 'react';

import Input, { InputOptions, ChangeHandler } from 'components/Form/Input';

type SubmitFn = (inputItems: Record<string, string>) => void | boolean | Promise<boolean | undefined>;

const Form = ({
  id,
  submitFn,
  children,
  inputItems
}: {
  id?: string;
  submitFn?: SubmitFn;
  children?: React.ReactNode;
  inputItems: [
    name: string,
    label?: string,
    inputOptions?: InputOptions
  ][];
}) => {
  const defaultItems = inputItems.reduce<Record<string, string>>((
    dict, item
  ) => {
    dict[item[0]] = item[2]?.defaultValue || '';
    return dict;
  }, {});

  const [input, setInput] = useState(defaultItems);

  const changeHandler: ChangeHandler = (e) => {
    const { name, value } = e.target;

    setInput({
      ...input,
      [name]: value
    });
  };

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();

    const reset = submitFn
      ? await submitFn(input)
      : true;

    reset && setInput(defaultItems);
  };

  return (
    <form
      id={id}
      onSubmit={submitHandler}
    >
      {
        inputItems.map((item, idx) => (
          <Input
            key={idx}
            changeHandler={changeHandler}
            name={item[0]}
            value={input[item[0]]}
            label={item[1]}
            {...item[2]}
          />
        ))
      }
      {children}
    </form>
  );
};

export default Form;