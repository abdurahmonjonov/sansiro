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

.card {
  background: var(--paper);
  border: 1px solid var(--line);
}

.tab {
  border-bottom: 2px solid transparent;
  color: var(--ink-soft);
}
.tab.active {
  border-bottom-color: var(--ink);
  color: var(--ink);
}

.btn-ink {
  background: var(--ink);
  color: var(--paper);
}
.btn-ink:hover { background: #362F24; }
.btn-ink:disabled { opacity: 0.4; cursor: not-allowed; }

.btn-ghost {
  background: transparent;
  color: var(--ink);
  border: 1px solid var(--ink);
}
.btn-ghost:hover { background: var(--ink); color: var(--paper); }

.btn-danger {
  background: transparent;
  color: var(--danger);
  border: 1px solid var(--danger);
}
.btn-danger:hover { background: var(--danger); color: var(--paper); }

.input {
  background: var(--paper);
  border: 1px solid var(--line);
  color: var(--ink);
}
.input:focus { outline: none; border-color: var(--ink); }

select.input { background: var(--paper); }

.status-pill {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.05em;
  padding: 2px 10px;
  border-radius: 999px;
  border: 1px solid;
}
.status-Yangi { color: var(--gold); border-color: var(--gold); }
.status-Jarayonda { color: #3B5C8E; border-color: #3B5C8E; }
.status-Yakunlandi { color: var(--ok); border-color: var(--ok); }
.status-Bekor { color: var(--danger); border-color: var(--danger); }

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

const CATEGORIES = ["Ayollar", "Erkaklar", "Aksessuar"];

const STARTER_PRODUCTS = [
  { id: "p1", name: "Ipak ko'ylak", category: "Ayollar", price: 1450000, sizes: ["XS", "S", "M", "L"] },
  { id: "p2", name: "Yun palto", category: "Ayollar", price: 3200000, sizes: ["S", "M", "L"] },
  { id: "p3", name: "Klassik kostyum", category: "Erkaklar", price: 4100000, sizes: ["48", "50", "52", "54"] },
  { id: "p4", name: "Kashmir sviter", category: "Erkaklar", price: 1890000, sizes: ["M", "L", "XL"] },
  { id: "p5", name: "Ipak sharf", category: "Aksessuar", price: 620000, sizes: ["Bir xil o'lcham"] },
  { id: "p6", name: "Charm kamar", category: "Aksessuar", price: 540000, sizes: ["90", "95", "100"] },
];
const PRODUCTS_KEY = "sansiro:products";
const ORDERS_KEY = "sansiro:orders";
const MESSAGES_KEY = "sansiro:messages";
const ADMIN_PIN = "2024"; // O'zgartirish uchun shu qatorni tahrirlang

const money = (n) => new Intl.NumberFormat("uz-UZ").format(Math.round(n)) + " so'm";

const emptyDraft = { name: "", category: "Ayollar", price: "", sizes: "" };

export default function SansiroAdmin() {
  const [unlocked, setUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(null);

  const [tab, setTab] = useState("products"); // products | orders
  const [products, setProducts] = useState([]);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messagesLoaded, setMessagesLoaded] = useState(false);

  const [draft, setDraft] = useState(emptyDraft);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState(null);
  const [saving, setSaving] = useState(false);

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
    });
    setFormError(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft(emptyDraft);
    setFormError(null);
  };

  const submitDraft = async (e) => {
    e.preventDefault();
    const priceNum = Number(draft.price);
    const sizeList = draft.sizes.split(",").map((s) => s.trim()).filter(Boolean);
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

  const stats = useMemo(() => {
    const revenue = orders.reduce((s, o) => s + (o.subtotal || 0), 0);
    return { count: orders.length, revenue };
  }, [orders]);

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

      <nav className="flex items-center justify-between px-5 md:px-10 py-4" style={{ borderBottom: "1px solid var(--line)" }}>
        <div className="flex items-center gap-2">
          <Crown size={16} />
          <span className="font-display text-lg">SANSIRO ADMIN</span>
        </div>
        <button onClick={() => setUnlocked(false)} className="btn-ghost px-4 py-1.5 text-xs tracking-wide">
          CHIQISH
        </button>
      </nav>

      <div className="px-5 md:px-10 pt-6">
        <div className="flex gap-6 mb-6" style={{ borderBottom: "1px solid var(--line)" }}>
          <button onClick={() => setTab("products")} className={`tab pb-3 text-sm tracking-wide ${tab === "products" ? "active" : ""}`}>
            MAHSULOTLAR ({products.length})
          </button>
          <button onClick={() => setTab("orders")} className={`tab pb-3 text-sm tracking-wide ${tab === "orders" ? "active" : ""}`}>
            BUYURTMALAR ({orders.length})
          </button>
          <button onClick={() => setTab("messages")} className={`tab pb-3 text-sm tracking-wide ${tab === "messages" ? "active" : ""}`}>
            XABARLAR ({messages.length})
          </button>
        </div>

        {tab === "products" && (
          <div className="max-w-4xl fade-in">
            <form onSubmit={submitDraft} className="card p-5 mb-8">
              <p className="font-display text-lg mb-4">{editingId ? "Mahsulotni tahrirlash" : "Yangi mahsulot qo'shish"}</p>
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
                  className="input px-3 py-2 text-sm md:col-span-3"
                  placeholder="O'lchamlar, vergul bilan (masalan: S, M, L)"
                  value={draft.sizes}
                  onChange={(e) => setDraft({ ...draft, sizes: e.target.value })}
                />
                <div className="flex gap-2">
                  <button type="submit" disabled={saving} className="btn-ink flex-1 py-2 text-sm tracking-wide">
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
              <div className="card divide-y" style={{ borderColor: "var(--line)" }}>
                {products.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-4 p-4" style={{ borderBottom: "1px solid var(--line)" }}>
                    <div className="min-w-0">
                      <div className="text-xs" style={{ color: "var(--ink-soft)" }}>{p.category}</div>
                      <div className="font-display text-base truncate">{p.name}</div>
                      <div className="font-mono text-xs mt-1" style={{ color: "var(--gold)" }}>
                        {money(p.price)} &middot; {p.sizes.join(", ")}
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
          </div>
        )}

        {tab === "orders" && (
          <div className="max-w-4xl fade-in pb-10">
            <div className="grid grid-cols-2 gap-4 mb-8 max-w-md">
              <div className="card p-4">
                <div className="text-xs" style={{ color: "var(--ink-soft)" }}>Jami buyurtmalar</div>
                <div className="font-mono text-xl mt-1">{stats.count}</div>
              </div>
              <div className="card p-4">
                <div className="text-xs" style={{ color: "var(--ink-soft)" }}>Umumiy summa</div>
                <div className="font-mono text-xl mt-1">{money(stats.revenue)}</div>
              </div>
            </div>

            {!ordersLoaded ? (
              <p className="text-sm" style={{ color: "var(--ink-soft)" }}>Yuklanmoqda...</p>
            ) : orders.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--ink-soft)" }}>Hali buyurtma yo'q.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {orders.map((o) => (
                  <div key={o.orderNumber} className="card p-4">
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
                    {o.customer?.notes && (
                      <div className="text-sm mb-2" style={{ color: "var(--ink-soft)" }}>Izoh: {o.customer.notes}</div>
                    )}
                    <div className="mt-3 pt-3" style={{ borderTop: "1px solid var(--line)" }}>
                      {(o.items || []).map((it) => (
                        <div key={`${it.productId}-${it.size}`} className="flex justify-between text-xs py-1">
                          <span>{it.name} ({it.size}) &times; {it.qty}</span>
                          <span className="font-mono">{money(it.price * it.qty)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-sm mt-2 font-medium">
                        <span>Jami</span>
                        <span className="font-mono">{money(o.subtotal)}</span>
                      </div>
                    </div>
                  </div>
                ))}
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
      </div>
    </div>
  );
}
