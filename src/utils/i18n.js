import i18next from "i18next";
import { initReactI18next } from "react-i18next";

i18next.use(initReactI18next).init({
  fallbackLng: "id",
  resources: {
    id: {
      translation: {
        call: {
          headline: {
            "Prioritas-Perbankan": "Prioritas Perbankan",
            "Prioritas-Hasanah": "Prioritas Hasanah Card",
            "Umum-Perbankan": "Layanan Umum Perbankan",
            "Umum-Hasanah": "Layanan Umum Hasanah Card",
          },
          descOne: {
            "Sedang Menghubungi": "Sedang menghubungi...",
            Berdering: "Berdering",
            "Panggilan Berakhir": "Panggilan berakhir",
          },
          descTwo: {
            RINGING:
              "Mohon tunggu ya kami sedang berusaha menghubungkan dengan agent kami",
            ESTABLISHED: "Kamu telah terhubung dengan agent kami",
          },
        },
        rating: {
          headline: "Berikan penilaian kamu atas layanan BSI Call",
          impression:
            "Terima kasih atas penilaian kamu! Apa yang berkesan dari pelayanan agent kami?",
          suggestion:
            "Beritahu kami apa yang bisa ditingkatkan dari pelayanan agent kami?",
          inputPlaceholder: "Tulis penilaianmu",
          send: "Kirim",
        },
      },
    },
    en: {
      translation: {
        call: {
          headline: {
            "Prioritas-Perbankan": "Priority Banking",
            "Prioritas-Hasanah": "Hasanah Card Priority",
            "Umum-Perbankan": "General Banking Services",
            "Umum-Hasanah": "Hasanah Card General Services",
          },
          descOne: {
            "Sedang Menghubungi": "Reaching Out",
            Berdering: "Ringing",
            "Panggilan Berakhir": "Call Ended",
          },
          descTwo: {
            RINGING: "Please wait we are trying to connect with our agent",
            ESTABLISHED: "You have been connected with our agent",
          },
        },
        rating: {
          headline: "Give us your rating on BSI Call",
          impression:
            "Thank you for your rating! What was memorable about our agent service?",
          suggestion: "Tell us what can be improved about our agent service?",
          inputPlaceholder: "Write your assessment",
          send: "Send",
        },
      },
    },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
