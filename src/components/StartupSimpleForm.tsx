import React from 'react';
import { useForm } from 'react-hook-form';

import RequiredMsg from './RequiredMsg';
import { StageSelector } from './StageSelector';
import { ThesisSelector } from './ThesisSelector';

export function StartupSimpleForm({
  onSubmit,
}: {
  onSubmit: (data: {
    name: string;
    url: string;
    linkedin: string;
    stage: null;
    thesis: null;
  }) => any;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<{
    name: string;
    url: string;
    linkedin: string;
    stage: null;
    thesis: null;
  }>();

  return (
    <form className="py-t flex flex-col px-8" onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-2 flex justify-center gap-x-4">
        <div className="flex w-full flex-col">
          <label className="text-xs text-neutral-600">Nome da Startup</label>
          <input
            type="text"
            {...register('name', { required: true })}
            className="w-full rounded border-1 border-neutral-300 py-1 px-2 text-sm text-neutral-700"
          />
          {errors.name && <RequiredMsg />}
        </div>
        {/* <div className="w-full">
          <StateSelect control={control} />
          {errors.state && <RequiredMsg />}
        </div> */}
      </div>

      <div className="flex flex-col gap-x-4 md:flex-row">
        <div className="mt-2 flex w-full flex-col">
          <label className="text-xs text-neutral-600">Website</label>
          <input
            type={'url'}
            {...register('url')}
            className="w-full rounded border-1 border-neutral-300 py-1 px-2 text-sm text-neutral-700"
          />
        </div>
      </div>

      <div className="flex flex-col gap-x-4 md:flex-row">
        <div className="mt-2 flex w-full flex-col">
          <label className="text-xs text-neutral-600">
            LinkedIn do Fundador
          </label>
          <input
            type={'url'}
            {...register('linkedin')}
            className="w-full rounded border-1 border-neutral-300 py-1 px-2 text-sm text-neutral-700"
          />
        </div>
      </div>

      <div className="mt-2 flex w-full flex-col gap-4 md:flex-row">
        <div className="w-full">
          <StageSelector control={control} />
          {errors.stage && <RequiredMsg />}
        </div>
      </div>
      <div className="mt-2 flex w-full flex-col gap-4 md:flex-row">
        <div className="w-full">
          <ThesisSelector control={control} isMulti />
          {errors.thesis && <RequiredMsg />}
        </div>
      </div>

      {/* <div className="mt-2 flex w-full flex-col">
        <label className="text-xs text-neutral-600">Breve descrição</label>
        <textarea
          rows={4}
          {...register('description')}
          className="w-full resize-none rounded border-1 border-neutral-300 py-1 px-2 text-sm text-neutral-700"
        />
      </div> */}
      <div className="flex w-full justify-center">
        <input
          className="my-8 w-20 cursor-pointer rounded bg-neutral-700 p-1 py-2 text-sm font-semibold text-white"
          type="submit"
          value={'Enviar'}
        />
      </div>
    </form>
  );
}
