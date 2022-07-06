import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  QuerySnapshot,
  where,
} from 'firebase/firestore';
import { app } from 'firebaseConfig';
import { SetStateAction } from 'react';

import { FilterDataType } from '@/pages/investor/companies/companiesTypes';

export const getCompanies = async (
  filterData: FilterDataType | null,
  setCompaniesState: (
    value: SetStateAction<QuerySnapshot<unknown> | null>
  ) => void,
  viewType: string
) => {
  let filterArray = [
    where('companyType', '==', viewType === 'funds' ? 'fund' : 'startup'),
  ];

  if (filterData) {
    Object.entries(filterData).forEach(([key, value]) => {
      if (value.length > 0) {
        filterArray = filterArray.concat([
          where(key, 'array-contains-any', filterData[key]),
        ]);
      }
    });
  }

  const companies = await getDocs(
    query.apply(
      this,
      // @ts-ignore
      [collection(getFirestore(app), 'companies')].concat(filterArray)
    )
  );

  setCompaniesState(companies);
};

export const populateCompanies = async (d: any) => {
  const description = d['Descrição Breve'];
  const linkedin = d['LinkedIn do Fundador(a) URL'];
  const name = d['Nome da Startup'];
  const url = d['Website URL'];
  const email = d['Email Fundador(a)'];

  const stage = await getDocs(
    query(
      collection(getFirestore(app), 'stages'),
      where('value', '==', d['Estágio'])
    )
  );
  const model = await getDocs(
    query(
      collection(getFirestore(app), 'models'),
      where('value', '==', d['Modelo de Distribuição'])
    )
  );
  const state = await getDocs(
    query(
      collection(getFirestore(app), 'states'),
      where('value', '==', d.Estado)
    )
  );
  const sector = await getDocs(
    query(
      collection(getFirestore(app), 'sectors'),
      where('value', '==', d.Setor)
    )
  );
  const tech = await getDocs(
    query(collection(getFirestore(app), 'tech'), where('value', '==', d.Tech))
  );

  addDoc(collection(getFirestore(app), 'companies'), {
    companyType: 'startup',
    description,
    linkedin,
    name,
    url,
    email,
    stage: [{ value: stage.docs[0]?.id, label: stage.docs[0]?.get('value') }],
    model: [{ value: model.docs[0]?.id, label: model.docs[0]?.get('value') }],
    state: [{ value: state.docs[0]?.id, label: state.docs[0]?.get('value') }],
    tech: [{ value: tech.docs[0]?.id, label: tech.docs[0]?.get('value') }],
    sector: [
      {
        value: sector.docs[0]?.id,
        label: sector.docs[0]?.get('value'),
      },
    ],
  });
};

export const populate = async (elements: string[], collectionvalue: string) => {
  elements.forEach((e, ind) => {
    addDoc(collection(getFirestore(app), collectionvalue), {
      value: e,
      order: ind,
    });
  });
};
