import axios from 'axios';
import HttpStatus from 'http-status-codes';

import { authService } from '../auth/auth.service';

export interface GraphQLError {
  message: string;
  path: string[];
}

export interface GraphQlResponse<T> {
  data: T;
  errors: GraphQLError[];
}

function call<R, P = null>(query: string, data?: P): Promise<R> {
  return new Promise(async (resolve, reject) => {
    try {
      const token = await authService.getToken();

      const headers = { Authorization: `Bearer ${token}` };
      const result = await axios.post<GraphQlResponse<R>>(
        '/graphql',
        {
          query,
          variables: data,
        },
        {
          headers,
        },
      );

      if (!result.data.errors) {
        resolve(result.data.data);
        return;
      }

      // TODO: we can inspect 404 or stuffs like that here
      // result.data.errors[0].extensions.code
      reject({ message: result.data.errors[0].message });
    } catch (error) {
      console.error(error);

      // answer is from server
      if (!!error.response) {
        const { response } = error;

        switch (response.status) {
          case HttpStatus.UNAUTHORIZED:
          case HttpStatus.FORBIDDEN:
            authService.logout();
            reject({ message: 'Unauthorized' });
            break;
        }
      }

      // answer from auth0
      if (!!error.error && error.error === 'login_required') {
        authService.logout();
        reject({ message: 'Unauthorized' });
      }

      reject({ message: 'Error' });
    }
  });
}

export function query<R, P = {}>(query: string, data?: P): Promise<R> {
  return call<R, P>(query, data);
}

export function mutation<R, P>(mutation: string, data?: P): Promise<R> {
  return call<R, P>(mutation, data);
}
