import { collection, getFirestore, orderBy, query } from 'firebase/firestore';
import { app } from 'firebaseConfig';
import React from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Control } from 'react-hook-form';

import { ControllerSelectNew } from './ControllerSelectNew';

export function FundSelector<Type>({
  control,
  isMulti = false,
}: {
  control: Control<Type, object>;
  isMulti?: boolean;
}) {
  const [values] = useCollection(
    query(collection(getFirestore(app), 'funds'), orderBy('name'))
  );

  return (
    <ControllerSelectNew
      control={control}
      isMulti={isMulti}
      values={values?.docs.map((e) => ({ label: e.get('name'), value: e.id }))}
      label="Selecionar fundo"
      // @ts-ignore
      name="fund"
    />
  );
}
