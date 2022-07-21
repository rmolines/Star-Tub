import React from 'react';
import { useForm } from 'react-hook-form';

import { EVCFFormValues } from '@/types/companyTypes';

import { FundSelector } from './FundSelector';
import RequiredMsg from './RequiredMsg';

export function EVCFForm({
  onSubmit,
}: {
  fillInfo?: boolean;
  onSubmit: (data: EVCFFormValues) => any;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EVCFFormValues>();
  return (
    <form className="flex flex-col px-2" onSubmit={handleSubmit(onSubmit)}>
      {/* register your input into the hook by invoking the "register" function */}

      <div className="mt-2 flex justify-center gap-2 px-2">
        <div className="flex w-full flex-col">
          <label className="text-xs text-slate-600">Nome</label>
          <input
            type="text"
            {...register('firstName', { required: true })}
            className="w-full rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700"
          />
          {errors.firstName && <RequiredMsg />}
        </div>
        <div className="flex w-full flex-col">
          <label className="text-xs text-slate-600">Sobrenome</label>
          <input
            type="text"
            {...register('lastName', { required: true })}
            className="w-full rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700"
          />
          {errors.lastName && <RequiredMsg />}
        </div>
      </div>
      <div className="mt-2 px-2">
        <div className="flex w-full flex-col gap-4 sm:flex-row">
          <div className="w-full">
            <FundSelector control={control} />
          </div>
        </div>

        {/* 
      <h1 className="font-medium text-slate-600">Informações do fundo</h1>

        <div className="my-2 flex items-center">
          <div className="w-full border-b-1 border-slate-200" />
          <div className="px-2 text-sm text-slate-600">ou</div>
          <div className="w-full border-b-1 border-slate-200" />
        </div>

        <div className="flex w-full justify-start gap-2">
          <div className="flex w-full flex-col">
            <label className="text-xs text-slate-600">Logo do Fundo</label>
            {preview && (
              <div className="mt-2 rounded">
                <Image
                  width={75}
                  height={75}
                  objectFit="cover"
                  src={preview}
                  alt={'logo'}
                  className="rounded"
                />
              </div>
            )}
            <input
              className="mt-2 w-full rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700"
              {...register('logo')}
              type="file"
              name="logo"
              onChange={(e) => {
                if (e.target.files && e.target.files[0] instanceof Blob) {
                  setFile(e.target.files[0]);
                }
              }}
              accept="image/*"
            />
          </div>
        </div>

        <div className="mt-2 flex justify-center gap-2">
          <div className="flex w-full flex-col">
            <label className="text-xs text-slate-600">Nome do Fundo</label>
            <input
              type="text"
              {...register('name', { required: true })}
              className="w-full rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700"
            />
            {errors.name && <RequiredMsg />}
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 sm:flex-row">
          <div className="w-full">
            <FundTypeSelector control={control} isMulti />
            {errors.types && <RequiredMsg />}
          </div>
          <div className="w-full">
            <StageSelector control={control} isMulti />
            {errors.stage && <RequiredMsg />}
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 sm:flex-row">
          <div className="w-full">
            <ThesisSelector control={control} isMulti isFund />
            {errors.thesis && <RequiredMsg />}
          </div>
          <div className="w-full">
            <StateSelect control={control} />
            {errors.state && <RequiredMsg />}
          </div>
        </div>

        <div className="flex w-full flex-col gap-4 sm:flex-row">
          <div className="w-full">
            <ControllerCurrency
              control={control}
              label={'Investimento Mínimo'}
              name={'minInvestment'}
            />
            {errors.minInvestment && <RequiredMsg />}
          </div>
          <div className="w-full">
            <ControllerCurrency
              control={control}
              label={'Investimento Máximo'}
              name={'maxInvestment'}
            />
            {errors.maxInvestment && <RequiredMsg />}
          </div>
        </div>

        <div className="mt-2 flex w-full flex-col">
          <label className="text-xs text-slate-600">Short description</label>
          <textarea
            rows={4}
            {...register('description')}
            className="w-full rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700"
          />
        </div> */}

        <input
          className="my-4 w-20 cursor-pointer rounded bg-slate-500 p-1 py-2 text-sm font-semibold text-white"
          type="submit"
          value={'Submit'}
        />
      </div>
    </form>
  );
}
