import { useUser } from '@auth0/nextjs-auth0';
import {
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  updateDoc,
} from 'firebase/firestore';
import { app } from 'firebaseConfig';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useDetectClickOutside } from 'react-detect-click-outside';
import { useForm } from 'react-hook-form';

import { useUserInfo } from '@/context/UserInfoContext';
import { ProfileFormValues } from '@/types/ProfileFormValues';

import DeleteUserDialog from './DeleteUserDialog';

export function ProfileForm() {
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  const { userInfo, loading } = useUserInfo();
  const [isOpen, setIsOpen] = useState(false);
  const deleteUserButtonRef = useDetectClickOutside({
    onTriggered: () => setIsOpen(false),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>();

  const updateUser = async (data: { firstName: string; lastName: string }) => {
    if (typeof user?.sub === 'string')
      updateDoc(doc(getFirestore(app), 'users', user.sub), {
        firstName: data.firstName,
        lastName: data.lastName,
      }).then(() => setSuccess(true));
  };

  const deleteUser = async (sub: string | undefined | null) => {
    if (sub) {
      const userInfoShadow = await getDoc(
        doc(getFirestore(app), `users/${sub}`)
      );
      if (userInfoShadow.get('userType') === 'founder') {
        await deleteDoc(
          doc(getFirestore(app), `companies/${userInfoShadow.get('companyId')}`)
        );
      } else {
        console.log('ola');
        const t = await deleteDoc(
          doc(getFirestore(app), `funds/${userInfoShadow.get('companyId')}`)
        );
        console.log(t);
      }
      await deleteDoc(doc(getFirestore(app), `users/${sub}`));
      router.push('/api/auth/logout/');
    }
  };

  useEffect(() => {
    if (user?.email && !loading && userInfo.data()) {
      reset({
        firstName: userInfo?.data().firstName,
        lastName: userInfo?.data().lastName,
        email: user?.email,
      });
    }
  }, [userInfo, user]);

  const onSubmit = (data: ProfileFormValues) => updateUser(data);

  return (
    <div className="mx-auto mt-8 flex flex-col items-start md:px-20">
      {user && (
        <>
          <form
            className="flex w-full max-w-xl flex-col"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* register your input into the hook by invoking the "register" function */}
            <div className="flex w-full justify-center gap-2">
              <div className="flex w-full flex-col">
                <label className="text-sm">First Name</label>
                <input
                  type="text"
                  {...register('firstName')}
                  className="w-full rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700"
                />
              </div>
              <div className="flex w-full flex-col">
                <label className="text-sm">Last Name</label>
                <input
                  type="text"
                  {...register('lastName')}
                  className="w-full rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700"
                />
              </div>
            </div>

            <div className="mt-2 flex w-full flex-col disabled:bg-slate-50">
              <label className="text-sm">E-mail</label>
              <input
                type="email"
                disabled
                {...register('email', {
                  required: true,
                })}
                className="w-full rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700 disabled:bg-slate-100"
              />
            </div>

            {/* errors will return when field validation fails  */}
            {errors.firstName && <span>This field is required</span>}

            {success && (
              <span className="mt-2 w-fit rounded text-sm font-semibold">
                Perfil atualizado com sucesso!
              </span>
            )}

            <input
              className="my-4 w-20 cursor-pointer rounded bg-slate-500 p-1 py-2 text-sm font-semibold text-white"
              type="submit"
              value={'Submit'}
            />
          </form>
          <DeleteUserDialog
            removeUser={() => deleteUser(user?.sub)}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
          {user && typeof user.sub === 'string' && (
            <button
              className="my-4 w-fit cursor-pointer rounded bg-red-700 p-2 text-sm font-semibold text-white"
              ref={deleteUserButtonRef}
              onClick={() => setIsOpen(true)}
            >
              Deletar usuário
            </button>
          )}
        </>
      )}
    </div>
  );
}
