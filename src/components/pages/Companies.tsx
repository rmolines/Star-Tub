import { QueryDocumentSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { useUserInfo } from '@/context/UserInfoContext';
import { DashboardLayout, LayoutType } from '@/templates/DashboardLayout';
import { FilterDataType } from '@/types/companyTypes';
import { getCompanies } from '@/utils/functions';

import CompanyCard from '../CompanyCard';
import { FilterForm } from '../FilterForm';
import FundCard from '../FundCard';

export default function Companies() {
  const router = useRouter();
  const userType = router.route.split('/')[1];
  const viewType = router.route.split('/')[2];
  const { companyInfo, loading } = useUserInfo();

  const initialData =
    userType === 'founder' && !loading
      ? {
          stage: companyInfo.get('stage'),
          thesis: companyInfo.get('thesis'),
        }
      : undefined;

  const [companiesState, setCompaniesState] = useState<
    QueryDocumentSnapshot<unknown>[] | null
  >(null);
  const [filterData, setFilterData] = useState<FilterDataType | null>(null);

  useEffect(() => {
    if (userType === 'founder' && viewType && filterData && !loading) {
      getCompanies(filterData, setCompaniesState, viewType);
    } else if (userType === 'investor' && viewType) {
      getCompanies(filterData, setCompaniesState, viewType);
    }
  }, [filterData, viewType, loading]);

  return (
    <DashboardLayout
      type={userType === 'investor' ? LayoutType.investor : LayoutType.founder}
    >
      {initialData && (
        <FilterForm
          setFilterData={setFilterData}
          disabled
          initialData={initialData}
        />
      )}
      {userType === 'founder' && !loading && (
        <div className="mb-4 text-sm italic text-slate-800">
          Segundo as informações de cadastro da sua startup, estes são os fundos
          com perfil de investir na/o {companyInfo.get('name')}.
        </div>
      )}
      <div className="grid grid-cols-cards gap-4">
        {/* <input type="file" onChange={changePopulateHandler} /> */}
        {companiesState &&
          companiesState.map((company) =>
            viewType === 'funds' ? (
              <FundCard company={company} key={company.id} id={company.id} />
            ) : (
              <CompanyCard company={company} key={company.id} id={company.id} />
            )
          )}
      </div>
    </DashboardLayout>
  );
}
