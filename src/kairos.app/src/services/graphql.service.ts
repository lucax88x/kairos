import axios from 'axios';

export interface GraphQLError {
  message: string;
  path: string[];
}

export interface GraphQlResponse<T> {
  data: T;
  errors: GraphQLError[];
}

export function query<R, D>(query: string, data?: D): Promise<R> {
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
