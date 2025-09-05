// @flow

import { useCallback, useLayoutEffect, useRef } from "react";

export default (fn: Function) => {
  let ref = useRef<Function>(undefined);

  useLayoutEffect(() => {
    ref.current = fn;
  });

  return useCallback((...args: any) => {
    // @ts-ignore
    return (0, ref.current!)(...args);
  }, []);
};

// import { useCallback, useLayoutEffect, useRef } from "react";
//
// export default function useEventCallback<T extends (...args: any[]) => any>(fn: T): T {
//   const ref = useRef(fn);            // initialize to avoid undefined on first call
//   useLayoutEffect(() => { ref.current = fn; });
//   // ref is stable; callback identity is stable; always calls latest fn
//   return useCallback(((...args: Parameters<T>) => ref.current(...args)) as T, []);
// }
