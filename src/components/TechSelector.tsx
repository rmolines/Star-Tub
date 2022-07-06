import { collection, getFirestore, orderBy, query } from 'firebase/firestore';
import { app } from 'firebaseConfig';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Control } from 'react-hook-form';

import { ControllerSelect } from './ControllerSelect';

export const tech = [
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
];

export function TechSelector({
  control,
  isMulti = false,
}: {
  control: Control<any, object>;
  isMulti?: boolean;
}) {
  const [values] = useCollection(
    query(collection(getFirestore(app), 'tech'), orderBy('order'))
  );

  return (
    <ControllerSelect
      control={control}
      isMulti={isMulti}
      values={values}
      label="Technology"
      name="tech"
    />
  );
}
