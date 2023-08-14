// import CryptoJS from "crypto-js";

// const env = import.meta.env;
// export const decrypt = (val, iv = null, key = null) => {
//   try {
//     const IV = iv ?? env.VITE_APP_DECODE_IV;
//     const KEY = key ?? env.VITE_APP_DECODE_KEY;
//     // var encrypted = CryptoJS.enc.Base64.parse(val);
//     var key = CryptoJS.enc.Utf8.parse(KEY);
//     var iv = CryptoJS.enc.Utf8.parse(IV);

//     var decrypted = CryptoJS.AES.decrypt(
//       val,
//       key,
//       {
//         iv: iv,
//         mode: CryptoJS.mode.CBC,
//         padding: CryptoJS.pad.Pkcs7,
//       }
//     );
//     return decrypted.toString(CryptoJS.enc.Utf8);
//   } catch (err) {
//     console.log("ERRROR ===> failed decrypt:", err);
//     return false;
//   }
// };

import CryptoJS from "crypto-js";

const env = import.meta.env;
export const decrypt = (val, iv = null, key = null) => {
  try {
    const IV = iv ?? env.VITE_APP_DECODE_IV;
    const KEY = key ?? env.VITE_APP_DECODE_KEY;
    var encrypted = CryptoJS.enc.Base64.parse(val);
    var key = CryptoJS.enc.Utf8.parse(KEY);
    var iv = CryptoJS.enc.Utf8.parse(IV);

    var decrypted = CryptoJS.AES.decrypt(
      {
        ciphertext: encrypted,
      },
      key,
      {
        iv: iv,
        mode: CryptoJS.mode.CTR,
        padding: CryptoJS.pad.NoPadding,
      }
    );
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (err) {
    console.log("ERRROR ===> failed decrypt:", err);
    return false;
  }
};

export const encrypt = (str) => {
  const enc = CryptoJS.AES.encrypt(
    str,
    CryptoJS.enc.Utf8.parse(env.VITE_APP_DECODE_KEY),
    {
      iv: CryptoJS.enc.Utf8.parse(env.VITE_APP_DECODE_IV),
      padding: CryptoJS.pad.NoPadding,
      mode: CryptoJS.mode.CTR,
    }
  );
  return enc.toString();
};
