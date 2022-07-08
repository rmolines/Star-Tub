import { collection, getFirestore, orderBy, query } from 'firebase/firestore';
import { app } from 'firebaseConfig';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Control } from 'react-hook-form';

import { ControllerSelect } from './ControllerSelect';

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
];

export function SectorSelect({
  control,
  isMulti = false,
}: {
  control: Control<any, object>;
  isMulti?: boolean;
}) {
  const [values] = useCollection(
    query(collection(getFirestore(app), 'sectors'), orderBy('order'))
  );

  return (
    <ControllerSelect
      control={control}
      isMulti={isMulti}
      values={values}
      label="Sector"
      name="sector"
    />
  );
}
