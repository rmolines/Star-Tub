import { Dispatch, SetStateAction } from 'react';

export type StartupFormValues = {
  name: string;
  url: string;
  description: string;
  stage: { value: string; label: string };
  state: { value: string; label: string };
  thesis: { value: string; label: string }[];
  linkedin: string;
  logo: FileList;
  deck: FileList;
};

export type StartupSimpleFormValues = {
  name: string;
  url: string;
  stage: { value: string; label: string } | null;
  thesis: { value: string; label: string }[] | null;
  linkedin: string;
  setData: Dispatch<
    SetStateAction<{
      name: string;
      url: string;
      linkedin: string;
      stage: null;
      thesis: null;
    }>
  >;
};

export type FundFormValues = {
  firstName: string;
  lastName: string;
  name: string;
  description: string;
  stage: { value: string; label: string }[];
  thesis: { value: string; label: string }[];
  state: { value: string; label: string };
  types: { value: string; label: string }[];
  logo: FileList;
  minInvestment: string;
  maxInvestment: string;
};
export type EVCFFormValues = {
  firstName: string;
  lastName: string;
  fund: { value: string; label: string };
};

export type CompanyDictType = {
  name: string;
  logoURL: string | undefined;
  sector: string;
  tech: string;
  model: string;
  state: string;
  stage: string;
};
export type CompaniesDictType = {
  [key: string]: CompanyDictType;
};
export type FilterFormValues = {
  stage: {
    value: string;
    label: string;
  };
  state: {
    value: string;
    label: string;
  };
  thesis: {
    value: string;
    label: string;
  };
};

export type FilterDataType = {
  [key: string]: {
    value: string;
    label: string;
  }[];
};
