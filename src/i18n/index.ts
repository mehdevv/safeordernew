import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import commonFr from "@/locales/fr/common.json";
import commonAr from "@/locales/ar/common.json";
import landingFr from "@/locales/fr/landing.json";
import landingAr from "@/locales/ar/landing.json";
import authFr from "@/locales/fr/auth.json";
import authAr from "@/locales/ar/auth.json";
import merchantFr from "@/locales/fr/merchant.json";
import merchantAr from "@/locales/ar/merchant.json";
import clientFr from "@/locales/fr/client.json";
import clientAr from "@/locales/ar/client.json";
import trackFr from "@/locales/fr/track.json";
import trackAr from "@/locales/ar/track.json";
import orderFr from "@/locales/fr/order.json";
import orderAr from "@/locales/ar/order.json";
import errorsFr from "@/locales/fr/errors.json";
import errorsAr from "@/locales/ar/errors.json";

const STORAGE_KEY = "safeorder_i18n_lang";

export type AppLng = "fr" | "ar";

function readStoredLng(): AppLng {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "ar" || v === "fr") return v;
  } catch {
    /* ignore */
  }
  return "fr";
}

export function syncDocumentLang(lng: string) {
  const el = document.documentElement;
  const isAr = lng === "ar";
  el.lang = isAr ? "ar" : "fr";
  el.dir = isAr ? "rtl" : "ltr";
}

void i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: {
        common: commonFr,
        landing: landingFr,
        auth: authFr,
        merchant: merchantFr,
        client: clientFr,
        track: trackFr,
        order: orderFr,
        errors: errorsFr,
      },
      ar: {
        common: commonAr,
        landing: landingAr,
        auth: authAr,
        merchant: merchantAr,
        client: clientAr,
        track: trackAr,
        order: orderAr,
        errors: errorsAr,
      },
    },
    lng: readStoredLng(),
    fallbackLng: "fr",
    defaultNS: "common",
    ns: ["common", "landing", "auth", "merchant", "client", "track", "order", "errors"],
    interpolation: { escapeValue: false },
  })
  .then(() => {
    syncDocumentLang(i18n.language);
  });

i18n.on("languageChanged", lng => {
  try {
    localStorage.setItem(STORAGE_KEY, lng === "ar" ? "ar" : "fr");
  } catch {
    /* ignore */
  }
  syncDocumentLang(lng);
});

export default i18n;
