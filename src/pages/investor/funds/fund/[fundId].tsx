import { DocumentData, DocumentSnapshot } from 'firebase/firestore';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { BiLeftArrowAlt } from 'react-icons/bi';
import { BsLinkedin } from 'react-icons/bs';
import { GiProgression } from 'react-icons/gi';
import { GoLinkExternal } from 'react-icons/go';
import { GrOverview, GrTechnology } from 'react-icons/gr';
import { TbBuildingStore } from 'react-icons/tb';

import { DashboardLayout, LayoutType } from '@/templates/DashboardLayout';
import { getFundInfo } from '@/utils/functions';

export default function Company() {
  const router = useRouter();
  const [fundData, setFundData] =
    useState<DocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoURL, setLogoURL] = useState<string | undefined>('');

  useEffect(() => {
    if (typeof router.query.fundId === 'string') {
      getFundInfo(router.query.fundId).then(
        ({ company, logoURL: logoURLShadow }) => {
          setFundData(company);
          setLogoURL(logoURLShadow);
          setLoading(false);
        }
      );
    }
  }, [router.query]);

  return (
    <DashboardLayout type={LayoutType.investor}>
      {!loading && fundData && fundData.exists() && (
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
                  {fundData.get('name')}
                </div>
              </div>
              <div className="flex gap-2">
                {fundData.get('linkedin') && (
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`https://${fundData
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
                {fundData.get('url') && (
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={`https://${fundData.get('url').split('://').pop()}`}
                    className="flex cursor-pointer items-center gap-1 rounded border-1 border-slate-400 px-2 py-1 text-sm font-semibold text-slate-800 hover:border-1 hover:border-slate-400"
                  >
                    Visit Website
                    <GoLinkExternal />
                  </a>
                )}
              </div>
            </div>
            <div className="mx-6 border-l-2 border-slate-400 px-2 text-sm italic">
              {fundData.get('description')}
            </div>
          </div>
          <div className="lg:px-16">
            <div className="min-h-48 flex w-full flex-row flex-wrap justify-between gap-2 p-4 text-slate-900">
              <div className="flex flex-col">
                <label className="text flex items-center gap-1 text-xs text-slate-500">
                  Estágio
                  <GiProgression />
                </label>
                {fundData.get('stage').map((e: any) => (
                  <div
                    className="mb-1 rounded border-1 border-slate-300 px-1.5 text-slate-700"
                    key={e.value}
                  >
                    {e.label}
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <label className="text flex items-center gap-1 text-xs text-slate-500">
                  Modelo
                  <TbBuildingStore />
                </label>
                {fundData.get('model').map((e: any) => (
                  <div
                    className="mb-1 rounded border-1 border-slate-300 px-1.5 text-slate-700"
                    key={e.value}
                  >
                    {e.label}
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <label className="text flex items-center gap-1 text-xs text-slate-500">
                  Setor
                  <GrOverview />
                </label>
                {fundData.get('sector').map((e: any) => (
                  <div
                    className="mb-1 rounded border-1 border-slate-300 px-1.5 text-slate-700"
                    key={e.value}
                  >
                    {e.label}
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <label className="text flex items-center gap-1 text-xs text-slate-500">
                  Tech
                  <GrTechnology />
                </label>
                {fundData.get('tech').map((e: any) => (
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
        </>
      )}
    </DashboardLayout>
  );
}
