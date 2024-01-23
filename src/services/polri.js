import http from '../lib/https-polri';

export const getUserProfile = ({ token }) =>
  new Promise(async (resolve, reject) => {
    try {
      const respon = await http().get(`/ext/user/detail`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          token,
        },
      });
      if (respon.data) {
        resolve(respon.data);
      }
    } catch (err) {
      const message = err.response
        ? `${err.response.data.message}`
        : 'Oops, something wrong with our server, please try again later.';
      reject(message);
    }
  });
