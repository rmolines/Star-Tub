import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  getFirestore,
  query,
  QueryDocumentSnapshot,
  where,
} from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import { app } from 'firebaseConfig';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { BiLeftArrowAlt } from 'react-icons/bi';
import { BsLinkedin, BsPlusCircle } from 'react-icons/bs';
import { GiProgression } from 'react-icons/gi';
import { GoLinkExternal } from 'react-icons/go';
import { GrLocation, GrOverview, GrTechnology } from 'react-icons/gr';
import { TbBuildingStore } from 'react-icons/tb';

import { NewQuestion } from '@/components/NewQuestion';
import { QuestionBox } from '@/components/QuestionBox';
import { DashboardLayout, LayoutType } from '@/templates/DashboardLayout';

type CopmanyDictType = {
  name: string;
  logoURL: string | undefined;
  sector: string;
  tech: string;
  model: string;
  state: string;
  stage: string;
  description: string;
  email: string;
  url: string;
  linkedin: string;
  questions: QueryDocumentSnapshot<DocumentData>[];
};

export default function Company() {
  const router = useRouter();
  const [companyDict, setCompanyDict] = useState<CopmanyDictType | null>(null);
  const [loading, setLoading] = useState(true);
  const [creatingQuestion, setCreatingQuestion] = useState(false);

  const createQuestion = async (question: String) => {
    await addDoc(collection(getFirestore(app), 'questions'), {
      question,
      answer: '',
      companyId: router.query.companyId,
    });
    setCreatingQuestion(false);
  };

  const getCompanyInfo = async (companyId: string) => {
    const sectors = await getDocs(collection(getFirestore(app), 'sectors'));
    const tech = await getDocs(collection(getFirestore(app), 'tech'));
    const models = await getDocs(collection(getFirestore(app), 'models'));
    const stages = await getDocs(collection(getFirestore(app), 'stages'));
    const states = await getDocs(collection(getFirestore(app), 'states'));
    const company = await getDoc(
      doc(getFirestore(app), 'companies', companyId)
    );

    const questions = await getDocs(
      query(
        collection(getFirestore(app), 'questions'),
        where(
          'companyId',
          '==',
          Object.keys(router.query).length === 0 ? '' : router.query.companyId
        )
      )
    );

    const sectorsDict: { [key: string]: string } = {};
    sectors?.docs.forEach((e) => {
      sectorsDict[e.id] = e.get('value');
    });

    const techDict: { [key: string]: string } = {};
    tech?.docs.forEach((e) => {
      techDict[e.id] = e.get('value');
    });

    const modelsDict: { [key: string]: string } = {};
    models?.docs.forEach((e) => {
      modelsDict[e.id] = e.get('value');
    });

    const stagesDict: { [key: string]: string } = {};
    stages?.docs.forEach((e) => {
      stagesDict[e.id] = e.get('value');
    });

    const statesDict: { [key: string]: string } = {};
    states?.docs.forEach((e) => {
      statesDict[e.id] = e.get('value');
    });

    const getLogoURL = async () => {
      let tempURL: string | undefined;
      if (
        company.get('logoPath') &&
        company.get('logoPath').split('.').pop() !== 'undefined'
      ) {
        const iconRef = ref(getStorage(), company.get('logoPath'));
        tempURL = await getDownloadURL(iconRef);
      }
      return tempURL;
    };

    getLogoURL().then((URL) => {
      const companyD: CopmanyDictType = {
        name: company.get('name'),
        logoURL: URL,
        sector: sectorsDict[company.get('sector')] ?? 'N/A',
        tech: techDict[company.get('tech')] ?? 'N/A',
        model: modelsDict[company.get('model')] ?? 'N/A',
        state: statesDict[company.get('state')] ?? 'N/A',
        stage: stagesDict[company.get('stage')] ?? 'N/A',
        description: company.get('description'),
        questions: questions.docs,
        email: company.get('email'),
        linkedin: company.get('linkedin'),
        url: company.get('url'),
      };
      setCompanyDict(companyD);
    });

    setLoading(false);
  };

  useEffect(() => {
    if (typeof router.query.companyId === 'string') {
      getCompanyInfo(router.query.companyId);
    }
  }, [router.query]);

  return (
    <DashboardLayout type={LayoutType.investor}>
      {!loading && companyDict && (
        <>
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between gap-4 pr-4">
              <div className="flex items-center gap-4">
                <div
                  className="cursor-pointer rounded-full text-3xl text-slate-400 hover:text-slate-700"
                  onClick={() => router.back()}
                >
                  <BiLeftArrowAlt />
                </div>
                {companyDict.logoURL ? (
                  <Image
                    src={companyDict.logoURL}
                    width={40}
                    height={40}
                    alt="logo"
                    className="rounded"
                    quality={100}
                  />
                ) : (
                  <Image
                    src={
                      'https://blog.iprocess.com.br/wp-content/uploads/2021/11/placeholder.png'
                    }
                    width={40}
                    height={40}
                    alt="logo"
                    className="rounded"
                  />
                )}
                <div className="text-2xl font-bold text-slate-800">
                  {companyDict.name}
                </div>
              </div>
              <div className="flex gap-2">
                {companyDict.linkedin && (
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`//${companyDict.linkedin}`}
                    className="flex cursor-pointer items-center gap-1 rounded border-1 border-slate-400 px-2 py-1 text-sm font-semibold text-slate-800 hover:border-1 hover:border-slate-400"
                  >
                    LinkedIn
                    <BsLinkedin />
                    {/* <GoLinkExternal /> */}
                  </a>
                )}
                {companyDict.url && (
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={companyDict.url}
                    className="flex cursor-pointer items-center gap-1 rounded border-1 border-slate-400 px-2 py-1 text-sm font-semibold text-slate-800 hover:border-1 hover:border-slate-400"
                  >
                    Visit Website
                    <GoLinkExternal />
                  </a>
                )}
              </div>
            </div>
            <div className="mx-6 border-l-2 border-slate-400 px-2 text-sm italic">
              {companyDict.description}
            </div>
          </div>
          <div className="lg:px-16">
            <div className="min-h-48 flex w-full flex-row flex-wrap justify-between gap-2 p-4 text-slate-900">
              <div className="flex flex-col">
                <label className="text flex items-center gap-1 text-xs text-slate-500">
                  Estágio
                  <GiProgression />
                </label>
                <div className="font-medium">{companyDict.stage}</div>
              </div>
              <div className="flex flex-col">
                <label className="text flex items-center gap-1 text-xs text-slate-500">
                  Modelo
                  <TbBuildingStore />
                </label>
                <div className="font-medium">{companyDict.model}</div>
              </div>
              <div className="flex flex-col">
                <label className="text flex items-center gap-1 text-xs text-slate-500">
                  Setor
                  <GrOverview />
                </label>
                <div className="font-medium">{companyDict.sector}</div>
              </div>
              <div className="flex flex-col">
                <label className="text flex items-center gap-1 text-xs text-slate-500">
                  Tech
                  <GrTechnology />
                </label>
                <div className="font-medium">{companyDict.tech}</div>
              </div>
              <div className="flex flex-col">
                <label className="text flex items-center gap-1 text-xs text-slate-500">
                  Estado
                  <GrLocation />
                </label>
                <div className="font-medium">{companyDict.state}</div>
              </div>
            </div>
            {/* <div className="flex gap-2">
              <a
                className="border-none text-2xl text-slate-800"
                href={`mailto:${companyDict.email}`}
              >
                <BiMailSend />
              </a>
              <a
                className="border-none text-2xl text-slate-800"
                href={`//${companyDict.linkedin}`}
                target="_blank"
                rel="noreferrer"
              >
                <BsLinkedin />
              </a>
            </div> */}
            {/* FAQ */}
            <div className="">
              <div className="mt-8">
                <div className="flex items-center justify-start gap-4">
                  <h1 className="text-xl font-semibold">Perguntas</h1>

                  <div className="flex items-center text-2xl">
                    <BsPlusCircle
                      onClick={() => {
                        setCreatingQuestion(true);
                      }}
                      className="cursor-pointer text-slate-300 hover:text-slate-800"
                    />
                  </div>
                </div>

                {/* Caixa para criar pergunta */}
                {creatingQuestion && (
                  <div className="my-6 mx-2 border-b-1 border-slate-200 pb-4">
                    <div className="font-semibold">Nova pergunta</div>
                    <span>
                      <NewQuestion
                        submitFunc={createQuestion}
                        cancelFunc={setCreatingQuestion}
                      />
                    </span>
                  </div>
                )}

                {/* Perguntas respondidas */}
                {companyDict.questions.length > 0 && (
                  <span>
                    {companyDict.questions.map((docShadow, index) => (
                      <QuestionBox
                        key={docShadow.id}
                        id={docShadow.id}
                        index={index}
                        question={docShadow.data().question}
                        answer={docShadow.data().answer}
                        unanswered={false}
                      />
                    ))}
                  </span>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
