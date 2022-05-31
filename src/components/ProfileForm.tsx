import { useForm } from 'react-hook-form';

type Props = {
  submitFunction: (data: any) => Promise<void>;
};

const FormComponent = (props: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form
      onSubmit={handleSubmit(props.submitFunction)}
      className="mx-4 mt-4 flex flex-col"
    >
      {/* register your input into the hook by invoking the "register" function */}
      <label className="text-slate-800">Qual opção melhor define você?</label>
      <select
        {...register('type', { required: true })}
        className="my-2 h-8 rounded-md border-1 border-slate-300"
      >
        <option value="investidor">Investidor</option>
        <option value="founder">Founder</option>
      </select>
      <label className="my-2 text-slate-800">
        Qual o nome da sua empresa/fundo?
      </label>
      <input
        type={'text'}
        {...register('empresa', { required: true })}
        className="h-8 rounded-md border-1 border-slate-300 px-2"
      />
      {/* errors will return when field validation fails  */}
      {errors.exampleRequired && <span>This field is required</span>}

      <input
        type="submit"
        className="my-6 h-8 cursor-pointer rounded-md border-1 border-slate-300 px-2 text-slate-800 hover:bg-slate-100"
      />
    </form>
  );
};

export default FormComponent;
