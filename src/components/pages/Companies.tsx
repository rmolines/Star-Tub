import { QuerySnapshot } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { DashboardLayout, LayoutType } from '@/templates/DashboardLayout';
import { FilterDataType } from '@/types/companyTypes';
import { getCompanies } from '@/utils/functions';

import CompanyCard from '../CompanyCard';
import { FilterForm } from '../FilterForm';

export default function Companies() {
  const router = useRouter();
  const userType = router.route.split('/')[1];
  const viewType = router.route.split('/')[2];

  const [companiesState, setCompaniesState] =
    useState<QuerySnapshot<unknown> | null>(null);
  const [filterData, setFilterData] = useState<FilterDataType | null>(null);

  // const changeHandler = async (event) => {
  //   // Passing file data (event.target.files[0]) to parse using Papa.parse
  //   Papa.parse(event.target.files[0], {
  //     header: true,
  //     skipEmptyLines: true,
  //     complete(results) {
  //       results.data.map((d) => {
  //         populateCompanies(d);
  //       });
  //     },
  //   });
  // };

  useEffect(() => {
    // populate(tech, 'tech');
    // populate(sectors, 'sectors');
    // populate(states, 'states');
    // populate(stages, 'stages');
    // populate(models, 'models');
    if (viewType) {
      getCompanies(filterData, setCompaniesState, viewType);
    }
  }, [filterData, viewType]);

  return (
    <DashboardLayout
      type={userType === 'investor' ? LayoutType.investor : LayoutType.founder}
    >
      <FilterForm setFilterData={setFilterData} />
      <div className="grid h-full grid-cols-cards gap-4">
        {/* <input type="file" onChange={changeHandler} /> */}
        {companiesState &&
          companiesState.docs.map((e) => (
            <CompanyCard company={e} key={e.id} id={e.id} />
          ))}
      </div>
    </DashboardLayout>
  );
}
