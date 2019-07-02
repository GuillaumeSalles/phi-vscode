export function arrayToMap(array: any[]) {
  return new Map(
    array.map((color: any) => {
      const { id, ...rest } = color;
      return [id, rest];
    })
  );
}

export function kebabToCamel(kebab: string): string {
  let result = "";
  let isMaj = true;
  for (let i = 0; i < kebab.length; i++) {
    const charCode = kebab.charCodeAt(i);
    if (isMaj && charCode >= 97 && charCode <= 122) {
      result += String.fromCharCode(charCode - 32);
      isMaj = false;
    } else if (charCode === 45) {
      // i++;
      isMaj = true;
    } else {
      result += kebab[i];
    }
  }
  return result;
}
