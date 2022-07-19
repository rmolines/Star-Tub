import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { app } from 'firebaseConfig';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useUserInfo } from '@/context/UserInfoContext';
import { StartupFormValues } from '@/types/companyTypes';

import { StageSelector } from './StageSelector';
import StateSelect from './StateSelect';
import { ThesisSelector } from './ThesisSelector';

export function StartupForm({
  fillInfo,
  onSubmit,
}: {
  fillInfo: boolean;
  onSubmit: (data: StartupFormValues) => any;
}) {
  const { userInfo, loading } = useUserInfo();
  const [preview, setPreview] = useState('');
  const [file, setFile] = useState<File>();

  const { register, handleSubmit, control, reset } =
    useForm<StartupFormValues>();

  const fillCompanyInfo = async () => {
    const companyInfo = await getDoc(
      doc(getFirestore(app), 'companies', userInfo.data().companyId)
    );

    reset({
      name: companyInfo?.data()?.name,
      url: companyInfo?.data()?.url,
      description: companyInfo?.data()?.description,
      stage: companyInfo?.data()?.stage,
      thesis: companyInfo?.data()?.thesis,
      state: companyInfo?.data()?.state,
      linkedin: companyInfo?.data()?.linkedin,
    });

    if (companyInfo?.data()?.logoPath) {
      const iconRef = ref(getStorage(), companyInfo?.data()?.logoPath);
      getDownloadURL(iconRef).then((URL) => setPreview(URL));
    }
  };

  useEffect(() => {
    if (fillInfo && !loading && userInfo && userInfo.exists()) {
      fillCompanyInfo();
    }
  }, [loading, userInfo]);

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

  return (
    <form className="flex w-full flex-col" onSubmit={handleSubmit(onSubmit)}>
      <div className="mt-2 flex w-full justify-start gap-2">
        <div className="flex w-full flex-col">
          <label className="text-xs text-slate-600">Logo da Startup</label>
          {preview !== '' && (
            <div className="mt-2">
              <Image
                src={preview}
                placeholder={'blur'}
                blurDataURL="https://blog.iprocess.com.br/wp-content/uploads/2021/11/placeholder.png"
                width={75}
                height={75}
                alt="logo"
                className="rounded"
                quality={100}
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
          <label className="text-xs text-slate-600">Nome da Startup*</label>
          <input
            type="text"
            {...register('name')}
            className="w-full rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700"
          />
        </div>
        <StateSelect control={control} />
      </div>

      <div className="flex flex-col gap-x-4 md:flex-row">
        <div className="mt-2 flex w-full flex-col">
          <label className="text-xs text-slate-600">Website</label>
          <input
            type={'url'}
            {...register('url')}
            className="w-full rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700"
          />
        </div>

        <div className="mt-2 flex w-full flex-col">
          <label className="text-xs text-slate-600">LinkedIn do Fundador</label>
          <input
            type={'url'}
            {...register('linkedin')}
            className="w-full rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700"
          />
        </div>
      </div>

      <div className="mt-2 flex w-full flex-col gap-4 md:flex-row">
        <StageSelector control={control} />
        <ThesisSelector control={control} isMulti />
      </div>

      <div className="mt-2 flex w-full flex-col">
        <label className="text-xs text-slate-600">Breve descrição</label>
        <textarea
          rows={4}
          {...register('description')}
          className="w-full resize-none rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700"
        />
      </div>

      <label className="text-xs text-slate-600">Deck em PDF</label>
      <input
        className="mt-2 w-full rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700"
        {...register('deck')}
        type="file"
        name="deck"
        // onChange={(e) => {
        //   if (e.target.files && e.target.files[0] instanceof Blob) {
        //     setFile(e.target.files[0]);
        //   }
        // }}
        accept="application/pdf"
      />

      <input
        className="my-4 w-20 cursor-pointer rounded bg-slate-500 p-1 py-2 text-sm font-semibold text-white"
        type="submit"
        value={'Submit'}
      />
    </form>
  );
}
