import { useEffect, useState } from 'react';

type ShortcutKeyOption = {
  keyMap: string[];
  exit?: string;
};

export default function useShortcutKey({ keyMap = [], exit = 'escape' }: ShortcutKeyOption, defaultValue: boolean) {
  const [match, setMatch] = useState(defaultValue);
  const [inputKeys, setInputKey] = useState([]) as [string[], Function];

  useEffect(() => {
    const handleKeyDown = ({ key }: KeyboardEvent) => {
      setInputKey((prevKeys: string[]) => (prevKeys.indexOf(key) === -1 ? [...prevKeys, key.toLowerCase()] : prevKeys));
    };
    const handleKeyUp = ({ key }: KeyboardEvent) => {
      setInputKey((prevKeys: string[]) => prevKeys.filter((k) => k !== key.toLowerCase()));
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [setInputKey]);

  useEffect(() => {
    if (inputKeys.length === keyMap.length && keyMap.every((k) => inputKeys.includes(k))) {
      setMatch(true);
    }

    if (inputKeys.length === 1 && inputKeys[0] === exit) {
      setMatch(false);
    }
  }, [keyMap, inputKeys, exit]);

  return [match, setMatch];
}
