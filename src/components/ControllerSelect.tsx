import { DocumentData, QuerySnapshot } from 'firebase/firestore';
import React from 'react';
import { Control, Controller, Path } from 'react-hook-form';
import Select from 'react-select/';

import { CompanyFormValues } from '@/types/companyTypes';

export function ControllerSelect({
  control,
  isMulti,
  values,
  label,
  name,
}: {
  control: Control<any, object>;
  isMulti: boolean;
  values: QuerySnapshot<DocumentData> | undefined;
  label: string;
  name: Path<CompanyFormValues>;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <div className="flex w-full flex-col">
          <label className="text-xs text-slate-600">{label}</label>
          <Select
            defaultValue={field.value}
            {...field}
            placeholder="Todos"
            isMulti={isMulti}
            isSearchable={false}
            className="text-sm text-slate-700 selection:border-none"
            options={values?.docs.map((e) => ({
              value: e.id,
              label: e.get('value'),
            }))}
          />
        </div>
      )}
    />
  );
}
