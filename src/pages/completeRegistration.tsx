import { useUser } from '@auth0/nextjs-auth0';
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  setDoc,
} from 'firebase/firestore';
import { app } from 'firebaseConfig';
import router from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';

import StateSelect from '@/components/StateSelect';

function CompleteRegistration() {
  const { user, error, isLoading } = useUser();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { userType: 'founder' } });

  const createUser = async (data: {
    userType: string;
    companyName: string;
    firstName: string;
    lastName: string;
    url: string;
    description: string;
    stage: string;
    sector: string;
    tech: string;
    model: string;
    state: string;
    linkedin: string;
  }) => {
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

    await setDoc(doc(getFirestore(app), 'users', user?.sub), {
      firstName: data.firstName,
      lastName: data.lastName,
      userType: data.userType,
      companyId: company.id,
    });
    router.push('/');
  };

  const onSubmit = (data) => createUser(data);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

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

        <form className="mt-4 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
          {/* register your input into the hook by invoking the "register" function */}
          <div className="flex justify-center gap-2">
            <div className="flex w-1/2 flex-col">
              <label className="text-sm">First Name</label>
              <input
                type="text"
                {...register('firstName')}
                className="w-full rounded border-1 border-slate-300 p-1 text-slate-400"
              />
            </div>
            <div className="flex w-1/2 flex-col">
              <label className="text-sm">Last Name</label>
              <input
                type="text"
                {...register('lastName')}
                className="w-full rounded border-1 border-slate-300 p-1 text-slate-400"
              />
            </div>
          </div>

          <div className="mt-2 flex justify-center gap-2">
            <div className="flex w-full flex-col">
              <label className="text-sm">Company Name</label>
              <input
                type="text"
                {...register('companyName')}
                className="w-full rounded border-1 border-slate-300 p-1 text-slate-400"
              />
            </div>

            <div className="flex w-full flex-col">
              <label className="text-sm">Type</label>
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
            <label className="text-sm">Website URL</label>
            <input
              type={'url'}
              {...register('url')}
              className="w-full rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700"
            />
          </div>

          {watch('userType') === 'founder' && (
            <>
              <div className="mt-2 flex w-full flex-col">
                <label className="text-sm">Short description</label>
                <textarea
                  rows={4}
                  {...register('description')}
                  className="w-full rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700"
                />
              </div>

              <div className="mt-2 flex w-full flex-col">
                <label className="text-sm">Company stage</label>
                <select
                  {...register('stage')}
                  className="w-full rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700"
                >
                  <option value={'pre-seed'}>Pre-seed</option>
                  <option value={'seed'}>Seed</option>
                  <option value={'series-a'}>Series A</option>
                  <option value={'series-b'}>Series B</option>
                  <option value={'series-c'}>Series C+</option>
                </select>
              </div>

              <div className="flex justify-center gap-4">
                <div className="mt-2 flex w-1/2 flex-col">
                  <label className="text-sm">Sector</label>
                  <input
                    type={'text'}
                    {...register('sector')}
                    className="w-full rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700"
                  />
                </div>

                <div className="mt-2 flex w-1/2 flex-col">
                  <label className="text-sm">Technology</label>
                  <input
                    type={'text'}
                    {...register('tech')}
                    className="w-full rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700"
                  />
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <div className="mt-2 flex w-1/2 flex-col">
                  <label className="text-sm">Business model</label>
                  <input
                    type={'text'}
                    {...register('model')}
                    className="w-full rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700"
                  />
                </div>

                <div className="mt-2 flex w-1/2 flex-col">
                  <StateSelect register={register} />
                </div>
              </div>

              <div className="mt-2 flex w-full flex-col">
                <label className="text-sm">Founder's LinkedIn</label>
                <input
                  type={'url'}
                  {...register('linkedin')}
                  className="w-full rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700"
                />
              </div>
            </>
          )}
          {/* errors will return when field validation fails  */}
          {errors.exampleRequired && <span>This field is required</span>}

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
