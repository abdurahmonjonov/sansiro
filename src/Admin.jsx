import React, { useState, useEffect, useMemo } from "react";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,500;0,6..96,600;1,6..96,400&family=Jost:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

:root {
  --paper: #F3EEE3;
  --paper-deep: #E7DFCC;
  --ink: #201C16;
  --ink-soft: #6E6656;
  --gold: #97783E;
  --gold-soft: #C9B588;
  --line: #D2C7AC;
  --danger: #8E3B3B;
  --ok: #3F6B4A;
}

.admin-root {
  background: var(--paper);
  color: var(--ink);
  font-family: 'Jost', sans-serif;
  min-height: 100%;
}
.font-display { font-family: 'Bodoni Moda', serif; }
.font-mono { font-family: 'IBM Plex Mono', monospace; }

.eyebrow {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.12em;
  color: var(--ink-soft);
  text-transform: uppercase;
}

.card {
  background: var(--paper);
  border: 1px solid var(--line);
  box-shadow: 0 1px 2px rgba(32,28,22,0.04), 0 4px 14px rgba(32,28,22,0.05);
}

.list-row {
  transition: background 0.15s ease;
}
.list-row:hover {
  background: rgba(151,120,62,0.05);
}

.tab-bar {
  display: inline-flex;
  gap: 2px;
  background: var(--paper-deep);
  padding: 4px;
  border: 1px solid var(--line);
}
.tab {
  padding: 8px 18px;
  color: var(--ink-soft);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 12px;
  letter-spacing: 0.04em;
  transition: background 0.15s ease, color 0.15s ease;
}
.tab.active {
  background: var(--paper);
  color: var(--ink);
  box-shadow: 0 1px 3px rgba(32,28,22,0.10);
}
.tab:not(.active):hover {
  color: var(--ink);
}

.stat-card {
  background: var(--paper);
  border: 1px solid var(--line);
  border-left: 3px solid var(--gold);
  box-shadow: 0 1px 2px rgba(32,28,22,0.04), 0 4px 14px rgba(32,28,22,0.05);
}

.btn-ink {
  background: var(--ink);
  color: var(--paper);
  transition: background 0.15s ease, transform 0.1s ease;
}
.btn-ink:hover { background: #362F24; }
.btn-ink:active { transform: scale(0.98); }
.btn-ink:disabled { opacity: 0.4; cursor: not-allowed; }

.btn-ghost {
  background: transparent;
  color: var(--ink);
  border: 1px solid var(--ink);
  transition: background 0.15s ease, color 0.15s ease, transform 0.1s ease;
}
.btn-ghost:hover { background: var(--ink); color: var(--paper); }
.btn-ghost:active { transform: scale(0.98); }

.btn-danger {
  background: transparent;
  color: var(--danger);
  border: 1px solid var(--danger);
  transition: background 0.15s ease, color 0.15s ease;
}
.btn-danger:hover { background: var(--danger); color: var(--paper); }

.input {
  background: var(--paper);
  border: 1px solid var(--line);
  color: var(--ink);
  transition: border-color 0.15s ease;
}
.input:focus { outline: none; border-color: var(--gold); }

select.input { background: var(--paper); }

.status-pill {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.05em;
  padding: 3px 12px;
  border-radius: 999px;
  border: 1px solid;
  font-weight: 500;
}
.status-Yangi { color: var(--gold); border-color: var(--gold); background: rgba(151,120,62,0.08); }
.status-Jarayonda { color: #3B5C8E; border-color: #3B5C8E; background: rgba(59,92,142,0.08); }
.status-Yakunlandi { color: var(--ok); border-color: var(--ok); background: rgba(63,107,74,0.08); }
.status-Bekor { color: var(--danger); border-color: var(--danger); background: rgba(142,59,59,0.08); }

.fade-in { animation: admin-fade 0.3s ease-out; }
@keyframes admin-fade { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }

*:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }
`;

function Crown({ size = 20, color = "var(--ink)" }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 48 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 30 L2 10 L13 18 L24 4 L35 18 L46 10 L44 30 Z" stroke={color} strokeWidth="2" strokeLinejoin="round" fill="none" />
      <line x1="4" y1="30" x2="44" y2="30" stroke={color} strokeWidth="2" />
    </svg>
  );
}

const CATEGORIES = ["Erkaklar", "Aksessuar"];

const STARTER_PRODUCTS = [
  { id: "p3", name: "Klassik kostyum", category: "Erkaklar", price: 4100000, sizes: ["48", "50", "52", "54"] },
  { id: "p4", name: "Kashmir sviter", category: "Erkaklar", price: 1890000, sizes: ["M", "L", "XL"] },
  { id: "p5", name: "Ipak sharf", category: "Aksessuar", price: 620000, sizes: ["Bir xil o'lcham"] },
  { id: "p6", name: "Charm kamar", category: "Aksessuar", price: 540000, sizes: ["90", "95", "100"] },
];
const PRODUCTS_KEY = "sansiro:products";
const ORDERS_KEY = "sansiro:orders";
const MESSAGES_KEY = "sansiro:messages";
const PROMO_KEY = "sansiro:promocodes";
const ADMIN_PIN = "2024"; // O'zgartirish uchun shu qatorni tahrirlang

const money = (n) => new Intl.NumberFormat("uz-UZ").format(Math.round(n)) + " so'm";

const emptyDraft = { name: "", category: "Erkaklar", price: "", sizes: "", colors: "", images: [], description: "" };

function resizeImageToBase64(file, maxWidth = 900, quality = 0.75) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Faylni o'qib bo'lmadi"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Rasmni ochib bo'lmadi"));
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

export default function SansiroAdmin() {
  const [unlocked, setUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(null);

  const [tab, setTab] = useState("products"); // products | orders | completed | messages
  const [products, setProducts] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messagesLoaded, setMessagesLoaded] = useState(false);
  const [promoCodes, setPromoCodes] = useState([]);
  const [promoCodesLoaded, setPromoCodesLoaded] = useState(false);
  const [promoDraft, setPromoDraft] = useState({ code: "", discountPercent: "", minOrderAmount: "250000" });
  const [promoError, setPromoError] = useState(null);
  const [promoSaving, setPromoSaving] = useState(false);

  const [draft, setDraft] = useState(emptyDraft);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [imageProcessing, setImageProcessing] = useState(false);

  useEffect(() => {
    if (!unlocked) return;
    (async () => {
      try {
        const result = await window.storage.get(PRODUCTS_KEY, true);
        if (result && result.value) setProducts(JSON.parse(result.value));
      } catch (e) {
        setProducts([]);
      } finally {
        setProductsLoaded(true);
      }
    })();
    (async () => {
      try {
        const result = await window.storage.get(ORDERS_KEY, true);
        if (result && result.value) setOrders(JSON.parse(result.value));
      } catch (e) {
        setOrders([]);
      } finally {
        setOrdersLoaded(true);
      }
    })();
    (async () => {
      try {
        const result = await window.storage.get(MESSAGES_KEY, true);
        if (result && result.value) setMessages(JSON.parse(result.value));
      } catch (e) {
        setMessages([]);
      } finally {
        setMessagesLoaded(true);
      }
    })();
    (async () => {
      try {
        const result = await window.storage.get(PROMO_KEY, true);
        if (result && result.value) setPromoCodes(JSON.parse(result.value));
      } catch (e) {
        setPromoCodes([]);
      } finally {
        setPromoCodesLoaded(true);
      }
    })();
  }, [unlocked]);

  const saveProducts = async (list) => {
    setProducts(list);
    try {
      await window.storage.set(PRODUCTS_KEY, JSON.stringify(list), true);
    } catch (e) {
      setFormError("Saqlashda xatolik yuz berdi, qayta urinib ko'ring.");
    }
  };

  const saveOrders = async (list) => {
    setOrders(list);
    try {
      await window.storage.set(ORDERS_KEY, JSON.stringify(list), true);
    } catch (e) {
      // status update failed to persist; UI still reflects it for this session
    }
  };

  const checkPin = () => {
    const trimmed = pinInput.trim();
    if (!trimmed) {
      setPinError("Kirish kodini kiriting.");
      return;
    }
    if (trimmed === ADMIN_PIN) {
      setPinError(null);
      setUnlocked(true);
    } else {
      setPinError("Kod noto'g'ri. Qaytadan urinib ko'ring.");
    }
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setDraft({
      name: product.name,
      category: product.category,
      price: String(product.price),
      sizes: product.sizes.join(", "),
      colors: (product.colors || []).join(", "),
      images: product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []),
      description: product.description || "",
    });
    setFormError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft(emptyDraft);
    setFormError(null);
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const invalid = files.find((f) => !f.type.startsWith("image/"));
    if (invalid) {
      setFormError("Iltimos, faqat rasm fayllarni tanlang.");
      return;
    }
    setImageProcessing(true);
    setFormError(null);
    try {
      const resized = await Promise.all(files.map((f) => resizeImageToBase64(f)));
      setDraft((d) => ({ ...d, images: [...d.images, ...resized] }));
    } catch (err) {
      setFormError("Rasmni yuklashda xatolik yuz berdi.");
    } finally {
      setImageProcessing(false);
      e.target.value = "";
    }
  };

  const removeDraftImage = (index) => {
    setDraft((d) => ({ ...d, images: d.images.filter((_, i) => i !== index) }));
  };

  const submitDraft = async (e) => {
    e.preventDefault();
    const priceNum = Number(draft.price);
    const sizeList = draft.sizes.split(",").map((s) => s.trim()).filter(Boolean);
    const colorList = draft.colors.split(",").map((c) => c.trim()).filter(Boolean);
    if (!draft.name.trim() || !priceNum || sizeList.length === 0) {
      setFormError("Nomi, narxi va kamida bitta o'lchamni to'g'ri kiriting.");
      return;
    }
    setSaving(true);
    setFormError(null);
    const entry = {
      id: editingId || `p-${Date.now()}`,
      name: draft.name.trim(),
      category: draft.category,
      price: priceNum,
      sizes: sizeList,
      colors: colorList,
      images: draft.images,
      image: draft.images[0] || null,
      description: draft.description.trim(),
    };
    const updated = editingId
      ? products.map((p) => (p.id === editingId ? entry : p))
      : [entry, ...products];
    await saveProducts(updated);
    setSaving(false);
    cancelEdit();
  };

  const deleteProduct = async (id) => {
    await saveProducts(products.filter((p) => p.id !== id));
    if (editingId === id) cancelEdit();
  };

  const updateOrderStatus = async (orderNumber, status) => {
    const updated = orders.map((o) => (o.orderNumber === orderNumber ? { ...o, status } : o));
    await saveOrders(updated);
  };

  const savePromoCodes = async (list) => {
    setPromoCodes(list);
    try {
      await window.storage.set(PROMO_KEY, JSON.stringify(list), true);
    } catch (e) {
      setPromoError("Saqlashda xatolik yuz berdi, qayta urinib ko'ring.");
    }
  };

  const submitPromoDraft = async (e) => {
    e.preventDefault();
    const code = promoDraft.code.trim().toUpperCase();
    const discountPercent = Number(promoDraft.discountPercent);
    const minOrderAmount = Number(promoDraft.minOrderAmount);
    if (!code || !discountPercent || discountPercent <= 0 || discountPercent > 90) {
      setPromoError("Kod nomini va 1-90 oralig'idagi chegirma foizini kiriting.");
      return;
    }
    if (promoCodes.some((p) => p.code === code)) {
      setPromoError("Bu kod allaqachon mavjud.");
      return;
    }
    setPromoSaving(true);
    setPromoError(null);
    const entry = {
      code,
      discountPercent,
      minOrderAmount: minOrderAmount || 0,
      active: true,
      createdAt: new Date().toISOString(),
    };
    await savePromoCodes([entry, ...promoCodes]);
    setPromoSaving(false);
    setPromoDraft({ code: "", discountPercent: "", minOrderAmount: "250000" });
  };

  const togglePromoActive = async (code) => {
    const updated = promoCodes.map((p) => (p.code === code ? { ...p, active: !p.active } : p));
    await savePromoCodes(updated);
  };

  const deletePromoCode = async (code) => {
    await savePromoCodes(promoCodes.filter((p) => p.code !== code));
  };

  const stats = useMemo(() => {
    const revenue = orders.reduce((s, o) => s + (o.promoCode ? o.total : o.subtotal || 0), 0);
    return { count: orders.length, revenue };
  }, [orders]);

  const filteredProducts = useMemo(() => {
    const q = productSearch.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, productSearch]);

  const activeOrders = useMemo(() => orders.filter((o) => o.status !== "Yakunlandi"), [orders]);
  const completedOrders = useMemo(() => orders.filter((o) => o.status === "Yakunlandi"), [orders]);

  const ORDER_ACCENT = {
    "Yangi": "var(--gold)",
    "Jarayonda": "#3B5C8E",
    "Yakunlandi": "var(--ok)",
    "Bekor qilindi": "var(--danger)",
  };

  const renderOrderCard = (o) => (
    <div key={o.orderNumber} className="card p-5" style={{ borderLeft: `3px solid ${ORDER_ACCENT[o.status] || "var(--line)"}` }}>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <span className="font-mono text-sm">{o.orderNumber}</span>
          <span className="text-xs ml-3" style={{ color: "var(--ink-soft)" }}>
            {new Date(o.createdAt).toLocaleString("uz-UZ")}
          </span>
        </div>
        <select
          className={`status-pill status-${o.status === "Bekor qilindi" ? "Bekor" : o.status}`}
          value={o.status}
          onChange={(e) => updateOrderStatus(o.orderNumber, e.target.value)}
          style={{ background: "transparent" }}
        >
          <option value="Yangi">Yangi</option>
          <option value="Jarayonda">Jarayonda</option>
          <option value="Yakunlandi">Yakunlandi</option>
          <option value="Bekor qilindi">Bekor qilindi</option>
        </select>
      </div>
      <div className="text-sm mb-2">
        <span style={{ color: "var(--ink-soft)" }}>Mijoz: </span>
        {o.customer?.name} &middot; <span className="font-mono">{o.customer?.phone}</span>
      </div>
      <div className="text-sm mb-2" style={{ color: "var(--ink-soft)" }}>
        Manzil: {o.customer?.address}
      </div>
      <div className="text-sm mb-2" style={{ color: "var(--ink-soft)" }}>
        To'lov: {o.customer?.paymentMethod === "karta" ? "Karta orqali" : "Naqd pul"}
      </div>
      {o.customer?.notes && (
        <div className="text-sm mb-2" style={{ color: "var(--ink-soft)" }}>Izoh: {o.customer.notes}</div>
      )}
      <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--line)" }}>
        {(o.items || []).map((it) => (
          <div key={`${it.productId}-${it.size}-${it.color || ""}`} className="flex justify-between text-xs py-1">
            <span>{it.name} ({it.size}{it.color ? `, ${it.color}` : ""}) &times; {it.qty}</span>
            <span className="font-mono">{money(it.price * it.qty)}</span>
          </div>
        ))}
        {o.promoCode && (
          <>
            <div className="flex justify-between text-xs pt-1" style={{ color: "var(--ink-soft)" }}>
              <span>Oraliq summa</span>
              <span className="font-mono">{money(o.subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs" style={{ color: "var(--gold)" }}>
              <span>Promo ({o.promoCode})</span>
              <span className="font-mono">-{money(o.discountAmount)}</span>
            </div>
          </>
        )}
        <div className="flex justify-between text-sm mt-2 font-medium">
          <span>Jami</span>
          <span className="font-mono">{money(o.promoCode ? o.total : o.subtotal)}</span>
        </div>
      </div>
    </div>
  );

  if (!unlocked) {
    return (
      <div className="admin-root min-h-screen flex items-center justify-center px-6">
        <style>{STYLES}</style>
        <div className="card p-8 max-w-sm w-full text-center fade-in">
          <Crown size={26} />
          <p className="font-display text-xl mt-3">SANSIRO ADMIN</p>
          <p className="text-xs mt-2 mb-6" style={{ color: "var(--ink-soft)" }}>
            Faqat do'kon egasi uchun boshqaruv paneli
          </p>
          <input
            type="password"
            inputMode="numeric"
            className="input w-full px-3 py-2 text-sm text-center font-mono"
            placeholder="Kirish kodi"
            value={pinInput}
            onChange={(e) => { setPinInput(e.target.value); if (pinError) setPinError(null); }}
            onKeyDown={(e) => { if (e.key === "Enter") checkPin(); }}
            autoFocus
          />
          {pinError && <p className="text-xs mt-2" style={{ color: "var(--danger)" }}>{pinError}</p>}
          <button type="button" onClick={checkPin} className="btn-ink w-full py-2.5 text-sm tracking-wide mt-5">
            KIRISH
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-root min-h-screen">
      <style>{STYLES}</style>

      <nav className="flex items-center justify-between px-5 md:px-10 py-4" style={{ borderBottom: "1px solid var(--line)", background: "var(--paper)" }}>
        <div className="flex items-center gap-2.5">
          <Crown size={18} />
          <div>
            <div className="font-display text-lg leading-none">SANSIRO</div>
            <div className="eyebrow" style={{ fontSize: 10, marginTop: 2 }}>Boshqaruv paneli</div>
          </div>
        </div>
        <button onClick={() => setUnlocked(false)} className="btn-ghost px-4 py-1.5 text-xs tracking-wide">
          CHIQISH
        </button>
      </nav>

      <div className="px-5 md:px-10 pt-8 pb-16 max-w-6xl mx-auto">
        <div className="tab-bar mb-8">
          <button onClick={() => setTab("products")} className={`tab ${tab === "products" ? "active" : ""}`}>
            MAHSULOTLAR ({products.length})
          </button>
          <button onClick={() => setTab("orders")} className={`tab ${tab === "orders" ? "active" : ""}`}>
            BUYURTMALAR ({activeOrders.length})
          </button>
          <button onClick={() => setTab("completed")} className={`tab ${tab === "completed" ? "active" : ""}`}>
            YAKUNLANGAN ({completedOrders.length})
          </button>
          <button onClick={() => setTab("messages")} className={`tab ${tab === "messages" ? "active" : ""}`}>
            XABARLAR ({messages.length})
          </button>
          <button onClick={() => setTab("promo")} className={`tab ${tab === "promo" ? "active" : ""}`}>
            PROMO-KODLAR ({promoCodes.length})
          </button>
        </div>

        {tab === "products" && (
          <div className="max-w-4xl fade-in">
            <form onSubmit={submitDraft} className="card p-6 mb-8">
              <div className="eyebrow mb-1">{editingId ? "Tahrirlash" : "Yangi yozuv"}</div>
              <p className="font-display text-xl mb-5">{editingId ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}</p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <input
                  className="input px-3 py-2 text-sm md:col-span-2"
                  placeholder="Mahsulot nomi"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
                <select
                  className="input px-3 py-2 text-sm"
                  value={draft.category}
                  onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                >
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <input
                  className="input px-3 py-2 text-sm font-mono"
                  placeholder="Narx (so'm)"
                  inputMode="numeric"
                  value={draft.price}
                  onChange={(e) => setDraft({ ...draft, price: e.target.value.replace(/[^0-9]/g, "") })}
                />
                <input
                  className="input px-3 py-2 text-sm md:col-span-2"
                  placeholder="O'lchamlar, vergul bilan (masalan: S, M, L)"
                  value={draft.sizes}
                  onChange={(e) => setDraft({ ...draft, sizes: e.target.value })}
                />
                <input
                  className="input px-3 py-2 text-sm md:col-span-2"
                  placeholder="Ranglar, vergul bilan (ixtiyoriy, masalan: Qora, Oq, Ko'k)"
                  value={draft.colors}
                  onChange={(e) => setDraft({ ...draft, colors: e.target.value })}
                />
                <textarea
                  className="input px-3 py-2 text-sm md:col-span-4"
                  placeholder="Mahsulot tavsifi (ixtiyoriy) — mato, tikuv, parvarish bo'yicha ma'lumot"
                  rows={3}
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                />
                <div className="md:col-span-4">
                  <label className="text-xs block mb-2" style={{ color: "var(--ink-soft)" }}>
                    Mahsulot rasmlari (bir nechtasini tanlashingiz mumkin)
                  </label>
                  {draft.images.length > 0 && (
                    <div className="flex gap-2 flex-wrap mb-3">
                      {draft.images.map((img, i) => (
                        <div key={i} className="relative">
                          <img
                            src={img}
                            alt={`Rasm ${i + 1}`}
                            style={{ width: 64, height: 64, objectFit: "cover", border: i === 0 ? "2px solid var(--gold)" : "1px solid var(--line)" }}
                          />
                          <button
                            type="button"
                            onClick={() => removeDraftImage(i)}
                            className="absolute"
                            style={{ top: -6, right: -6, background: "var(--ink)", color: "var(--paper)", borderRadius: "999px", width: 18, height: 18, fontSize: 11, lineHeight: "18px" }}
                            aria-label="Rasmni olib tashlash"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    disabled={imageProcessing}
                    className="text-xs"
                  />
                  {imageProcessing && (
                    <p className="text-xs mt-1" style={{ color: "var(--ink-soft)" }}>Rasmlar qayta ishlanmoqda...</p>
                  )}
                  {draft.images.length > 0 && (
                    <p className="text-xs mt-1" style={{ color: "var(--ink-soft)" }}>
                      Birinchi rasm (oltin ramkali) katalogda asosiy rasm sifatida ko'rinadi.
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button type="submit" disabled={saving || imageProcessing} className="btn-ink flex-1 py-2 text-sm tracking-wide">
                    {editingId ? "SAQLASH" : "QO'SHISH"}
                  </button>
                  {editingId && (
                    <button type="button" onClick={cancelEdit} className="btn-ghost px-4 py-2 text-sm">
                      BEKOR
                    </button>
                  )}
                </div>
              </div>
              {formError && <p className="text-xs mt-3" style={{ color: "var(--danger)" }}>{formError}</p>}
            </form>

            {!productsLoaded ? (
              <p className="text-sm" style={{ color: "var(--ink-soft)" }}>Yuklanmoqda...</p>
            ) : products.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
                Hali mahsulot yo'q. Yuqoridagi shakl orqali qo'shing, yoki{" "}
                <button onClick={() => saveProducts(STARTER_PRODUCTS)} className="underline">
                  namuna katalogni yuklang
                </button>{" "}
                (keyin tahrirlashingiz mumkin).
              </p>
            ) : (
              <>
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Mahsulot nomi bo'yicha qidirish..."
                  className="input w-full px-3 py-2 text-sm mb-4"
                />
                {filteredProducts.length === 0 ? (
                  <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
                    "{productSearch}" bo'yicha hech narsa topilmadi.
                  </p>
                ) : (
                <div className="card divide-y" style={{ borderColor: "var(--line)" }}>
                {filteredProducts.map((p) => (
                  <div key={p.id} className="list-row flex items-center justify-between gap-4 px-4 py-4" style={{ borderBottom: "1px solid var(--line)" }}>
                    <div className="flex items-center gap-3 min-w-0">
                      {p.image ? (
                        <img
                          src={p.image}
                          alt={p.name}
                          style={{ width: 44, height: 44, objectFit: "cover", flexShrink: 0, border: "1px solid var(--line)" }}
                        />
                      ) : (
                        <div style={{ width: 44, height: 44, flexShrink: 0, background: "var(--paper-deep)", border: "1px solid var(--line)" }} />
                      )}
                      <div className="min-w-0">
                        <div className="text-xs" style={{ color: "var(--ink-soft)" }}>{p.category}</div>
                        <div className="font-display text-base truncate">{p.name}</div>
                        <div className="font-mono text-xs mt-1" style={{ color: "var(--gold)" }}>
                          {money(p.price)} &middot; {p.sizes.join(", ")}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => startEdit(p)} className="btn-ghost px-3 py-1.5 text-xs">TAHRIRLASH</button>
                      <button onClick={() => deleteProduct(p.id)} className="btn-danger px-3 py-1.5 text-xs">O'CHIRISH</button>
                    </div>
                  </div>
                ))}
                </div>
                )}
              </>
            )}
          </div>
        )}

        {tab === "orders" && (
          <div className="max-w-4xl fade-in pb-10">
            <div className="grid grid-cols-2 gap-4 mb-8 max-w-md">
              <div className="stat-card p-5">
                <div className="eyebrow">Jami buyurtmalar</div>
                <div className="font-display text-3xl mt-2">{stats.count}</div>
              </div>
              <div className="stat-card p-5">
                <div className="eyebrow">Umumiy summa</div>
                <div className="font-mono text-xl mt-2">{money(stats.revenue)}</div>
              </div>
            </div>

            {!ordersLoaded ? (
              <p className="text-sm" style={{ color: "var(--ink-soft)" }}>Yuklanmoqda...</p>
            ) : activeOrders.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--ink-soft)" }}>Hali faol buyurtma yo'q.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {activeOrders.map(renderOrderCard)}
              </div>
            )}
          </div>
        )}

        {tab === "completed" && (
          <div className="max-w-4xl fade-in pb-10">
            {!ordersLoaded ? (
              <p className="text-sm" style={{ color: "var(--ink-soft)" }}>Yuklanmoqda...</p>
            ) : completedOrders.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--ink-soft)" }}>Hali yakunlangan buyurtma yo'q.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {completedOrders.map(renderOrderCard)}
              </div>
            )}
          </div>
        )}

        {tab === "messages" && (
          <div className="max-w-3xl fade-in pb-10">
            {!messagesLoaded ? (
              <p className="text-sm" style={{ color: "var(--ink-soft)" }}>Yuklanmoqda...</p>
            ) : messages.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--ink-soft)" }}>Hali xabar yo'q.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {messages.map((m) => (
                  <div key={m.id} className="card p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="text-sm font-medium">{m.name}</span>
                      <span className="text-xs" style={{ color: "var(--ink-soft)" }}>
                        {new Date(m.createdAt).toLocaleString("uz-UZ")}
                      </span>
                    </div>
                    <div className="font-mono text-xs mb-2" style={{ color: "var(--gold)" }}>{m.contact}</div>
                    <p className="text-sm">{m.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "promo" && (
          <div className="max-w-3xl fade-in pb-10">
            <form onSubmit={submitPromoDraft} className="card p-6 mb-8">
              <div className="eyebrow mb-1">Yangi kod</div>
              <p className="font-display text-xl mb-5">Promo-kod yaratish</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  className="input px-3 py-2 text-sm font-mono uppercase"
                  placeholder="KOD (masalan: YANGI10)"
                  value={promoDraft.code}
                  onChange={(e) => setPromoDraft({ ...promoDraft, code: e.target.value })}
                />
                <input
                  className="input px-3 py-2 text-sm"
                  placeholder="Chegirma foizi (masalan: 10)"
                  inputMode="numeric"
                  value={promoDraft.discountPercent}
                  onChange={(e) => setPromoDraft({ ...promoDraft, discountPercent: e.target.value.replace(/[^0-9]/g, "") })}
                />
                <input
                  className="input px-3 py-2 text-sm font-mono"
                  placeholder="Minimal xarid summasi"
                  inputMode="numeric"
                  value={promoDraft.minOrderAmount}
                  onChange={(e) => setPromoDraft({ ...promoDraft, minOrderAmount: e.target.value.replace(/[^0-9]/g, "") })}
                />
              </div>
              {promoError && <p className="text-xs mt-3" style={{ color: "var(--danger)" }}>{promoError}</p>}
              <button type="submit" disabled={promoSaving} className="btn-ink px-6 py-2 text-sm tracking-wide mt-4">
                {promoSaving ? "SAQLANMOQDA..." : "KOD QO'SHISH"}
              </button>
            </form>

            {!promoCodesLoaded ? (
              <p className="text-sm" style={{ color: "var(--ink-soft)" }}>Yuklanmoqda...</p>
            ) : promoCodes.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--ink-soft)" }}>Hali promo-kod yo'q.</p>
            ) : (
              <div className="card divide-y" style={{ borderColor: "var(--line)" }}>
                {promoCodes.map((p) => (
                  <div key={p.code} className="list-row flex items-center justify-between gap-4 px-4 py-4" style={{ borderBottom: "1px solid var(--line)" }}>
                    <div>
                      <div className="font-mono text-base" style={{ color: "var(--gold)" }}>{p.code}</div>
                      <div className="text-xs mt-1" style={{ color: "var(--ink-soft)" }}>
                        -{p.discountPercent}% &middot; {money(p.minOrderAmount)}dan yuqori xaridlarga
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className="status-pill"
                        style={p.active
                          ? { color: "var(--ok)", borderColor: "var(--ok)", background: "rgba(63,107,74,0.08)" }
                          : { color: "var(--ink-soft)", borderColor: "var(--line)" }}
                      >
                        {p.active ? "FAOL" : "O'CHIRILGAN"}
                      </span>
                      <button onClick={() => togglePromoActive(p.code)} className="btn-ghost px-3 py-1.5 text-xs">
                        {p.active ? "O'CHIRISH" : "YOQISH"}
                      </button>
                      <button onClick={() => deletePromoCode(p.code)} className="btn-danger px-3 py-1.5 text-xs">
                        O'CHIRIB TASHLASH
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
