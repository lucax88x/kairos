import { immerable } from 'immer';

export class CountryModel {
  [immerable] = true;

  constructor(public countryCode: string, public country: string) {}

  static fromOutModel(outModel: CountryOutModel) {
    return new CountryModel(outModel.countryCode, outModel.country);
  }

  static empty: CountryModel = new CountryModel('', '');

  isEmpty() {
    return (
      this.country === CountryModel.empty.country &&
      this.countryCode === CountryModel.empty.countryCode
    );
  }
}

export interface CountryOutModel {
  countryCode: string;
  country: string;
}
