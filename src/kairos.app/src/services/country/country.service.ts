import { map } from 'ramda';
import { CountryModel, CountryOutModel } from '../../models/country.model';
import { query } from '../graphql.service';
import { getCountriesQuery } from './queries/get-countries';

export async function getCountries() {
  const result = await query<{ countries: CountryOutModel[] }>(getCountriesQuery);

  return map(out => CountryModel.fromOutModel(out), result.countries);
}
