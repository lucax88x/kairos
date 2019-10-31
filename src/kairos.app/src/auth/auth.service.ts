import createAuth0Client from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';

import { Auth0UserModel, UserModel } from '../models/user.model';

const domain = 'kairos.eu.auth0.com';
const clientId = 'saJwYatwe1Fr2R0bmmGeTPk477XVgp1c';

class AuthService {
  initOptions: Auth0ClientOptions = {
    domain,
    client_id: clientId,
    redirect_uri: window.location.origin,
    audience: window.location.origin,
  };

  auth0ClientPromise: Promise<Auth0Client>;

  constructor() {
    this.auth0ClientPromise = createAuth0Client(this.initOptions);
  }

  async init(): Promise<UserModel> {
    const auth0Client = await this.auth0ClientPromise;

    try {
      await auth0Client.getTokenSilently();

      const authenticated = await auth0Client.isAuthenticated();
      if (authenticated) {
        const user: Auth0UserModel = await auth0Client.getUser();
        return new UserModel(user);
      }
    } catch (error) {
      console.error(error);
    }
    return UserModel.empty;
  }

  async login() {
    const auth0Client = await this.auth0ClientPromise;

    await auth0Client.loginWithRedirect();

    const authenticated = await auth0Client.isAuthenticated();

    if (authenticated) {
      const user: Auth0UserModel = await auth0Client.getUser();
      return new UserModel(user);
    }

    return UserModel.empty;
  }

  async logout() {
    const auth0Client = await this.auth0ClientPromise;

    await auth0Client.logout({ client_id: clientId, returnTo: `${window.location.origin}/login` });
  }

  async getToken(): Promise<string> {
    const auth0Client = await this.auth0ClientPromise;

    return await auth0Client.getTokenSilently();
  }
}

export const authService = new AuthService();
