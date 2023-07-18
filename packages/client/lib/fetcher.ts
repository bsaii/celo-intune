import axios from 'axios';

export const fetcher = <T>(url: string): Promise<void | T> =>
  axios
    .get<T>(url)
    .then((res) => res.data)
    .catch((err) => console.error(err));
