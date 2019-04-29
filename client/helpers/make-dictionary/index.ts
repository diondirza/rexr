export type Dictionary = {
  en: any;
  id: any;
};

export default function makeDictionary<EnglishDictionary, IndonesiaDictionary>(
  en: EnglishDictionary,
  id: IndonesiaDictionary,
): Dictionary {
  return {
    en,
    id,
  };
}
