import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { FilterDataType, FilterFormValues } from '@/types/companyTypes';

import { StageSelector } from './StageSelector';
import { ThesisSelector } from './ThesisSelector';

export function FilterForm({
  setFilterData,
  disabled = false,
  initialData,
}: {
  setFilterData: Dispatch<SetStateAction<FilterDataType | null>>;
  initialData?: FilterDataType;
  disabled: boolean;
}) {
  const { control, watch, reset } = useForm<FilterFormValues>();

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name) {
        if (name === 'stage' || name === 'state' || name === 'thesis') {
          if (value[name]) {
            // @ts-ignore
            setFilterData((prevData) => ({ ...prevData, [name]: value[name] }));
          }
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  useEffect(() => {
    if (initialData) {
      reset(initialData);
      setFilterData(initialData);
    }
  }, []);

  return (
    <form className="mb-4 flex gap-4">
      {/* @ts-ignore */}
      <StageSelector control={control} isMulti disabled={disabled} />
      {/* @ts-ignore */}
      <ThesisSelector control={control} isMulti disabled={disabled} />
    </form>
  );
}
