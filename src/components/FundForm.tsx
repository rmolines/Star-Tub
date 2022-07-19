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

  const { register, handleSubmit, control, reset } = useForm<FundFormValues>();

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
          <label className="text-xs text-slate-600">Company Logo</label>
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
          <label className="text-xs text-slate-600">Fund Name</label>
          <input
            type="text"
            {...register('name')}
            className="w-full rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700"
          />
        </div>
      </div>

      <div className="flex w-full flex-col gap-4 sm:flex-row">
        <FundTypeSelector control={control} isMulti />
        <StageSelector control={control} isMulti />
      </div>

      <div className="flex flex-col justify-center gap-4 sm:flex-row">
        <ThesisSelector control={control} isMulti />
        <StateSelect control={control} />
      </div>

      <div className="flex w-full flex-col gap-4 sm:flex-row">
        <ControllerCurrency
          control={control}
          label={'Investimento Mínimo'}
          name={'minInvestment'}
        />
        <ControllerCurrency
          control={control}
          label={'Investimento Máximo'}
          name={'maxInvestment'}
        />
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
