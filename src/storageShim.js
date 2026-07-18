// Claude artifactlar ichida `window.storage` maxsus xotira API sifatida taqdim etiladi.
// Haqiqiy saytda bunday API mavjud emas, shuning uchun uni brauzer localStorage
// yordamida taqlid qilamiz — bir xil get/set/delete/list shaklida.
//
// MUHIM CHEKLOV: bu ma'lumotlarni faqat SHU BRAUZER/QURILMADA saqlaydi.
// Ya'ni admin panelda qo'shilgan mahsulot faqat administrator kompyuterida
// ko'rinadi — mijozning telefonida ko'rinmaydi. Haqiqiy, barcha qurilmalarda
// bir xil ma'lumot ko'rsatish uchun (masalan Supabase) haqiqiy backend/baza kerak.

function storageKey(key, shared) {
  return `sansiro:${shared ? "shared" : "local"}:${key}`;
}

const storage = {
  async get(key, shared = false) {
    const raw = window.localStorage.getItem(storageKey(key, shared));
    if (raw === null) {
      throw new Error("Kalit topilmadi: " + key);
    }
    return { key, value: raw, shared };
  },
  async set(key, value, shared = false) {
    window.localStorage.setItem(storageKey(key, shared), value);
    return { key, value, shared };
  },
  async delete(key, shared = false) {
    window.localStorage.removeItem(storageKey(key, shared));
    return { key, deleted: true, shared };
  },
  async list(prefix = "", shared = false) {
    const fullPrefix = storageKey(prefix, shared);
    const ownPrefix = `sansiro:${shared ? "shared" : "local"}:`;
    const keys = Object.keys(window.localStorage)
      .filter((k) => k.startsWith(fullPrefix))
      .map((k) => k.slice(ownPrefix.length));
    return { keys, prefix, shared };
  },
};

if (typeof window !== "undefined") {
  window.storage = storage;
}

export default storage;
