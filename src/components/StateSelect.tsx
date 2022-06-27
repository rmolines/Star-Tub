import { collection, getFirestore, orderBy, query } from 'firebase/firestore';
import { app } from 'firebaseConfig';
import React from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { UseFormRegister } from 'react-hook-form';

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

function StateSelect({ register }: { register: UseFormRegister<any> }) {
  const [values] = useCollection(
    query(collection(getFirestore(app), 'states'), orderBy('value'))
  );

  return (
    <>
      <label className="text-xs text-slate-600">State</label>
      <select
        {...register('state')}
        className="w-full rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700"
      >
        {values?.docs.map((e) => (
          <option key={e.id} value={e.id}>
            {e.data().value}
          </option>
        ))}
      </select>
    </>
  );
}

export default StateSelect;
