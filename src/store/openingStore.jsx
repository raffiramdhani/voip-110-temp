import create from "zustand";

const useAuth = create((set) => ({
  isOpen: "welcome",
  //   name: "",
  //   email: "",
  //   phoneNumber: "",
  //   codeArea: "",
  privacyPolicy: false,

  setIsOpen: (value) =>
    set(() => ({
      isOpen: value,
    })),
  setPrivacyPolicy: (value) =>
    set(() => ({
      privacyPolicy: value,
    })),
//   addDataUser: (value) =>
//     set(() => ({
//       name: value.name,
//       email: value.email,
//       phoneNumber: value.phone_number,
//       codeArea: value.codeArea,
//     })),
}));

export default useAuth
