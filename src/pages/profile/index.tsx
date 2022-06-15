import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { app } from 'firebaseConfig';
import { useEffect, useState } from 'react';
import { useDocument } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form';

import StateSelect from '@/components/StateSelect';
import { DashboardLayout, LayoutType } from '@/templates/DashboardLayout';

export default withPageAuthRequired(function Profile() {
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { user, error, isLoading } = useUser();
  const [userInfo, loading, error2] = useDocument(
    doc(getFirestore(app), 'users', user !== undefined ? user?.sub : 'qwer')
  );

  const [companyInfo] = useDocument(
    doc(
      getFirestore(app),
      'companies',
      userInfo !== undefined ? userInfo.data().companyId : 'wre'
    )
  );

  const updateUser = async (data: {
    name: string;
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
    await updateDoc(doc(getFirestore(app), 'users', user?.sub), {
      firstName: data.firstName,
      lastName: data.lastName,
    });
    await updateDoc(
      doc(getFirestore(app), 'companies', userInfo?.data().companyId),
      {
        name: data.name,
        url: data.url,
        description: data.description,
        stage: data.stage,
        sector: data.sector,
        tech: data.tech,
        model: data.model,
        state: data.state,
        linkedin: data.linkedin,
      }
    );
    setSuccess(true);
  };

  useEffect(() => {
    reset({
      firstName: userInfo?.data().firstName,
      lastName: userInfo?.data().lastName,
      name: companyInfo?.data() ? companyInfo.data().name : '',
      url: companyInfo?.data() ? companyInfo.data().url : '',
      description: companyInfo?.data() ? companyInfo.data().description : '',
      stage: companyInfo?.data() ? companyInfo.data().stage : '',
      sector: companyInfo?.data() ? companyInfo.data().sector : '',
      tech: companyInfo?.data() ? companyInfo.data().tech : '',
      model: companyInfo?.data() ? companyInfo.data().model : '',
      state: companyInfo?.data() ? companyInfo.data().state : '',
      linkedin: companyInfo?.data() ? companyInfo.data().linkedin : '',
      email: user?.email,
    });
  }, [userInfo, user, companyInfo]);

  const onSubmit = (data) => updateUser(data);

  if (isLoading || loading) return <div>Loading...</div>;
  if (error || error2) return <div>{error.message}</div>;

  return (
    <DashboardLayout type={LayoutType.profile}>
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

            <div className="mt-2 flex justify-center gap-2">
              <div className="flex w-full flex-col">
                <label className="text-sm">Company Name</label>
                <input
                  type="text"
                  {...register('name')}
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

            <div className="mt-2 flex w-full flex-col">
              <label className="text-sm">Website URL</label>
              <input
                type={'url'}
                {...register('url')}
                className="w-full rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700"
              />
            </div>

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

            {/* errors will return when field validation fails  */}
            {errors.exampleRequired && <span>This field is required</span>}

            {success && (
              <span className="mt-2 w-fit rounded text-sm font-semibold">
                Perfil atualizado com sucesso!
              </span>
            )}

            <input
              className="my-4 w-20 cursor-pointer rounded bg-slate-500 p-1 py-2 text-sm font-semibold text-white"
              type="submit"
            />
            <button
              className="my-4 w-fit cursor-pointer rounded bg-red-700 p-2 text-sm font-semibold text-white"
              onClick={() => {}}
            >
              Deletar usuário
            </button>
          </form>
        </div>
      )}
    </DashboardLayout>
  );
});
