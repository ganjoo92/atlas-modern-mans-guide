const MASTER_KEY_STORAGE = 'atlas_secure_master_key_v1';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const toBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  bytes.forEach(byte => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
};

const fromBase64 = (value: string): ArrayBuffer => {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

const ensureMasterKey = async (): Promise<CryptoKey> => {
  if (typeof window === 'undefined' || !window.crypto?.subtle) {
    throw new Error('Secure storage is unavailable in this environment.');
  }

  let raw = localStorage.getItem(MASTER_KEY_STORAGE);
  if (!raw) {
    const random = window.crypto.getRandomValues(new Uint8Array(32));
    raw = toBase64(random.buffer);
    localStorage.setItem(MASTER_KEY_STORAGE, raw);
  }
  const rawBuffer = fromBase64(raw);
  return window.crypto.subtle.importKey('raw', rawBuffer, 'AES-GCM', false, ['encrypt', 'decrypt']);
};

export const secureStorage = {
  async set<T>(key: string, data: T): Promise<void> {
    try {
      if (typeof window === 'undefined' || !window.crypto?.subtle) {
        localStorage.setItem(key, JSON.stringify(data));
        return;
      }
      const cryptoKey = await ensureMasterKey();
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const payload = encoder.encode(JSON.stringify(data));
      const cipher = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, cryptoKey, payload);
      const packed = `${toBase64(iv.buffer)}:${toBase64(cipher)}`;
      localStorage.setItem(key, packed);
    } catch (error) {
      console.error('secureStorage.set fallback', error);
      localStorage.setItem(key, JSON.stringify(data));
    }
  },

  async get<T>(key: string): Promise<T | null> {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;
      if (typeof window === 'undefined' || !window.crypto?.subtle || !stored.includes(':')) {
        return JSON.parse(stored) as T;
      }
      const [ivEncoded, dataEncoded] = stored.split(':');
      const iv = new Uint8Array(fromBase64(ivEncoded));
      const cipher = fromBase64(dataEncoded);
      const cryptoKey = await ensureMasterKey();
      const decrypted = await window.crypto.subtle.decrypt({ name: 'AES-GCM', iv }, cryptoKey, cipher);
      return JSON.parse(decoder.decode(new Uint8Array(decrypted))) as T;
    } catch (error) {
      console.error('secureStorage.get fallback', error);
      try {
        const stored = localStorage.getItem(key);
        if (!stored) return null;
        return JSON.parse(stored) as T;
      } catch (fallbackError) {
        console.error('secureStorage fallback parse failed', fallbackError);
        return null;
      }
    }
  },

  remove(key: string) {
    localStorage.removeItem(key);
  },
};
