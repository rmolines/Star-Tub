import React from 'react';
import { Control, Controller, Path } from 'react-hook-form';
import Select from 'react-select/';

import { StartupFormValues } from '@/types/companyTypes';

export function ControllerSelectNew({
  control,
  isMulti,
  values,
  label,
  name,
  disabled = false,
}: {
  control: Control<any, object>;
  isMulti: boolean;
  isFund?: boolean;
  values: { label: any; value: string }[] | undefined;
  label: string;
  name: Path<StartupFormValues>;
  disabled?: boolean;
}) {
  // if (isFund && valuesList) {
  //   valuesList = [{ value: 'Todos', label: 'Todos' }].concat(valuesList);
  // }

  return (
    <Controller
      control={control}
      rules={{ required: true }}
      name={name}
      render={({ field }) => (
        <div className="flex w-full flex-col">
          <label className="mb-2 text-xs text-slate-600">{label}</label>
          <Select
            defaultValue={field.value}
            {...field}
            placeholder="Selecionar..."
            isMulti={isMulti}
            isDisabled={disabled}
            isSearchable={false}
            className="text-sm text-slate-700 selection:border-none"
            options={values}
          />
        </div>
      )}
    />
  );
}
