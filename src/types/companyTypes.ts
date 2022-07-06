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
