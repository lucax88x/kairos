export class UserModel {
  email = '';
  email_verified = false;
  family_name = '';
  given_name = '';
  locale = '';
  name = '';
  nickname = '';
  picture = '';
  sub = '';
  updated_at = '';

  constructor(auth0Model?: Auth0UserModel) {
    if (!!auth0Model) {
      this.email = auth0Model.email;
      this.email_verified = auth0Model.email_verified;
      this.family_name = auth0Model.family_name;
      this.given_name = auth0Model.given_name;
      this.locale = auth0Model.locale;
      this.name = auth0Model.name;
      this.nickname = auth0Model.nickname;
      this.picture = auth0Model.picture;
      this.sub = auth0Model.sub;
      this.updated_at = auth0Model.updated_at;
    }
  }

  static empty: UserModel = new UserModel();

  isEmpty() {
    return this.name === '' && this.email === '';
  }
}

export interface Auth0UserModel {
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  locale: string;
  name: string;
  nickname: string;
  picture: string;
  sub: string;
  updated_at: string;
}
