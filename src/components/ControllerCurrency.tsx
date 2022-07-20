import React from 'react';
import { Control, Controller, Path } from 'react-hook-form';

const CurrencyFormat = require('react-currency-format');

export function ControllerCurrency<Type>({
  control,
  label,
  name,
}: {
  control: Control<Type, object>;
  label: string;
  name: Path<Type>;
}) {
  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: true }}
      render={({ field }) => (
        <div className="flex w-full flex-col">
          <label className="text-xs text-slate-600">{label}</label>
          <CurrencyFormat
            name={field.name}
            onBlur={field.onBlur}
            ref={field.ref}
            value={field.value}
            onValueChange={(values: any) => {
              field.onChange(values.value);
            }}
            thousandSeparator={'.'}
            decimalSeparator={','}
            prefix={'R$ '}
            className="rounded border-neutral-300 text-sm text-neutral-700"
          />
        </div>
      )}
    />
  );
}
