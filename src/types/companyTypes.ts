export type CompanyFormValues = {
  name: string;
  url: string;
  description: string;
  stage: { value: string; label: string }[];
  sector: string;
  tech: string;
  model: string;
  state: string;
  linkedin: string;
  logo: FileList;
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
  tech: {
    value: string;
    label: string;
  };
  model: {
    value: string;
    label: string;
  };
  sector: {
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
