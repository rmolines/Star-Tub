import { collection, getFirestore, orderBy, query } from 'firebase/firestore';
import { app } from 'firebaseConfig';
import { useCollection } from 'react-firebase-hooks/firestore';
import { UseFormRegister } from 'react-hook-form';

import { CompanyFormValues } from '@/pages/founder/company/types';

export const sectors = [
  'Adtech',
  'Aerospace',
  'Agtech',
  'AutoTech',
  'BeautyTech',
  'BioTech',
  'CleanTech',
  'ConstruTech',
  'Cyber Segurança',
  'DeepTech',
  'EdTech',
  'EnerTech',
  'Entretenimento',
  'Eventos',
  'FashionTech',
  'FinTech',
  'FoodTech',
  'Gaming',
  'GovTech',
  'HealthTech',
  'HrTech',
  'Impacto',
  'Industry',
  'InsurTech',
  'LegalTech',
  'LogTech',
  'MarTech',
  'Mobilidade',
  'Oil and Gas',
  'PropTech',
  'RegTech',
  'RetailTech',
  'SalesTech',
  'Security',
  'Social Network',
  'SportsTech',
  'T.I.',
  'Telecom',
  'TravelTech',
  'A.I.',
  'Big Data / Analytics',
  'Blockchain',
  'Conectividade',
  'Extended Reality (AR/VR/MR)',
  'Gamefication',
  'Hardware',
  'Hardware',
  'IoT',
  'Marketplace',
  'Plataforma',
  'SaaS',
  'Adtechs, Construtech e Proptech',
];

export function SectorSelect({
  register,
}: {
  register: UseFormRegister<CompanyFormValues>;
}) {
  const [values] = useCollection(
    query(collection(getFirestore(app), 'sectors'), orderBy('value'))
  );

  return (
    <div className="mt-2 flex w-1/2 flex-col">
      <label className="text-xs text-slate-600">Sector</label>
      <select
        {...register('sector')}
        className="w-full rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700"
      >
        {values?.docs.map((e) => (
          <option key={e.id} value={e.id}>
            {e.data().value}
          </option>
        ))}
      </select>
    </div>
  );
}
