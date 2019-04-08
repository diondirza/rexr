import { useEffect, useState } from 'react';

export default function useShortcutKey({ keyMap = [], exit = 'escape' }, defaultValue) {
  const [match, setMatch] = useState(defaultValue);
  const [inputKeys, setInputKey] = useState([]);

  useEffect(() => {
    const handleKeyDown = ({ key }) => {
      setInputKey(prevKeys => (prevKeys.indexOf(key) === -1 ? [...prevKeys, key.toLowerCase()] : prevKeys));
    };
    const handleKeyUp = ({ key }) => {
      setInputKey(prevKeys => prevKeys.filter(k => k !== key.toLowerCase()));
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    if (inputKeys.length === keyMap.length && keyMap.every(k => inputKeys.includes(k))) {
      setMatch(true);
    }

    if (inputKeys.length === 1 && inputKeys[0] === exit) {
      setMatch(false);
    }
  }, [keyMap, inputKeys, exit]);

  return [match, setMatch];
}
