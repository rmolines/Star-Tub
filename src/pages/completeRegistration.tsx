import { getAuth } from '@firebase/auth';
import { doc, getFirestore, setDoc } from 'firebase/firestore';
import { app } from 'firebaseConfig';
import { useRouter } from 'next/router';
import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useForm } from 'react-hook-form';

function CompleteRegistration() {
  const [user] = useAuthState(getAuth(app));
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const createUser = async (data: {
    userType: string;
    companyName: string;
    firstName: string;
    lastName: string;
  }) => {
    await setDoc(doc(getFirestore(app), 'users', user.uid), {
      firstName: data.firstName.toString(),
      lastName: data.lastName.toString(),
      userType: data.userType.toString(),
      companyName: data.companyName.toString(),
    });
    router.push('/');
  };

  const onSubmit = (data) => createUser(data);

  return (
    <div className="flex h-screen justify-center bg-slate-50 p-4">
      <div className="my-10 h-fit w-full min-w-fit max-w-md rounded-md border-2 border-solid border-slate-100 bg-white p-10 shadow">
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
          </div>

          <div className="mt-2 flex justify-center gap-2">
            <div className="flex w-full flex-col">
              <label className="text-sm">Founder</label>
              <input
                type="radio"
                value="founder"
                {...register('userType')}
                className="w-full rounded border-1 border-slate-300 py-1 text-slate-400"
              />
            </div>
            <div className="flex w-full flex-col">
              <label className="text-sm">Investor</label>
              <input
                type="radio"
                value="investor"
                {...register('userType')}
                className="w-full rounded border-1 border-slate-300 py-1 text-slate-400"
              />
            </div>
          </div>
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
