export default function cssLoader(source: string) {
  console.log("Inside neptune-css-loader");

  return `
  .container {
    background: blue;
  }
  `;
}
