import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { doc, getFirestore, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { app } from 'firebaseConfig';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useDocument } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form';

import StateSelect from '@/components/StateSelect';
import { useUserInfo } from '@/context/UserInfoContext';
import { DashboardLayout, LayoutType } from '@/templates/DashboardLayout';

import { DistModelSelector } from '../../../components/DistModelSelector';
import { SectorSelect } from '../../../components/SectorSelect';
import { StageSelector } from '../../../components/StageSelector';
import { TechSelector } from '../../../components/TechSelector';
import { CompanyFormValues } from './types';

export default withPageAuthRequired(function Profile() {
  const [logoURL, setLogoURL] = useState<string>('');
  const [success, setSuccess] = useState(false);

  const { user } = useUser();
  const { userInfo } = useUserInfo();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompanyFormValues>();

  const [companyInfo] = useDocument(
    doc(getFirestore(app), 'companies', userInfo.data().companyId)
  );

  const updateUser = async (data: {
    name: string;
    url: string;
    description: string;
    stage: string;
    sector: string;
    tech: string;
    model: string;
    state: string;
    linkedin: string;
    logo: FileList;
  }) => {
    const iconRef = ref(
      getStorage(),
      `companies/${userInfo?.data().companyId}/logo.${data.logo[0]?.type
        .split('/')
        .pop()}`
    );
    data.logo[0]?.arrayBuffer().then((buffer) => {
      uploadBytes(iconRef, buffer, {
        contentType: data.logo[0]?.type,
      });
    });

    const tempURL = await getDownloadURL(iconRef);

    await updateDoc(
      doc(getFirestore(app), 'companies', userInfo?.data().companyId),
      {
        name: data.name,
        url: data.url,
        logoURL: tempURL,
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
    if (companyInfo?.exists()) {
      reset({
        name: companyInfo?.data()?.name,
        url: companyInfo?.data()?.url,
        description: companyInfo?.data()?.description,
        stage: companyInfo?.data()?.stage,
        sector: companyInfo?.data()?.sector,
        tech: companyInfo?.data()?.tech,
        model: companyInfo?.data()?.model,
        state: companyInfo?.data()?.state,
        linkedin: companyInfo?.data()?.linkedin,
      });
    }
  }, [userInfo, user, companyInfo]);

  const onSubmit = (data: CompanyFormValues) => updateUser(data);

  const iconRef = ref(
    getStorage(),
    `companies/${userInfo?.data().companyId}/logo.png`
  );

  getDownloadURL(iconRef).then((URL) => setLogoURL(URL));

  return (
    <DashboardLayout type={LayoutType.founder}>
      {user && (
        <div className="mt-8 px-20">
          <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            {/* register your input into the hook by invoking the "register" function */}

            <div className="mt-2 flex w-full justify-start gap-2">
              <div className="flex w-full flex-col">
                <label className="text-xs text-slate-600">Company Logo</label>
                {logoURL && (
                  <div className="mt-2">
                    <Image
                      width={75}
                      height={75}
                      objectFit="cover"
                      src={logoURL}
                      alt={'logo'}
                    />
                  </div>
                )}
                <input
                  className="mt-2 w-full rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700"
                  {...register('logo')}
                  type="file"
                  name="logo"
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
              <label className="text-xs text-slate-600">
                Short description
              </label>
              <textarea
                rows={4}
                {...register('description')}
                className="w-full rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700"
              />
            </div>

            <StageSelector register={register} />

            <div className="flex justify-center gap-4">
              <SectorSelect register={register} />

              <TechSelector register={register} />
            </div>

            <div className="flex justify-center gap-4">
              <DistModelSelector register={register} />

              <div className="mt-2 flex w-1/2 flex-col">
                <StateSelect register={register} />
              </div>
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

            {/* errors will return when field validation fails  */}
            {errors.name && <span>This field is required</span>}

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
