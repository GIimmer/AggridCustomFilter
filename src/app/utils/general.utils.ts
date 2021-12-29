  export function hashmapFromArray(array: string[]): { [key: string]: true } {
    return array.reduce((acc, val) => {
      acc[val.toLowerCase()] = true;
      return acc;
    }, {} as { [key: string]: true });
  }