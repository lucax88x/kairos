import axios from 'axios';

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
      const result = await axios.post<GraphQlResponse<R>>('/graphql', {
        query,
        variables: data,
      });

      if (!result.data.errors) {
        resolve(result.data.data);
        return;
      }

      reject({ message: result.data.errors[0].message });
    } catch (err) {
      reject({ message: err });
    }
  });
}

export function query<R, P = {}>(query: string, data?: P): Promise<R> {
  return call<R, P>(query, data);
}

export function mutation<R, P>(mutation: string, data?: P): Promise<R> {
  return call<R, P>(mutation, data);
}
