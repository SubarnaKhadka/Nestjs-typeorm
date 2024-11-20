export interface IFileInterface {
  path?: string;
  filename?: string;
  mime?: string;
  completeUrl?: string;
  baseUrl?: string;
  size?: number;
  description?: string;
  name?: string;
  isFeatured?: boolean;
  index?: number | null;
}
