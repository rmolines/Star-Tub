import { collection, getDocs, getFirestore } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { app } from 'firebaseConfig';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { GoLinkExternal } from 'react-icons/go';

import { DashboardLayout, LayoutType } from '@/templates/DashboardLayout';

type CompaniesDictType = {
  [key: string]: {
    name: string;
    logoURL: string | undefined;
    sector: string;
    tech: string;
    model: string;
    state: string;
    stage: string;
  };
};

function Companies() {
  const router = useRouter();
  const [companiesState, setCompaniesState] =
    useState<CompaniesDictType | null>(null);

  // const populate = async (elements: string[], collectionName: string) => {
  //   elements.forEach((e) => {
  //     addDoc(collection(getFirestore(app), collectionName), {
  //       value: e,
  //     });
  //   });
  // };

  const getCompanies = async () => {
    const sectors = getDocs(collection(getFirestore(app), 'sectors'));
    const tech = getDocs(collection(getFirestore(app), 'tech'));
    const models = getDocs(collection(getFirestore(app), 'models'));
    const stages = getDocs(collection(getFirestore(app), 'stages'));
    const states = getDocs(collection(getFirestore(app), 'states'));
    const companies = getDocs(collection(getFirestore(app), 'companies'));

    const [
      sectorsData,
      techData,
      modelsData,
      stagesData,
      statesData,
      companiesData,
    ] = await Promise.all([sectors, tech, models, stages, states, companies]);

    const sectorsDict: { [key: string]: string } = {};
    sectorsData?.docs.forEach((e) => {
      sectorsDict[e.id] = e.get('value');
    });

    const techDict: { [key: string]: string } = {};
    techData?.docs.forEach((e) => {
      techDict[e.id] = e.get('value');
    });

    const modelsDict: { [key: string]: string } = {};
    modelsData?.docs.forEach((e) => {
      modelsDict[e.id] = e.get('value');
    });

    const stagesDict: { [key: string]: string } = {};
    stagesData?.docs.forEach((e) => {
      stagesDict[e.id] = e.get('value');
    });

    const statesDict: { [key: string]: string } = {};
    statesData?.docs.forEach((e) => {
      statesDict[e.id] = e.get('value');
    });

    const companiesDict: CompaniesDictType = {};

    await Promise.all(
      companiesData.docs.map(async (e) => {
        const getLogoURL = async () => {
          let tempURL: string | undefined;
          if (
            e.get('logoPath') &&
            e.get('logoPath').split('.').pop() !== 'undefined'
          ) {
            const iconRef = ref(getStorage(), e.get('logoPath'));
            tempURL = await getDownloadURL(iconRef);
          }
          return tempURL;
        };

        const URL = await getLogoURL();
        companiesDict[e.id] = {
          name: e.get('name'),
          sector: sectorsDict[e.get('sector')] ?? 'N/A',
          logoURL: URL,
          tech: techDict[e.get('tech')] ?? 'N/A',
          model: modelsDict[e.get('model')] ?? 'N/A',
          state: statesDict[e.get('state')] ?? 'N/A',
          stage: stagesDict[e.get('stage')] ?? 'N/A',
        };
      })
    );

    setCompaniesState(companiesDict);
  };

  useEffect(() => {
    getCompanies();
  }, []);

  return (
    <DashboardLayout type={LayoutType.investor}>
      <div className="grid grid-cols-cards gap-4">
        {companiesState &&
          Object.keys(companiesState)?.map((e) => (
            <div
              className="min-h-48 flex flex-col justify-between gap-2 rounded border-1 border-slate-300 p-4 text-slate-900"
              key={e}
            >
              <div className="flex w-full items-center justify-between">
                <div className="relative">
                  <Image
                    src={
                      companiesState[e]?.logoURL ??
                      'https://blog.iprocess.com.br/wp-content/uploads/2021/11/placeholder.png'
                    }
                    placeholder={'blur'}
                    blurDataURL="https://blog.iprocess.com.br/wp-content/uploads/2021/11/placeholder.png"
                    width={40}
                    height={40}
                    alt="logo"
                    className="rounded"
                    objectFit="cover"
                    quality={100}
                  />
                </div>
                <div
                  onClick={() => router.push(`companies/company/${e}`)}
                  className="text-slate-00 cursor-pointer rounded-full p-3 text-lg hover:bg-slate-200"
                >
                  <GoLinkExternal />
                </div>
              </div>
              <div className="flex h-full flex-col justify-between text-sm">
                <label className="text-xs text-slate-500">Nome</label>
                <div className="">{companiesState[e]?.name}</div>
                <label className="text-xs text-slate-500">Setor</label>
                <div className="">{companiesState[e]?.sector}</div>
                <label className="text-xs text-slate-500">Tech</label>
                <div className="">{companiesState[e]?.tech}</div>
                <label className="text-xs text-slate-500">Modelo</label>
                <div className="">{companiesState[e]?.model}</div>
                <label className="text-xs text-slate-500">Estágio</label>
                <div className="">{companiesState[e]?.stage}</div>
                <label className="text-xs text-slate-500">Estado</label>
                <div className="">{companiesState[e]?.state}</div>
              </div>
            </div>
          ))}
      </div>
    </DashboardLayout>
  );
}

export default Companies;
