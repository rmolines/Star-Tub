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
import { BsPlusCircle } from 'react-icons/bs';

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
        questions: questions.docs,
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
          <div className="mb-4 flex items-center gap-4">
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
                src={'https://picsum.photos/40'}
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
          <div className="min-h-48 flex flex-col justify-between gap-2 rounded border-1 border-slate-300 p-4 text-slate-900">
            <div className="flex h-full flex-col justify-between text-sm">
              <label className="text-xs text-slate-500">Setor</label>
              <div className="">{companyDict.sector}</div>
              <label className="text-xs text-slate-500">Tech</label>
              <div className="">{companyDict.tech}</div>
              <label className="text-xs text-slate-500">Modelo</label>
              <div className="">{companyDict.model}</div>
              <label className="text-xs text-slate-500">Estágio</label>
              <div className="">{companyDict.stage}</div>
              <label className="text-xs text-slate-500">Estado</label>
              <div className="">{companyDict.state}</div>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">Perguntas</h1>

              <div className="flex items-center text-2xl">
                <BsPlusCircle
                  onClick={() => {
                    setCreatingQuestion(true);
                  }}
                  className="cursor-pointer"
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
        </>
      )}
    </DashboardLayout>
  );
}
