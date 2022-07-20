import {
  addDoc,
  collection,
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  getDocs,
  getFirestore,
  orderBy,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { app } from 'firebaseConfig';
import { SetStateAction } from 'react';

import {
  FilterDataType,
  FundFormValues,
  StartupFormValues,
} from '@/types/companyTypes';

export const getCompanies = async (
  filterData: FilterDataType | null,
  setCompaniesState: (
    value: SetStateAction<QueryDocumentSnapshot<unknown>[] | null>
  ) => void,
  viewType: string
) => {
  let companiesPromises: Promise<QuerySnapshot<unknown>>[] = [];

  if (filterData && Object.entries(filterData).length > 0) {
    Object.entries(filterData).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        companiesPromises = companiesPromises.concat([
          getDocs(
            query(
              collection(
                getFirestore(app),
                viewType === 'funds' ? 'funds' : 'companies'
              ),
              where(key, 'array-contains-any', value)
            )
          ),
        ]);
      } else if (key === 'stage' && value !== null) {
        companiesPromises = companiesPromises.concat([
          getDocs(
            query(
              collection(
                getFirestore(app),
                viewType === 'funds' ? 'funds' : 'companies'
              ),
              where(key, 'array-contains', value)
            )
          ),
        ]);
      }
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

  const companiesDocs: { [key: string]: QueryDocumentSnapshot<unknown> } = {};
  const companies = await Promise.all(companiesPromises);

  companies.forEach((company, ind) => {
    if (ind === 0) {
      company.docs.forEach((docShadow) => {
        companiesDocs[docShadow.id] = docShadow;
      });
    } else {
      Object.keys(companiesDocs).forEach((key) => {
        if (!company.docs.map((docShadow) => docShadow.id).includes(key)) {
          delete companiesDocs[key];
        }
      });
    }
  });

  setCompaniesState(Object.values(companiesDocs));
};

export const getCompanyInfo = async (fundId: string) => {
  const company = await getDoc(doc(getFirestore(app), 'funds', fundId));

  const getLogoURL = async () => {
    let tempURL: string | undefined;
    if (
      company.get('logoPath') &&
      company.get('logoPath').split('.').pop() !== 'undefined'
    ) {
      const iconRef = ref(getStorage(), company.get('logoPath'));
      tempURL = await getDownloadURL(iconRef);
    }
    return tempURL;
  };

  return [company, await getLogoURL()];
};

export const getFundInfo = async (fundId: string) => {
  const company = await getDoc(doc(getFirestore(app), 'funds', fundId));

  const getLogoURL = async () => {
    let tempURL: string | undefined;
    if (
      company.get('logoPath') &&
      company.get('logoPath').split('.').pop() !== 'undefined'
    ) {
      const iconRef = ref(getStorage(), company.get('logoPath'));
      tempURL = await getDownloadURL(iconRef);
    }
    return tempURL;
  };

  return { company, logoURL: await getLogoURL() };
};

export const registerFounder = async (data: StartupFormValues, sub: string) => {
  const user = await getDoc(doc(getFirestore(app), 'users', sub));

  const companyData = {
    name: data.name,
    url: data.url,
    linkedin: data.linkedin,
    description: data.description,
    stage: data.stage,
    state: data.state,
    thesis: data.thesis,
  };

  let company = null;

  if (
    user.exists() &&
    user.get('companyId') &&
    (
      await getDoc(doc(getFirestore(app), 'companies', user.get('companyId')))
    ).exists()
  ) {
    await updateDoc(
      doc(getFirestore(app), 'companies', user.get('companyId')),
      companyData
    );

    company = await getDoc(
      doc(getFirestore(app), 'companies', user.get('companyId'))
    );
  } else {
    company = await addDoc(
      collection(getFirestore(app), 'companies'),
      companyData
    );
  }

  if (data.logo[0]) {
    const logoPath = `logos/${company.id}/logo.${data.logo[0]?.type
      .split('/')
      .pop()}`;

    await updateDoc(doc(getFirestore(app), `companies/${company.id}`), {
      logoPath,
    });

    const iconRef = ref(getStorage(), logoPath);

    data.logo[0]?.arrayBuffer().then((buffer) =>
      uploadBytes(iconRef, buffer, {
        contentType: data.logo[0]?.type,
      })
    );
  }

  if (data.deck[0]) {
    const deckPath = `decks/${company.id}/deck.${data.deck[0]?.type
      .split('/')
      .pop()}`;

    await updateDoc(doc(getFirestore(app), `companies/${company.id}`), {
      deckPath,
    });

    const iconRef = ref(getStorage(), deckPath);

    data.deck[0]?.arrayBuffer().then((buffer) =>
      uploadBytes(iconRef, buffer, {
        contentType: data.deck[0]?.type,
      })
    );
  }

  await setDoc(doc(getFirestore(app), 'users', sub), {
    userType: 'founder',
    companyId: company.id,
  });
  return null;
};

export const registerInvestor = async (data: FundFormValues, sub: string) => {
  const user = await getDoc(doc(getFirestore(app), 'users', sub));

  const fundData = {
    name: data.name,
    description: data.description,
    stage: data.stage,
    thesis: data.thesis,
    state: data.state,
    types: data.types,
    minInvestment: parseInt(data.minInvestment, 10),
    maxInvestment: parseInt(data.maxInvestment, 10),
  };

  let fund = null;

  if (
    user.exists() &&
    user.get('companyId') &&
    (await (
      await getDoc(doc(getFirestore(app), 'funds', user.get('companyId')))
    ).exists())
  ) {
    await updateDoc(
      doc(getFirestore(app), 'funds', user.get('companyId')),
      fundData
    );

    fund = await getDoc(doc(getFirestore(app), 'funds', user.get('companyId')));
  } else {
    fund = await addDoc(collection(getFirestore(app), 'funds'), fundData);
  }

  if (data.logo[0]) {
    const logoPath = `logos/${fund.id}/logo.${data.logo[0]?.type
      .split('/')
      .pop()}`;

    await updateDoc(doc(getFirestore(app), `funds/${fund.id}`), {
      logoPath,
    });

    const iconRef = ref(getStorage(), logoPath);

    data.logo[0]?.arrayBuffer().then((buffer) =>
      uploadBytes(iconRef, buffer, {
        contentType: data.logo[0]?.type,
      })
    );
  }
  await setDoc(doc(getFirestore(app), 'users', sub), {
    userType: 'investor',
    companyId: fund.id,
  });

  return null;
};

export const getFileURL = async (
  field: string,
  company: DocumentSnapshot<DocumentData>
) => {
  let tempURL: string | undefined;
  if (
    company.get(field) &&
    company.get(field).split('.').pop() !== 'undefined'
  ) {
    const iconRef = ref(getStorage(), company.get(field));
    tempURL = await getDownloadURL(iconRef);
  }
  return tempURL;
};
