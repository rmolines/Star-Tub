// 👇️ ts-nocheck ignores all ts errors in the file
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

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
    info: [
      {
        name: 'stage',
        value: stage.docs[0]?.id,
        label: stage.docs[0]?.get('value'),
      },
      {
        name: 'model',
        value: model.docs[0]?.id,
        label: model.docs[0]?.get('value'),
      },
      {
        name: 'state',
        value: state.docs[0]?.id,
        label: state.docs[0]?.get('value'),
      },
      {
        name: 'tech',
        value: tech.docs[0]?.id,
        label: tech.docs[0]?.get('value'),
      },
      {
        name: 'sector',
        value: sector.docs[0]?.id,
        label: sector.docs[0]?.get('value'),
      },
    ],
  });
};

export const populateFunds = async (d: any) => {
  const name = d.Nome;
  const type = d.Tipo.split(',');
  const stages = d['Estágio de Investimento'].split(',');
  const sectors = d['Setores e Tecnologias de Interesse'].split(',');
  const models = d['Modelos de Interesse'].split(',');
  const minInvestment = parseInt(
    d['Investimento Mínimo'].replace(/[^0-9]/g, '')
  );
  const avgInvestment = parseInt(
    d['Investimento Médio'].replace(/[^0-9]/g, '')
  );
  const maxInvestment = parseInt(
    d['Investimento Máximo'].replace(/[^0-9]/g, '')
  );

  const stage = await getDocs(query(collection(getFirestore(app), 'stages')));
  const model = await getDocs(query(collection(getFirestore(app), 'models')));
  const sector = await getDocs(query(collection(getFirestore(app), 'sectors')));
  const tech = await getDocs(query(collection(getFirestore(app), 'tech')));

  const typesList: { value: string; label: string }[] = [];

  const getTypes = () => {
    const promises: Promise<unknown>[] = [];

    type.forEach((element) => {
      promises.push(
        new Promise((resolve) => {
          getDocs(
            query(
              collection(getFirestore(app), 'fundTypes'),
              where('value', '==', element)
            )
          ).then((docs) => {
            if (docs.empty) {
              addDoc(collection(getFirestore(app), 'fundTypes'), {
                value: element,
              }).then((value) => {
                typesList.push({ value: value.id, label: element });
                resolve('resolved');
              });
            } else {
              typesList.push({
                value: docs.docs[0]?.id,
                label: docs.docs[0]?.get('value'),
              });
              resolve('resolved');
            }
          });
        })
      );
    });

    return promises;
  };

  await Promise.all(getTypes());

  addDoc(collection(getFirestore(app), 'funds'), {
    name,
    minInvestment,
    maxInvestment,
    avgInvestment,
    types: typesList,
    stage: stages.reduce((result, e) => {
      stage.docs.forEach((doc) => {
        if (doc.get('value') === e)
          result.push({ value: doc.id, label: doc.get('value') });
      });
      return result;
    }, []),
    tech: sectors.reduce((result, e) => {
      tech.docs.forEach((doc) => {
        if (doc.get('value') === e)
          result.push({ value: doc.id, label: doc.get('value') });
      });
      return result;
    }, []),
    model: models.reduce((result, e) => {
      model.docs.forEach((doc) => {
        if (doc.get('value') === e)
          result.push({ value: doc.id, label: doc.get('value') });
      });
      return result;
    }, []),
    sector: sectors.reduce((result, e) => {
      sector.docs.forEach((doc) => {
        if (doc.get('value') === e)
          result.push({ value: doc.id, label: doc.get('value') });
      });
      return result;
    }, []),
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

export const changePopulateHandler = async (event: any) => {
  // Passing file data (event.target.files[0]) to parse using Papa.parse
  const resolvePromises = async (results) => {
    for (const result of results.data) {
      populateFunds(result);
    }
  };

  Papa.parse(event.target.files[0], {
    header: true,
    skipEmptyLines: true,
    complete(results) {
      resolvePromises(results);
    },
  });
};

export const populateInfos = () => {
  populate(tech, 'tech');
  populate(sectors, 'sectors');
  populate(states, 'states');
  populate(stages, 'stages');
  populate(models, 'models');
};
