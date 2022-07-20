import { QueryDocumentSnapshot } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import Image from 'next/image';
import router from 'next/router';
import React, { useEffect, useState } from 'react';
import { GoLinkExternal } from 'react-icons/go';

function CompanyCard({
  company,
  id,
}: {
  company: QueryDocumentSnapshot<unknown> | undefined;
  id: string;
}) {
  const [logoURL, setLogoURL] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (company) {
      // TODO fix this shit
      const getLogoURL = async () => {
        try {
          const iconRef = ref(getStorage(), company.get('logoPath'));
          getDownloadURL(iconRef)
            .then((URL) => setLogoURL(URL))
            .catch(() => null);
        } catch (e) {
          setLogoURL(undefined);
        }
      };
      getLogoURL();
    }
  }, [company]);

  return (
    <div className="flex h-full flex-col justify-start gap-2 rounded bg-white p-4 text-slate-900 shadow drop-shadow">
      <div className="flex w-full items-center justify-between gap-4">
        <div className="flex items-center justify-center gap-2">
          <div className="relative">
            <Image
              src={
                logoURL ??
                'https://blog.iprocess.com.br/wp-content/uploads/2021/11/placeholder.png'
              }
              placeholder={'blur'}
              blurDataURL="https://blog.iprocess.com.br/wp-content/uploads/2021/11/placeholder.png"
              width={40}
              height={40}
              alt="logo"
              className="rounded"
              layout="fixed"
              quality={100}
            />
          </div>
          <div className="text-lg font-semibold">
            <div className="">{company?.get('name')}</div>
          </div>
        </div>
        <div
          onClick={() => router.push(`companies/company/${id}`)}
          className="cursor-pointer p-1 text-lg text-slate-400 hover:text-slate-800"
        >
          <GoLinkExternal />
        </div>
      </div>
      <div className="flex w-full gap-x-2 text-sm">
        <div>
          <div className="rounded">
            {/* <label className="flex items-center gap-1 text-xs font-bold text-slate-700">
              Estágio
              <GiProgression />
            </label> */}
          </div>
          <div className="mb-1 flex flex-wrap gap-x-2 gap-y-1">
            <div className="mb-1 rounded border-1 border-slate-300 px-1.5 text-slate-700">
              {company?.get('stage').label}
            </div>
          </div>
        </div>
        <div>
          <div className="rounded">
            {/* <label className="flex items-center gap-1 text-xs font-bold text-slate-700">
              Tese
              <GrOverview />
            </label> */}
          </div>
          <div className="mb-1 flex flex-wrap gap-x-2 gap-y-1">
            {company?.get('thesis').map((e: any) => (
              <div
                className="mb-1 rounded border-1 border-slate-300 px-1.5 text-slate-700"
                key={e.value}
              >
                {e.label}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="text-xs font-bold text-slate-800">Descrição</div>
        <div className="rounded p-1 text-xs text-slate-800">
          {company?.get('description')}
        </div>
      </div>
    </div>
  );
}

export default CompanyCard;
