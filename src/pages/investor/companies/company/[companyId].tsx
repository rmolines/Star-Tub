import {
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  getFirestore,
} from 'firebase/firestore';
import { app } from 'firebaseConfig';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { BiLeftArrowAlt } from 'react-icons/bi';
import { BsLinkedin } from 'react-icons/bs';
import { GiProgression } from 'react-icons/gi';
import { GoLinkExternal } from 'react-icons/go';
import { GrLocation, GrTechnology } from 'react-icons/gr';

import PdfViewer from '@/components/PdfViewer';
import { DashboardLayout, LayoutType } from '@/templates/DashboardLayout';
import { getFileURL } from '@/utils/functions';

export default function Company() {
  const router = useRouter();
  const [companyData, setCompanyData] =
    useState<DocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(true);
  // const [creatingQuestion, setCreatingQuestion] = useState(false);
  // const [questionsData, setQuestionsData] =
  //   useState<QuerySnapshot<DocumentData> | null>(null);
  const [logoURL, setLogoURL] = useState<string | undefined>('');
  const [deckURL, setDeckURL] = useState<string | undefined>('');

  // const createQuestion = async (question: String) => {
  //   await addDoc(collection(getFirestore(app), 'questions'), {
  //     question,
  //     answer: '',
  //     companyId: router.query.companyId,
  //   });
  //   setCreatingQuestion(false);
  // };

  const getCompanyInfo = async (companyId: string) => {
    const company = await getDoc(
      doc(getFirestore(app), 'companies', companyId)
    );
    setCompanyData(company);

    // const questions = await getDocs(
    //   query(
    //     collection(getFirestore(app), 'questions'),
    //     where(
    //       'companyId',
    //       '==',
    //       Object.keys(router.query).length === 0 ? '' : router.query.companyId
    //     )
    //   )
    // );

    // setQuestionsData(questions);

    setLogoURL(await getFileURL('logoPath', company));
    setDeckURL(await getFileURL('deckPath', company));

    setLoading(false);
  };

  useEffect(() => {
    if (typeof router.query.companyId === 'string') {
      getCompanyInfo(router.query.companyId);
    }
  }, [router.query]);

  return (
    <DashboardLayout type={LayoutType.investor}>
      {!loading && companyData && (
        <div className="flex grow flex-col">
          <div className="mb-8 px-8">
            <div className="mb-4 flex items-center justify-between gap-4 pr-4">
              <div className="flex items-center gap-4">
                <div
                  className="cursor-pointer rounded-full text-3xl text-slate-400 hover:text-slate-700"
                  onClick={() => router.back()}
                >
                  <BiLeftArrowAlt />
                </div>
                {logoURL ? (
                  <Image
                    src={logoURL}
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
                  {companyData.get('name')}
                </div>
              </div>
              <div className="flex gap-2">
                {companyData.get('linkedin') && (
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`https://${companyData
                      .get('linkedin')
                      .split('://')
                      .pop()}`}
                    className="flex cursor-pointer items-center gap-1 rounded border-1 border-slate-400 px-2 py-1 text-sm font-semibold text-slate-800 hover:border-1 hover:border-slate-400"
                  >
                    LinkedIn
                    <BsLinkedin />
                    {/* <GoLinkExternal /> */}
                  </a>
                )}
                {companyData.get('url') && (
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`https://${companyData
                      .get('url')
                      .split('://')
                      .pop()}`}
                    className="flex cursor-pointer items-center gap-1 rounded border-1 border-slate-400 px-2 py-1 text-sm font-semibold text-slate-800 hover:border-1 hover:border-slate-400"
                  >
                    Visit Website
                    <GoLinkExternal />
                  </a>
                )}
              </div>
            </div>
            <div className="mx-6 border-l-2 border-slate-400 px-2 text-sm italic">
              {companyData.get('description')}
            </div>
          </div>
          <div className="flex grow flex-col px-8 lg:px-16">
            <div className="min-h-48 flex w-full flex-row flex-wrap justify-around p-4 text-slate-900">
              <div className="flex flex-col">
                <label className="text flex items-center gap-1 text-xs text-slate-500">
                  Estágio
                  <GiProgression />
                </label>
                <div className="mb-1 rounded border-1 border-slate-300 px-1.5 text-slate-700">
                  {companyData.get('stage').label}
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text flex items-center justify-center gap-1 text-xs text-slate-500">
                  Tese
                  <GrTechnology />
                </label>
                <div className="flex gap-2">
                  {companyData.get('thesis').map((e: any) => (
                    <div
                      className="mb-1 rounded border-1 border-slate-300 px-1.5 text-slate-700"
                      key={e.value}
                    >
                      {e.label}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text flex items-center gap-1 text-xs text-slate-500">
                  Estado
                  <GrLocation />
                </label>
                <div className="mb-1 rounded border-1 border-slate-300 px-1.5 text-slate-700">
                  {companyData.get('state')
                    ? companyData.get('state').label
                    : 'N/A'}
                </div>
              </div>
            </div>
            <div className="h-full pb-16">
              {deckURL && <PdfViewer file={deckURL} />}
            </div>

            {/* FAQ */}
            {/* <div className="">
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

                {!questionsData?.empty && (
                  <span>
                    {questionsData?.docs.map((docShadow, index) => (
                      <QuestionBox
                        key={docShadow.id}
                        id={docShadow.id}
                        index={index}
                        question={docShadow.get('question')}
                        answer={docShadow.get('answer')}
                        unanswered={false}
                      />
                    ))}
                  </span>
                )}
              </div>
            </div> */}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
