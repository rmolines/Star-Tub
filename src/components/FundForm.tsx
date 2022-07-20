import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { app } from 'firebaseConfig';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useUserInfo } from '@/context/UserInfoContext';
import { FundFormValues } from '@/types/companyTypes';

import { ControllerCurrency } from './ControllerCurrency';
import { FundTypeSelector } from './FundTypeSelector';
import RequiredMsg from './RequiredMsg';
import { StageSelector } from './StageSelector';
import StateSelect from './StateSelect';
import { ThesisSelector } from './ThesisSelector';

export function FundForm({
  fillInfo = false,
  onSubmit,
}: {
  fillInfo?: boolean;
  onSubmit: (data: FundFormValues) => any;
}) {
  const [preview, setPreview] = useState('');
  const [file, setFile] = useState<File>();
  const { userInfo, loading } = useUserInfo();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FundFormValues>();

  const fillCompanyInfo = async () => {
    const fundInfo = await getDoc(
      doc(getFirestore(app), 'funds', userInfo.data().companyId)
    );

    reset({
      name: fundInfo.get('name'),
      description: fundInfo.get('description'),
      stage: fundInfo.get('stage'),
      thesis: fundInfo.get('thesis'),
      state: fundInfo.get('state'),
      types: fundInfo.get('types'),
      minInvestment: fundInfo.get('minInvestment'),
      maxInvestment: fundInfo.get('maxInvestment'),
    });

    if (fundInfo.get('logoPath')) {
      const iconRef = ref(getStorage(), fundInfo.get('logoPath'));
      getDownloadURL(iconRef).then((URL) => setPreview(URL));
    }
  };

  useEffect(() => {
    let objURL = '';
    if (file instanceof File) {
      objURL = URL.createObjectURL(file);
      setPreview(objURL);
    }

    return () => {
      if (file instanceof File) {
        URL.revokeObjectURL(objURL);
      }
    };
  }, [file]);

  useEffect(() => {
    if (fillInfo && !loading && userInfo && userInfo.exists()) {
      fillCompanyInfo();
    }
  }, [loading, userInfo]);

  return (
    <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
      {/* register your input into the hook by invoking the "register" function */}

      <div className="mt-2 flex w-full justify-start gap-2">
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
          <ThesisSelector control={control} isMulti />
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
      </div>

      <input
        className="my-4 w-20 cursor-pointer rounded bg-slate-500 p-1 py-2 text-sm font-semibold text-white"
        type="submit"
        value={'Submit'}
      />
    </form>
  );
}
