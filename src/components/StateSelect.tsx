import { collection, getFirestore, orderBy, query } from 'firebase/firestore';
import { app } from 'firebaseConfig';
import React from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Control } from 'react-hook-form';

import { ControllerSelect } from './ControllerSelect';

export const states = [
  'Acre',
  'Alagoas',
  'Amapá',
  'Amazonas',
  'Bahia',
  'Ceará',
  'Espírito Santo',
  'Goiás',
  'Maranhão',
  'Mato Grosso',
  'Mato Grosso do Sul',
  'Minas Gerais',
  'Pará',
  'Paraíba',
  'Paraná',
  'Pernambuco',
  'Piauí',
  'Rio de Janeiro',
  'Rio Grande do Norte',
  'Rio Grande do Sul',
  'Rondônia',
  'Roraima',
  'Santa Catarina',
  'São Paulo',
  'Sergipe',
  'Tocatins',
  'Distrito Federal',
];

function StateSelect({
  control,
  isMulti = false,
}: {
  control: Control<any, object>;
  isMulti?: boolean;
}) {
  const [values] = useCollection(
    query(collection(getFirestore(app), 'states'), orderBy('order'))
  );

  return (
    <ControllerSelect
      control={control}
      isMulti={isMulti}
      values={values}
      label="State"
      name="state"
    />
  );
}

export default StateSelect;
