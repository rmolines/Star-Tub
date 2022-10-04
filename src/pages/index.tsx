import { QueryDocumentSnapshot } from 'firebase/firestore';
import { useState } from 'react';

import FundCard from '@/components/FundCard';
import { StartupSimpleForm } from '@/components/StartupSimpleForm';
import { getCompaniesSimple } from '@/utils/functions';

export default function Example() {
  const [companiesState, setCompaniesState] = useState<
    QueryDocumentSnapshot<unknown>[] | null
  >(null);

  return (
    <div className="flex min-h-screen min-w-full flex-col items-center bg-white">
      <div className="flex h-[60vh] max-w-4xl flex-col justify-start p-8 xl:px-0">
        {/* <!-- nav --> */}
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center">
            <div className="flex items-center justify-center gap-4 text-4xl font-semibold text-gray-900">
              <img src="/clam.svg" className="w-12" alt="clam" />
              Clam
            </div>
          </div>
          {/* <div className="flex items-center justify-center">
            <button
              onClick={() => router.push('/redirect')}
              className="rounded-3xl bg-gradient-to-b from-gray-900 to-black px-6 py-3 font-medium text-white outline-none"
            >
              Login
            </button>
          </div> */}
        </div>
        {/* <!-- /nav --> */}

        {/* <!-- hero section --> */}
        <div className="mx-auto flex grow flex-col justify-center text-left">
          <div className="text-5xl font-semibold leading-none text-gray-900 lg:text-6xl">
            {/* Encontre. <br className="md:hidden" /> Converse.{' '}
            <br className="md:hidden" /> Capte. <br /> */}
            Os melhores fundos de VC do Brasil em um só lugar.
          </div>
          <div className="text-true-gray-500 mt-6 text-xl font-light antialiased">
            Aqui você encontra os melhores investidores pro futuro da sua
            startup.
          </div>
          {/* <button
            onClick={() => router.push('/redirect')}
            className="mt-6 w-fit rounded-full bg-gradient-to-b from-clam-600 to-clam-500 px-8 py-4 font-normal tracking-wide text-white outline-none"
          >
            Cadastre sua Startup Aqui!
          </button> */}
        </div>
      </div>
      <div className="mb-24 w-2/3 max-w-4xl flex-row justify-center rounded border-1 border-neutral-300 bg-neutral-50">
        {!companiesState && (
          <>
            <div className="p-6 text-xl">
              Preencha as informações abaixo para ver quais fundos tem fit com
              sua tese.
            </div>
            <div className="px-24">
              <StartupSimpleForm
                onSubmit={(data: {
                  name: string;
                  url: string;
                  linkedin: string;
                  stage: null;
                  thesis: null;
                }) => {
                  getCompaniesSimple(data, setCompaniesState);
                  // startupInfo.setData(data);
                  // router.push('/funds/');
                }}
              />
            </div>
          </>
        )}
        {companiesState && (
          <>
            <div className="p-8 text-lg">
              Estes são os fundos com fit na sua tese!
            </div>
            <div className="mb-6 grid grid-cols-cards gap-4 px-8">
              {companiesState &&
                companiesState.map((company) => (
                  <FundCard
                    company={company}
                    key={company.id}
                    id={company.id}
                  />
                ))}
            </div>
          </>
        )}
      </div>

      {/* <div className="flex h-60 w-screen justify-center bg-neutral-500">
        <div className="flex w-[72rem] items-center gap-8 px-8">
          <img src={'/evcf.webp'} alt="EVCF" className="h-16" />
          <img src={'/evcf.webp'} alt="EVCF" className="h-16" />
          <img src={'/evcf.webp'} alt="EVCF" className="h-16" />
          <img src={'/evcf.webp'} alt="EVCF" className="h-16" />
        </div>
      </div> */}
      {/* <!-- /hero section --> */}
    </div>
  );
}
