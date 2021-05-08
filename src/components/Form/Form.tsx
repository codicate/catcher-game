import { FormEvent, useState } from 'react';

import Input, { inputOptions, ChangeHandler } from 'components/Form/Input';

type SubmitFn = (inputItems: {}) => void | boolean | Promise<boolean | undefined>;

const Form = ({
  submitFn, children, inputItems
}: {
  submitFn?: SubmitFn;
  children?: React.ReactNode;
  inputItems: [
    name: string,
    label?: string,
    inputOptions?: inputOptions
  ][];
}) => {
  const defaultItems = inputItems.reduce((
    dict: { [name: string]: string; }, item
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
    <form onSubmit={submitHandler}>
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