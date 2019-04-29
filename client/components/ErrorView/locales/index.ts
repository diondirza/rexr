import makeDictionary, { Dictionary } from '@helpers/make-dictionary';
import englishDictionary from './en';
import indonesianDictionary from './id';

const i18n: Dictionary = makeDictionary(englishDictionary, indonesianDictionary);

export default i18n;
