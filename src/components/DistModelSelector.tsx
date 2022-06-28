import { collection, getFirestore, orderBy, query } from 'firebase/firestore';
import { app } from 'firebaseConfig';
import React from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { UseFormRegister } from 'react-hook-form';

export const models = ['B2B', 'B2C', 'B2B2C', 'P2G', 'P2P'];

export function DistModelSelector({
  register,
}: {
  register: UseFormRegister<any>;
}) {
  const [values] = useCollection(
    query(collection(getFirestore(app), 'models'), orderBy('value'))
  );

  return (
    <div className="mt-2 flex w-1/2 flex-col">
      <label className="text-xs text-slate-600">Distribution model</label>
      <select
        {...register('model')}
        className="w-full rounded border-1 border-slate-300 py-1 px-2 text-sm text-slate-700"
      >
        {values?.docs.map((e) => (
          <option value={e.id} key={e.id}>
            {e.data().value}
          </option>
        ))}
      </select>
    </div>
  );
}
