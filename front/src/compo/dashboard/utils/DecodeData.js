// decodeData.js
export const decodeBase64Array = (base64String, dtype) => {
  try {
    const binaryString = atob(base64String);
    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    switch (dtype) {
      case "i4":
        return new Int32Array(bytes.buffer);
      case "f8":
        return new Float64Array(bytes.buffer);
      case "f4":
        return new Float32Array(bytes.buffer);
      default:
        console.warn(`Unsupported dtype: ${dtype}`);
        return Array.from(bytes);
    }
  } catch (error) {
    console.error("Error decoding base64 array:", error);
    return [];
  }
};