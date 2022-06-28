import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { deleteDoc, doc, getFirestore, updateDoc } from 'firebase/firestore';
import { app } from 'firebaseConfig';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useDetectClickOutside } from 'react-detect-click-outside';
import { useDocument } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form';

import DeleteUserDialog from '@/components/DeleteUserDialog';
import { useUserInfo } from '@/context/UserInfoContext';
import { DashboardLayout, LayoutType } from '@/templates/DashboardLayout';

type ProfileFormValues = {
  firstName: string;
  lastName: string;
  email?: string;
};

export default withPageAuthRequired(function Profile() {
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { user } = useUser();
  const { userInfo } = useUserInfo();
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

  const [companyInfo] = useDocument(
    doc(
      getFirestore(app),
      'companies',
      userInfo ? userInfo.data().companyId : 'wre'
    )
  );

  const updateUser = async (data: { firstName: string; lastName: string }) => {
    if (user?.sub) {
      await updateDoc(doc(getFirestore(app), 'users', user?.sub), {
        firstName: data.firstName,
        lastName: data.lastName,
      });
    }

    setSuccess(true);
  };

  const deleteUser = async (sub: string | undefined | null) => {
    if (sub) {
      await deleteDoc(doc(getFirestore(app), `users/${sub}`));

      router.push('/api/auth/logout/');
    }
  };

  useEffect(() => {
    if (user?.email) {
      reset({
        firstName: userInfo?.data().firstName,
        lastName: userInfo?.data().lastName,
        email: user?.email,
      });
    }
  }, [userInfo, user, companyInfo]);

  const onSubmit = (data: ProfileFormValues) => updateUser(data);

  return (
    <DashboardLayout type={LayoutType.founder}>
      {user && (
        <div className="mt-8 px-20">
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

            <div className="mt-2 flex w-full flex-col">
              <label className="text-sm">E-mail</label>
              <input
                type="email"
                disabled
                {...register('email', { required: true })}
                className="w-full rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700"
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
        </div>
      )}
    </DashboardLayout>
  );
});
