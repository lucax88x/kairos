import Axios, { AxiosResponse } from 'axios';
import HttpStatus from 'http-status-codes';

import { authService } from '../auth/auth.service';
import { i18n } from '../i18nLoader';
import { t } from '@lingui/macro';
import { saveAs } from 'file-saver';

async function call<R>(
  httpCall: (headers: { [key: string]: string }) => Promise<AxiosResponse<R>>,
) {
  return new Promise<AxiosResponse<R>>(async (resolve, reject) => {
    const token = await authService.getToken();

    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await httpCall(headers);
      resolve(response);
      return;
    } catch (error) {
      let message;
      let status;

      console.error(error);

      if (!!error.response) {
        const { response } = error;

        switch (response.status) {
          case HttpStatus.BAD_REQUEST:
            if (!!response.data && !!response.data.message) {
              message = response.data.message;
            } else {
              message = i18n._(t`Error, please retry later`);
            }
            break;
          case HttpStatus.UNAUTHORIZED:
          case HttpStatus.FORBIDDEN:
            authService.logout();
            message = i18n._(t`Error, please retry later`);
            break;
          case HttpStatus.NOT_FOUND:
            message = i18n._(t`Error, please retry later`);
            break;
          default:
          case HttpStatus.INTERNAL_SERVER_ERROR:
            message = i18n._(t`Error, please retry later`);
            break;
        }
        status = response.status;
      } else {
        status = HttpStatus.SERVICE_UNAVAILABLE;
      }

      reject({ message, status });
      return;
    }
  });
}

export async function post<T, R>(method: string, data: T): Promise<R> {
  const response = await call<R>(
    async headers => await Axios.post(`/api/${method}`, data, { headers }),
  );
  return response.data;
}

export async function put<T, R>(method: string, data: T): Promise<R> {
  const response = await call<R>(
    async headers => await Axios.put(`/api/${method}`, data, { headers }),
  );
  return response.data;
}

export async function patch<T, R>(method: string, data: T): Promise<R> {
  const response = await call<R>(
    async headers => await Axios.patch(`/api/${method}`, data, { headers }),
  );
  return response.data;
}

export async function get<R>(method: string): Promise<R> {
  const response = await call<R>(async headers => await Axios.get(`/api/${method}`, { headers }));
  return response.data;
}

export async function downloadFile(method: string): Promise<void> {
  const response = await call<Blob>(
    async headers => await Axios.get(`/api/${method}`, { headers, responseType: 'blob' }),
  );

  saveAs(response.data, estractFileName(response.headers['content-disposition']));
}

const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
function estractFileName(disposition: string) {
  let filename = '';
  if (disposition && disposition.indexOf('attachment') !== -1) {
    const matches = filenameRegex.exec(disposition);
    if (matches != null && matches[1]) {
      filename = matches[1].replace(/['"]/g, '');
    }
  }
  return filename;
}
