import {
  collection,
  getDocs,
  getFirestore,
  orderBy,
  query,
  QuerySnapshot,
  where,
} from 'firebase/firestore';
import { app } from 'firebaseConfig';
import { SetStateAction } from 'react';

import { FilterDataType } from '@/types/companyTypes';

export const getCompanies = async (
  filterData: FilterDataType | null,
  setCompaniesState: (
    value: SetStateAction<QuerySnapshot<unknown>[] | null>
  ) => void,
  viewType: string
) => {
  let companiesPromises: Promise<QuerySnapshot<unknown>>[] = [];

  if (filterData && Object.entries(filterData).length > 0) {
    Object.entries(filterData).forEach(([key, value]) => {
      companiesPromises = companiesPromises.concat([
        getDocs(
          query.apply(
            this,
            // @ts-ignore
            [
              collection(
                getFirestore(app),
                viewType === 'funds' ? 'funds' : 'companies'
              ),
            ].concat(
              // @ts-ignore
              value.length > 0 ? [where(key, 'array-contains-any', value)] : []
            )
          )
        ),
      ]);
    });
  } else {
    companiesPromises = companiesPromises.concat([
      getDocs(
        query.apply(
          this,
          // @ts-ignore
          [
            collection(
              getFirestore(app),
              viewType === 'funds' ? 'funds' : 'companies'
            ),
            orderBy('name'),
          ]
        )
      ),
    ]);
  }

  const companies = await Promise.all(companiesPromises);

  setCompaniesState(companies);
};
