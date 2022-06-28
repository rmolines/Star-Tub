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
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegistrationFormValues>({
    defaultValues: { userType: 'founder' },
  });

  const createUser = async (data: RegistrationFormValues) => {
    const company = await addDoc(collection(getFirestore(app), 'companies'), {
      name: data.companyName,
      url: data.url,
      description: data.description,
      stage: data.stage,
      sector: data.sector,
      tech: data.tech,
      model: data.model,
      state: data.state,
      linkedin: data.linkedin,
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
        userType: data.userType,
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
      <div className="my-10 h-fit w-full min-w-fit max-w-md rounded bg-white p-10 shadow">
        {/* <h1 className="ml-5 text-lg italic text-slate-700">star tub</h1> */}
        <div className="flex items-center">
          {/* <Image src="/logo.png" width="64" height="64" /> */}
          <h1 className=" text-xl font-semibold text-slate-700">
            Complete Registration
          </h1>
        </div>

        <form
          className="mt-4 flex flex-col text-slate-500"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mt-2 flex w-full justify-start gap-2">
            <div className="flex w-full flex-col">
              <label className="text-xs text-slate-600">Company Logo</label>
              {preview !== '' && (
                <div className="mt-2">
                  <Image
                    width={75}
                    height={75}
                    objectFit="cover"
                    src={preview}
                    alt={'logo'}
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
              />
            </div>
          </div>
          {/* register your input into the hook by invoking the "register" function */}
          <div className="flex justify-center gap-2">
            <div className="flex w-1/2 flex-col">
              <label className="text-xs">First Name</label>
              <input
                type="text"
                {...register('firstName')}
                className="w-full rounded border-1 border-slate-300 p-1 text-slate-700"
              />
            </div>
            <div className="flex w-1/2 flex-col">
              <label className="text-xs">Last Name</label>
              <input
                type="text"
                {...register('lastName')}
                className="w-full rounded border-1 border-slate-300 p-1 text-slate-700"
              />
            </div>
          </div>

          <div className="mt-2 flex justify-center gap-2">
            <div className="flex w-full flex-col">
              <label className="text-xs">Company Name</label>
              <input
                type="text"
                {...register('companyName')}
                className="w-full rounded border-1 border-slate-300 p-1 text-slate-700"
              />
            </div>

            <div className="flex w-full flex-col">
              <label className="text-xs">Type</label>
              <select
                {...register('userType')}
                className="w-full rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700"
              >
                <option value={'founder'}>Founder</option>
                <option value={'investor'}>Investor</option>
              </select>
            </div>
          </div>

          <div className="mt-2 flex w-full flex-col">
            <label className="text-xs">Website URL</label>
            <input
              type={'url'}
              {...register('url', { required: true })}
              className="w-full rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700"
            />
          </div>
          {/* errors will return when field validation fails  */}
          {errors.url && <span>This field is required</span>}

          {watch('userType') === 'founder' && (
            <>
              <div className="mt-2 flex w-full flex-col">
                <label className="text-xs">Short description</label>
                <textarea
                  rows={4}
                  {...register('description')}
                  className="w-full rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700"
                />
              </div>

              <div className="mt-2 flex w-full flex-col">
                <StageSelector register={register} />
              </div>
              {/* errors will return when field validation fails  */}
              {errors.stage && <span>This field is required</span>}

              <div className="flex justify-center gap-4">
                <SectorSelect register={register} />

                <TechSelector register={register} />
              </div>

              <div className="flex justify-center gap-4">
                <DistModelSelector register={register} />

                <StateSelect register={register} />
              </div>

              <div className="mt-2 flex w-full flex-col">
                <label className="text-xs">Founder&apos;s LinkedIn</label>
                <input
                  type={'url'}
                  {...register('linkedin', { required: true })}
                  className="w-full rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700"
                />
              </div>
            </>
          )}

          <div className="flex justify-start">
            <input
              className="my-4 w-20 cursor-pointer rounded bg-slate-500 p-1 py-2 text-sm font-semibold text-slate-50"
              type="submit"
              value="Finish!"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default CompleteRegistration;
