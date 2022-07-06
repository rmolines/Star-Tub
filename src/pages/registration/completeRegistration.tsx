import { useUser } from '@auth0/nextjs-auth0';
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes } from 'firebase/storage';
import { app } from 'firebaseConfig';
import Image from 'next/image';
import router from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { DistModelSelector } from '@/components/DistModelSelector';
import { SectorSelect } from '@/components/SectorSelect';
import { StageSelector } from '@/components/StageSelector';
import StateSelect from '@/components/StateSelect';
import { TechSelector } from '@/components/TechSelector';

import { RegistrationFormValues } from '../../types/registrationTypes';

function CompleteRegistration() {
  const [preview, setPreview] = useState('');
  const [file, setFile] = useState<File>();
  const { user } = useUser();
  const { register, handleSubmit, watch, control } =
    useForm<RegistrationFormValues>({
      defaultValues: { userType: 'founder' },
    });

  const watchUserType = watch('userType');

  useEffect(() => {
    console.log(watchUserType);
  }, [watchUserType]);

  const createUser = async (data: RegistrationFormValues) => {
    let companyType;
    if (data.userType) {
      companyType = 'startup';
    } else {
      companyType = 'fund';
    }

    const company = await addDoc(collection(getFirestore(app), 'companies'), {
      name: data.name,
      url: data.url,
      description: data.description,
      stage: data.stage,
      sector: data.sector,
      tech: data.tech,
      model: data.model,
      state: data.state,
      linkedin: data.linkedin,
      companyType,
    });

    const logoPath = `logos/${company.id}/logo.${data.logo[0]?.type
      .split('/')
      .pop()}`;

    await updateDoc(doc(getFirestore(app), `companies/${company.id}`), {
      logoPath,
    });

    const iconRef = ref(getStorage(), logoPath);

    data.logo[0]?.arrayBuffer().then((buffer) =>
      uploadBytes(iconRef, buffer, {
        contentType: data.logo[0]?.type,
      })
    );

    await setDoc(
      doc(
        getFirestore(app),
        'users',
        typeof user?.sub === 'string' ? user.sub : ''
      ),
      {
        firstName: data.firstName,
        lastName: data.lastName,
        userType: data.userType ? 'founder' : 'investor',
        companyId: company.id,
      }
    );
    router.push('/');
  };

  const onSubmit = (data: RegistrationFormValues) => createUser(data);

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
    <div className="flex h-screen justify-center bg-slate-50 p-4">
      <div className="my-10 h-fit w-full min-w-fit max-w-xl rounded bg-white p-10 shadow">
        {/* <h1 className="ml-5 text-lg italic text-slate-700">star tub</h1> */}
        <div className="flex items-center">
          {/* <Image src="/logo.png" width="64" height="64" /> */}
          <h1 className=" text-xl font-semibold text-slate-700">
            Complete Registration
          </h1>
        </div>

        <form
          className="flex w-full flex-col"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mt-2 flex justify-center gap-2">
            <div className="flex w-full flex-col">
              <label className="text-xs text-slate-600">First Name</label>
              <input
                type="text"
                {...register('firstName')}
                className="w-full rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700"
              />
            </div>
            <div className="flex w-full flex-col">
              <label className="text-xs text-slate-600">Last Name</label>
              <input
                type="text"
                {...register('lastName')}
                className="w-full rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <span className="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              Investor
            </span>
            <label
              htmlFor="large-toggle"
              className="relative inline-flex cursor-pointer items-center"
            >
              <input
                type="checkbox"
                value=""
                id="large-toggle"
                className="peer sr-only"
                {...register('userType')}
              />
              <div className="peer h-7 w-14 rounded-full bg-slate-400 after:absolute after:top-0.5 after:left-[4px] after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
            </label>
            <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              Founder
            </span>
          </div>

          <div className="mt-2 flex w-full justify-start gap-2">
            <div className="flex w-full flex-col">
              <label className="text-xs text-slate-600">Company Logo</label>
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
              <label className="text-xs text-slate-600">Company Name</label>
              <input
                type="text"
                {...register('name')}
                className="w-full rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700"
              />
            </div>
          </div>

          <div className="mt-2 flex w-full flex-col">
            <label className="text-xs text-slate-600">Website URL</label>
            <input
              type={'url'}
              {...register('url')}
              className="w-full rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700"
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

          <div className="w-full">
            <StageSelector control={control} isMulti />
          </div>

          <div className="flex justify-center gap-4">
            <SectorSelect control={control} isMulti />

            <TechSelector control={control} isMulti />
          </div>

          <div className="flex justify-center gap-4">
            <DistModelSelector control={control} isMulti />

            <StateSelect control={control} />
          </div>

          <div className="mt-2 flex w-full flex-col">
            <label className="text-xs text-slate-600">
              Founder&apos;s LinkedIn
            </label>
            <input
              type={'url'}
              {...register('linkedin')}
              className="w-full rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700"
            />
          </div>

          <input
            className="my-4 w-20 cursor-pointer rounded bg-slate-500 p-1 py-2 text-sm font-semibold text-white"
            type="submit"
            value={'Submit'}
          />
        </form>
      </div>
    </div>
  );
}

export default CompleteRegistration;
