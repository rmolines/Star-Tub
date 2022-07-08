import Dinero from 'dinero.js';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';
import Image from 'next/image';
import router from 'next/router';
import React, { useEffect, useState } from 'react';
import { BsCurrencyDollar } from 'react-icons/bs';
import { GiProgression } from 'react-icons/gi';
import { GoLinkExternal } from 'react-icons/go';
import { GrMoney } from 'react-icons/gr';
import { TbBuildingStore } from 'react-icons/tb';

function FundCard({
  company: fund,
  id,
}: {
  company: QueryDocumentSnapshot<unknown> | undefined;
  id: string;
}) {
  const [logoURL, setLogoURL] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (fund) {
      // TODO fix this shit
      const getLogoURL = async () => {
        try {
          const iconRef = ref(getStorage(), fund.get('logoPath'));
          getDownloadURL(iconRef)
            .then((URL) => setLogoURL(URL))
            .catch(() => null);
        } catch (e) {
          setLogoURL(undefined);
        }
      };
      getLogoURL();
    }
  }, [fund]);

  const formatCheckSize = (value: number) => {
    // let million = false;
    let thousand = false;
    let divider = 1;
    if (value > 999 && value < 999999) {
      divider = 1000;
      thousand = true;
    } else if (value > 999999 && value > 999) {
      divider = 1000000;
      // million = true;
    }

    const suffix = thousand ? 'k' : 'm';
    let checkSize = 'N/A';
    checkSize = !Number.isNaN(value)
      ? Dinero({
          amount: value,
          currency: 'BRL',
          precision: 0,
        })
          .divide(divider)
          .setLocale('pt-BR')
          .toFormat('$0,0') + suffix
      : 'N/A';

    return checkSize;
  };

  return (
    <div className="flex h-full flex-col justify-between gap-2 rounded bg-white p-4 text-slate-900 shadow drop-shadow">
      <div className="mb-2 flex w-full items-center justify-between gap-4 border-b-1 border-slate-200 pb-2">
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
          <div className="ml-1 text-lg font-semibold">
            <div className="">{fund?.get('name')}</div>
          </div>
        </div>
        <div
          onClick={() => router.push(`companies/company/${id}`)}
          className="cursor-pointer p-1 text-lg text-slate-400 hover:text-slate-800"
        >
          <GoLinkExternal />
        </div>
      </div>
      <div className="flex h-full w-full flex-col justify-around text-sm">
        <div className="flex flex-col">
          <div className="rounded">
            <label className="flex items-center gap-1 text-xs font-semibold text-slate-600">
              Tipo de Fundo
              <GrMoney />
            </label>
          </div>
          <div className="mb-1 flex flex-wrap gap-x-2 gap-y-1">
            {fund?.get('types').length > 0 ? (
              fund?.get('types').map((e: any) => (
                <div
                  className="mb-1 rounded border-1 border-slate-300 px-1.5 text-slate-700"
                  key={e.value}
                >
                  {e.label}
                </div>
              ))
            ) : (
              <div className="mb-1 rounded border-1 border-slate-300 px-1.5 text-slate-700">
                {'N/A'}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="rounded">
            <label className="flex items-center gap-1 text-xs font-semibold text-slate-600">
              Estágio
              <GiProgression />
            </label>
          </div>
          <div className="mb-1 flex flex-wrap gap-x-2 gap-y-1">
            {fund?.get('stage').length > 0 ? (
              fund?.get('stage').map((e: any) => (
                <div
                  className="mb-1 rounded border-1 border-slate-300 px-1.5 text-slate-700"
                  key={e.value}
                >
                  {e.label}
                </div>
              ))
            ) : (
              <div className="mb-1 rounded border-1 border-slate-300 px-1.5 text-slate-700">
                {'N/A'}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="rounded">
            <label className="flex items-center gap-1 text-xs font-semibold text-slate-600">
              Modelo
              <TbBuildingStore />
            </label>
          </div>
          <div className="mb-1 flex flex-wrap gap-x-2 gap-y-1">
            {fund?.get('model').length > 0 ? (
              fund?.get('model').map((e: any) => (
                <div
                  className="mb-1 rounded border-1 border-slate-300 px-1.5 text-slate-700"
                  key={e.value}
                >
                  {e.label}
                </div>
              ))
            ) : (
              <div className="mb-1 rounded border-1 border-slate-300 px-1.5 text-slate-700">
                {'N/A'}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="rounded">
            <label className="flex items-center gap-1 text-xs font-semibold text-slate-600">
              Cheque
              <BsCurrencyDollar />
            </label>
          </div>
          <div className="mb-1 flex flex-wrap gap-x-2 gap-y-1">
            <div className="mb-1 rounded border-1 border-slate-300 px-1.5 text-slate-700">
              {formatCheckSize(fund?.get('minInvestment'))} -{' '}
              {formatCheckSize(fund?.get('maxInvestment'))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FundCard;
