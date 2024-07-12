function simpleHash(str: string) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }

  return hash >>> 0;
}

export default function getSeededImage(seed: string, width = 400, height = 400) {
  const hashedSeed = simpleHash(seed);

  return `https://picsum.photos/seed/${hashedSeed}/${width}/${height}`;
}