import CryptoJS from "crypto-js";

const env = import.meta.env;
export const decrypt = (val) => {
  try {
    const IV = env.VITE_APP_DECODE_IV;
    const KEY = env.VITE_APP_DECODE_KEY;
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
    console.log("ERRROR ===> failed decrypt:", err)
    return false;
  }
};
