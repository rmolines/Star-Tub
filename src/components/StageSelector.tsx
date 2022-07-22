import { collection, getFirestore, orderBy, query } from 'firebase/firestore';
import { app } from 'firebaseConfig';
import React from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Control } from 'react-hook-form';

import { ControllerSelect } from './ControllerSelect';

export const stages = [
  'Anjo',
  'Pre Seed',
  'Seed',
  'Series A',
  'Series B',
  'Series C',
  'Aceleração',
  'Series D',
  'Series E+',
  'Venture Debt',
];

export function StageSelector<Type>({
  control,
  isMulti = false,
  disabled = false,
}: {
  control: Control<Type, object>;
  isMulti?: boolean;
  disabled?: boolean;
}) {
  const [values] = useCollection(
    query(collection(getFirestore(app), 'stages'), orderBy('order'))
  );

  return (
    <ControllerSelect
      control={control}
      isMulti={isMulti}
      values={values}
      label="Estágio"
      name="stage"
      disabled={disabled}
    />
  );
}
