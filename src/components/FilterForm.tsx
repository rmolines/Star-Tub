import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { FilterDataType, FilterFormValues } from '@/types/companyTypes';

import { DistModelSelector } from './DistModelSelector';
import { SectorSelect } from './SectorSelect';
import { StageSelector } from './StageSelector';
import StateSelect from './StateSelect';
import { TechSelector } from './TechSelector';

export function FilterForm({
  setFilterData,
}: {
  setFilterData: Dispatch<SetStateAction<FilterDataType | null>>;
}) {
  const { control, watch } = useForm<FilterFormValues>();

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name) {
        if (
          name === 'stage' ||
          name === 'sector' ||
          name === 'state' ||
          name === 'model' ||
          name === 'tech'
        ) {
          if (value[name]) {
            // @ts-ignore
            setFilterData((prevData) => ({ ...prevData, [name]: value[name] }));
          }
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <form className="mb-4 flex gap-4">
      <StageSelector control={control} isMulti />
      <StateSelect control={control} isMulti />
      <TechSelector control={control} isMulti />
      <DistModelSelector control={control} isMulti />
      <SectorSelect control={control} isMulti />
    </form>
  );
}
