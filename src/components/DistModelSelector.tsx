import { collection, getFirestore, orderBy, query } from 'firebase/firestore';
import { app } from 'firebaseConfig';
import React from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Control } from 'react-hook-form';

import { ControllerSelect } from './ControllerSelect';

export const models = ['B2B', 'B2C', 'B2B2C', 'P2G', 'P2P'];

export function DistModelSelector({
  control,
  isMulti = false,
}: {
  control: Control<any, object>;
  isMulti?: boolean;
}) {
  const [values] = useCollection(
    query(collection(getFirestore(app), 'models'), orderBy('order'))
  );

  return (
    <ControllerSelect
      control={control}
      isMulti={isMulti}
      values={values}
      label="Model"
      name="model"
    />
  );
}
