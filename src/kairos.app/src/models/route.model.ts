export interface Route<Params = {}> {
  path: string;
  isExact: string | undefined;
  params: Params;
}
