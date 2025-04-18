'use client';

import { useEffect } from "react";
import useLocalStorage from "./useLocalStorage";

const useColorMode = () => {
  const [colorMode, setColorMode] = useLocalStorage("color-theme", "light");

  useEffect(() => {
    const classN = "dark"   ;
    const bodyClass = window.document.body.classList;
  
    if (colorMode === "dark") {
      bodyClass.add(classN);
    } else {
      bodyClass.remove(classN);
    }
  }, [colorMode]);
  
  
  return [colorMode, setColorMode];
};

export default useColorMode;
