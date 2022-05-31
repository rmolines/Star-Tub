import { getAuth } from '@firebase/auth';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { app } from 'firebaseConfig';
import router from 'next/router';
import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useDocument } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form';

import { FounderLayout } from '@/templates/FounderLayout';

function Profile() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [user, loading, error] = useAuthState(getAuth(app));
  const [userInfo] = useDocument(
    doc(getFirestore(app), 'users', user !== null ? user.uid : 'qwer')
  );

  const createUser = async (data: {
    companyName: string;
    firstName: string;
    lastName: string;
  }) => {
    await updateDoc(doc(getFirestore(app), 'users', user.uid), {
      firstName: data.firstName.toString(),
      lastName: data.lastName.toString(),
      companyName: data.companyName.toString(),
    });
    router.push('/');
  };

  useEffect(() => {
    reset({
      firstName: userInfo?.data().firstName,
      lastName: userInfo?.data().lastName,
      companyName: userInfo?.data().companyName,
      email: user?.email,
    });
  }, [userInfo, user]);

  const onSubmit = (data) => createUser(data);

  return (
    <FounderLayout investors={false}>
      {error && <strong>Error: {JSON.stringify(error)}</strong>}
      {loading && <span>Loading...</span>}
      {user && (
        <div className="px-20">
          <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            {/* register your input into the hook by invoking the "register" function */}
            <div className="flex justify-center gap-2">
              <div className="flex w-1/2 flex-col">
                <label className="text-sm">First Name</label>
                <input
                  type="text"
                  {...register('firstName')}
                  className="w-full rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700"
                />
              </div>
              <div className="flex w-1/2 flex-col">
                <label className="text-sm">Last Name</label>
                <input
                  type="text"
                  {...register('lastName')}
                  className="w-full rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700"
                />
              </div>
            </div>

            <div className="mt-2 flex justify-center gap-2">
              <div className="flex w-full flex-col">
                <label className="text-sm">Company Name</label>
                <input
                  type="text"
                  {...register('companyName')}
                  className="w-full rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700"
                />
              </div>
            </div>

            <div className="mt-2 flex w-full flex-col">
              <label className="text-sm">E-mail</label>
              <input
                type="email"
                disabled
                {...register('email', { required: true })}
                className="w-fulll rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700"
              />
            </div>
            {/* errors will return when field validation fails  */}
            {errors.exampleRequired && <span>This field is required</span>}

            <input
              className="my-4 w-20 cursor-pointer rounded bg-slate-500 p-1 py-2 text-sm font-semibold text-slate-50"
              type="submit"
            />
          </form>
        </div>
      )}
    </FounderLayout>
  );
}

export default Profile;
