import { collection, getFirestore, orderBy, query } from 'firebase/firestore';
import { app } from 'firebaseConfig';
import React from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { UseFormRegister } from 'react-hook-form';

import { CompanyFormValues } from '@/pages/founder/company/types';

export const stages = ['Pre-seed', 'Seed', 'Series A', 'Series B', 'Series C+'];

export function StageSelector({
  register,
}: {
  register: UseFormRegister<CompanyFormValues>;
}) {
  const [values] = useCollection(
    query(collection(getFirestore(app), 'stages'), orderBy('value'))
  );

  return (
    <div className="mt-2 flex w-full flex-col">
      <label className="text-xs text-slate-600">Company stage</label>
      <select
        {...register('stage')}
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
