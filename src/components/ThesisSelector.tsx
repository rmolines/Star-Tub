import { collection, getFirestore, orderBy, query } from 'firebase/firestore';
import { app } from 'firebaseConfig';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Control } from 'react-hook-form';

import { ControllerSelect } from './ControllerSelect';

export function ThesisSelector<Type>({
  control,
  isMulti = false,
  disabled = false,
}: {
  control: Control<Type, object>;
  isMulti?: boolean;
  disabled?: boolean;
}) {
  const [values] = useCollection(
    query(collection(getFirestore(app), 'thesis'), orderBy('value'))
  );

  return (
    <ControllerSelect
      control={control}
      isMulti={isMulti}
      values={values}
      label="Teses de Interesse*"
      name="thesis"
      disabled={disabled}
    />
  );
}