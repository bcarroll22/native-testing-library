import { NativeTestInstance } from './query-helpers';

export function prettyPrint(
  element: NativeTestInstance | string,
  maxLength?: number,
  options: {
    formatting: {
      removeProps: string[];
    };
  },
): string | false;
