// `window.storage` polyfill — endi umumiy (shared) ma'lumotlar Supabase orqali
// barcha qurilmalarda REAL VAQTDA bir xil ko'rinadi. Shaxsiy (shared=false)
// ma'lumotlar (savat, sevimlilar, profil) hali ham har bir brauzerda alohida
// saqlanadi — bu to'g'ri, chunki ular shaxsiy narsalar.

const SUPABASE_URL = "https://bhecsyaxlonixnguqlqw.supabase.co";
// Faqat "publishable" (browser-safe) kalit — hech qachon "secret" kalitni bu yerga qo'ymang.
const SUPABASE_KEY = "sb_publishable_wYtxp3u9s22HwfUcv10xFw_FWMmGRlO";

const REST_URL = `${SUPABASE_URL}/rest/v1/kv_store`;
const HEADERS = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};

function localKey(key) {
  return `sansiro:local:${key}`;
}

const storage = {
  async get(key, shared = false) {
    if (!shared) {
      const raw = window.localStorage.getItem(localKey(key));
      if (raw === null) throw new Error("Kalit topilmadi: " + key);
      return { key, value: raw, shared };
    }
    const res = await fetch(`${REST_URL}?key=eq.${encodeURIComponent(key)}&select=value`, {
      headers: HEADERS,
    });
    if (!res.ok) throw new Error("Supabase so'rovi muvaffaqiyatsiz");
    const rows = await res.json();
    if (!rows || rows.length === 0) throw new Error("Kalit topilmadi: " + key);
    return { key, value: rows[0].value, shared };
  },

  async set(key, value, shared = false) {
    if (!shared) {
      window.localStorage.setItem(localKey(key), value);
      return { key, value, shared };
    }
    const res = await fetch(`${REST_URL}?on_conflict=key`, {
      method: "POST",
      headers: { ...HEADERS, Prefer: "resolution=merge-duplicates" },
      body: JSON.stringify({ key, value, updated_at: new Date().toISOString() }),
    });
    if (!res.ok) throw new Error("Supabase'ga yozib bo'lmadi");
    return { key, value, shared };
  },

  async delete(key, shared = false) {
    if (!shared) {
      window.localStorage.removeItem(localKey(key));
      return { key, deleted: true, shared };
    }
    const res = await fetch(`${REST_URL}?key=eq.${encodeURIComponent(key)}`, {
      method: "DELETE",
      headers: HEADERS,
    });
    if (!res.ok) throw new Error("Supabase'dan o'chirib bo'lmadi");
    return { key, deleted: true, shared };
  },

  async list(prefix = "", shared = false) {
    if (!shared) {
      const ownPrefix = localKey(prefix);
      const fullPrefix = localKey("");
      const keys = Object.keys(window.localStorage)
        .filter((k) => k.startsWith(ownPrefix))
        .map((k) => k.slice(fullPrefix.length));
      return { keys, prefix, shared };
    }
    const res = await fetch(`${REST_URL}?key=like.${encodeURIComponent(prefix)}*&select=key`, {
      headers: HEADERS,
    });
    if (!res.ok) throw new Error("Supabase so'rovi muvaffaqiyatsiz");
    const rows = await res.json();
    return { keys: rows.map((r) => r.key), prefix, shared };
  },
};

if (typeof window !== "undefined") {
  window.storage = storage;
}

export default storage;
