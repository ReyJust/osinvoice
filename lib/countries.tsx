import en from "i18n-iso-countries/langs/en.json"
import {
  registerLocale,
  getAlpha2Codes,
  getName,
} from "i18n-iso-countries"

let initialized = false

function initCountries() {
  if (!initialized) {
    registerLocale(en)
    initialized = true
  }
}

export function getCountryList(locale = "en") {
  initCountries()

  return Object.keys(getAlpha2Codes()).map((code) => ({
    code,
    name: getName(code, locale)!,
  }))
}