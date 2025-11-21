function encodeBase64(input: string): string {
  return Buffer.from(input, 'utf-8').toString('base64');
}

function decodeBase64(input: string): string {
  return Buffer.from(input, 'base64').toString('utf-8');
}

export { encodeBase64, decodeBase64 };