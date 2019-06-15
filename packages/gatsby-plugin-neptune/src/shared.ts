export function arrayToMap(array: any[]) {
  return new Map(
    array.map((color: any) => {
      const { id, ...rest } = color;
      return [id, rest];
    })
  );
}
