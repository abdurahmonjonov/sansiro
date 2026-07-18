import React, { useState, useEffect, useRef, useMemo } from "react";

const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;0,6..96,600;1,6..96,400&family=Jost:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

:root {
  --paper: #F3EEE3;
  --paper-deep: #E7DFCC;
  --ink: #201C16;
  --ink-soft: #6E6656;
  --gold: #97783E;
  --gold-soft: #C9B588;
  --line: #D2C7AC;
  --danger: #8E3B3B;
}

.sansiro-root {
  background: var(--paper);
  color: var(--ink);
  font-family: 'Jost', sans-serif;
  position: relative;
  overflow-x: hidden;
  width: 100%;
}

.font-display { font-family: 'Bodoni Moda', serif; }
.font-mono { font-family: 'IBM Plex Mono', monospace; }

.hairline { height: 1px; background: var(--line); border: none; }

.crown-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
}
.crown-divider .hairline { flex: 1; max-width: 140px; }

.ticker-track {
  display: flex;
  width: max-content;
  animation: sansiro-scroll 34s linear infinite;
}
@keyframes sansiro-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@media (prefers-reduced-motion: reduce) {
  .ticker-track { animation: none; }
}

.tag-card {
  position: relative;
  background: var(--paper);
  border: 1px solid var(--line);
  padding-top: 30px;
  transition: box-shadow 0.25s ease, transform 0.25s ease;
  width: 100%;
}
.tag-card::before {
  content: "";
  position: absolute;
  top: 10px; left: 50%;
  transform: translateX(-50%);
  width: 13px; height: 13px;
  border-radius: 50%;
  background: var(--paper);
  border: 1.5px solid var(--ink);
}
.tag-card:hover {
  box-shadow: inset 0 1px 3px rgba(32,28,22,0.18), 0 6px 16px rgba(32,28,22,0.08);
  transform: translateY(-2px);
}

.swatch {
  background: var(--paper-deep);
  position: relative;
  overflow: hidden;
}
.swatch-mark {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.35;
}
.swatch-watermark {
  position: absolute;
  bottom: 10px; right: -18px;
  font-family: 'Bodoni Moda', serif;
  font-size: 13px;
  letter-spacing: 0.25em;
  color: var(--ink-soft);
  opacity: 0.25;
  transform: rotate(-90deg);
  transform-origin: right bottom;
  white-space: nowrap;
}

.btn-ink {
  background: var(--ink);
  color: var(--paper);
  transition: background 0.15s ease, transform 0.1s ease;
}
.btn-ink:hover { background: #362F24; }
.btn-ink:disabled { opacity: 0.4; cursor: not-allowed; }

.btn-ghost {
  background: transparent;
  color: var(--ink);
  border: 1px solid var(--ink);
}
.btn-ghost:hover { background: var(--ink); color: var(--paper); }

.pill {
  border: 1px solid var(--line);
  color: var(--ink-soft);
  transition: all 0.15s ease;
}
.pill.active, .pill:hover {
  border-color: var(--ink);
  color: var(--ink);
  background: var(--paper-deep);
}

.input-line {
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--line);
  color: var(--ink);
  width: 100%;
}
.input-line:focus { outline: none; border-color: var(--ink); }

.drawer {
  position: fixed;
  top: 0; right: 0;
  height: 100%;
  height: 100dvh;
  width: min(420px, 100vw);
  background: var(--paper);
  border-left: 1px solid var(--line);
  box-shadow: -12px 0 30px rgba(32,28,22,0.12);
  transform: translateX(100%);
  transition: transform 0.35s cubic-bezier(0.22,1,0.36,1);
  z-index: 50;
  display: flex;
  flex-direction: column;
}
.drawer.open { transform: translateX(0); }

.scrim {
  position: fixed; inset: 0;
  background: rgba(32,28,22,0.35);
  z-index: 40;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}
.scrim.open { opacity: 1; pointer-events: auto; }

.mobile-menu {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  background: var(--paper);
  border-bottom: 1px solid var(--line);
}
.mobile-menu.open { max-height: 220px; }

.fade-in { animation: sansiro-fade 0.35s ease-out; }
@keyframes sansiro-fade {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.modal-backdrop {
  position: fixed; inset: 0;
  background: rgba(32,28,22,0.45);
  z-index: 60;
  display: flex; align-items: center; justify-content: center;
  padding: 16px;
  overflow-y: auto;
}

.code-note {
  background: var(--paper-deep);
  border: 1px dashed var(--gold);
  color: var(--ink);
}

.card {
  background: var(--paper);
  border: 1px solid var(--line);
}
.card-frame {
  border: 1px solid var(--line);
  overflow: hidden;
}

*:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }

@media (max-width: 420px) {
  .hero-title { font-size: clamp(2.6rem, 15vw, 6rem) !important; }
}
`;

function Crown({ size = 20, color = "var(--ink)" }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 48 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4 30 L2 10 L13 18 L24 4 L35 18 L46 10 L44 30 Z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        fill="none"
      />
      <line x1="4" y1="30" x2="44" y2="30" stroke={color} strokeWidth="2" />
    </svg>
  );
}

function UserIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function HeartIcon({ size = 18, filled = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 20.5s-7.5-4.6-10-9.3C0.4 8 1.8 4.8 4.8 4C7 3.4 9.4 4.3 12 7c2.6-2.7 5-3.6 7.2-3C22.2 4.8 23.6 8 22 11.2c-2.5 4.7-10 9.3-10 9.3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TelegramIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M21.5 4.5 2.8 11.7c-1.1.4-1.1 1.4-.2 1.7l4.8 1.5 1.9 5.8c.2.6.4.8.9.8.4 0 .6-.2.9-.5l2.3-2.2 4.7 3.5c.9.5 1.5.2 1.7-.8L22 5.6c.3-1.2-.2-1.7-1.5-1.1Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path d="M9.4 14.9 17 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function InstagramIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
    </svg>
  );
}

const SOCIAL_LINKS = {
  telegram: "https://t.me/sansiro_uzb",
  instagram: "https://www.instagram.com/sansiro__uz/",
};

const CATEGORIES = ["Barchasi", "Ayollar", "Erkaklar", "Aksessuar"];

const PRODUCTS = [
  { id: "p1", name: "Ipak ko'ylak", category: "Ayollar", price: 1450000, sizes: ["XS", "S", "M", "L"] },
  { id: "p2", name: "Yun palto", category: "Ayollar", price: 3200000, sizes: ["S", "M", "L"] },
  { id: "p3", name: "Klassik kostyum", category: "Erkaklar", price: 4100000, sizes: ["48", "50", "52", "54"] },
  { id: "p4", name: "Kashmir sviter", category: "Erkaklar", price: 1890000, sizes: ["M", "L", "XL"] },
  { id: "p5", name: "Ipak sharf", category: "Aksessuar", price: 620000, sizes: ["Bir xil o'lcham"] },
  { id: "p6", name: "Charm kamar", category: "Aksessuar", price: 540000, sizes: ["90", "95", "100"] },
  { id: "p7", name: "Lineya ko'ylak", category: "Erkaklar", price: 980000, sizes: ["S", "M", "L", "XL"] },
  { id: "p8", name: "Drape ko'ylak", category: "Ayollar", price: 2650000, sizes: ["XS", "S", "M"] },
  { id: "p9", name: "Ipak galstuk", category: "Aksessuar", price: 410000, sizes: ["Bir xil o'lcham"] },
];

const money = (n) => new Intl.NumberFormat("uz-UZ").format(Math.round(n)) + " so'm";

const CART_KEY = "sansiro:cart";
const PROFILE_KEY = "sansiro:profile";
const PRODUCTS_KEY = "sansiro:products";
const ORDERS_KEY = "sansiro:orders";
const WISHLIST_KEY = "sansiro:wishlist";
const MESSAGES_KEY = "sansiro:messages";

export default function Sansiro() {
  const [cart, setCart] = useState([]);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [products, setProducts] = useState(PRODUCTS);
  const [panel, setPanel] = useState("none"); // none | cart | auth
  const [policyView, setPolicyView] = useState(null); // null | "return" | "privacy"
  const [checkoutStep, setCheckoutStep] = useState("cart"); // cart | form | confirmed
  const [activeCategory, setActiveCategory] = useState("Barchasi");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [orderForm, setOrderForm] = useState({ name: "", phone: "", address: "", notes: "" });
  const [orderError, setOrderError] = useState(null);
  const [lastOrderNumber, setLastOrderNumber] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const catalogRef = useRef(null);

  // Auth / registration state
  const [profile, setProfile] = useState(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [authStep, setAuthStep] = useState("phone"); // phone | verify
  const [authPhone, setAuthPhone] = useState("");
  const [authName, setAuthName] = useState("");
  const [authCodeInput, setAuthCodeInput] = useState("");
  const [generatedCode, setGeneratedCode] = useState(null);
  const [authError, setAuthError] = useState(null);

  // Search, wishlist, and order-history state
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoaded, setWishlistLoaded] = useState(false);
  const [myOrders, setMyOrders] = useState([]);
  const [myOrdersLoading, setMyOrdersLoading] = useState(false);
  const [myOrdersLoaded, setMyOrdersLoaded] = useState(false);

  // Contact form state
  const [contactForm, setContactForm] = useState({ name: "", contact: "", message: "" });
  const [contactError, setContactError] = useState(null);
  const [contactSending, setContactSending] = useState(false);
  const [contactSent, setContactSent] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get(CART_KEY, false);
        if (result && result.value) setCart(JSON.parse(result.value));
      } catch (e) {
        // fresh visitor, no saved cart yet
      } finally {
        setCartLoaded(true);
      }
    })();
    (async () => {
      try {
        const result = await window.storage.get(PROFILE_KEY, false);
        if (result && result.value) setProfile(JSON.parse(result.value));
      } catch (e) {
        // not registered yet
      } finally {
        setProfileLoaded(true);
      }
    })();
    (async () => {
      try {
        const result = await window.storage.get(PRODUCTS_KEY, true);
        if (result && result.value) {
          const stored = JSON.parse(result.value);
          setProducts(stored.length > 0 ? stored : PRODUCTS);
        } else {
          // Shared catalog is empty (admin hasn't added anything yet) — show the
          // built-in placeholder catalog for display only, without saving it to
          // shared storage, so it never shows up as "real" products in the admin panel.
          setProducts(PRODUCTS);
        }
      } catch (e) {
        setProducts(PRODUCTS);
      }
    })();
    (async () => {
      try {
        const result = await window.storage.get(WISHLIST_KEY, false);
        if (result && result.value) setWishlist(JSON.parse(result.value));
      } catch (e) {
        // no saved wishlist yet
      } finally {
        setWishlistLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!wishlistLoaded) return;
    window.storage.set(WISHLIST_KEY, JSON.stringify(wishlist), false).catch(() => {});
  }, [wishlist, wishlistLoaded]);

  useEffect(() => {
    if (!cartLoaded) return;
    window.storage.set(CART_KEY, JSON.stringify(cart), false).catch(() => {});
  }, [cart, cartLoaded]);

  const openProduct = (product) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes[0]);
  };

  const addToCart = () => {
    if (!selectedProduct || !selectedSize) return;
    setCart((current) => {
      const existing = current.find(
        (c) => c.productId === selectedProduct.id && c.size === selectedSize
      );
      if (existing) {
        return current.map((c) =>
          c === existing ? { ...c, qty: c.qty + 1 } : c
        );
      }
      return [
        ...current,
        {
          productId: selectedProduct.id,
          name: selectedProduct.name,
          price: selectedProduct.price,
          size: selectedSize,
          qty: 1,
        },
      ];
    });
    setSelectedProduct(null);
    setPanel("cart");
    setCheckoutStep("cart");
  };

  const updateQty = (productId, size, delta) => {
    setCart((current) =>
      current
        .map((c) =>
          c.productId === productId && c.size === size
            ? { ...c, qty: c.qty + delta }
            : c
        )
        .filter((c) => c.qty > 0)
    );
  };

  const removeItem = (productId, size) => {
    setCart((current) => current.filter((c) => !(c.productId === productId && c.size === size)));
  };

  const subtotal = useMemo(() => cart.reduce((s, c) => s + c.price * c.qty, 0), [cart]);
  const itemCount = useMemo(() => cart.reduce((s, c) => s + c.qty, 0), [cart]);

  const goToCheckoutForm = () => {
    setOrderForm((f) => ({
      ...f,
      name: f.name || (profile ? profile.name : ""),
      phone: f.phone || (profile ? profile.phone : ""),
    }));
    setCheckoutStep("form");
  };

  const submitOrder = async (e) => {
    e.preventDefault();
    if (!orderForm.name.trim() || !orderForm.phone.trim() || !orderForm.address.trim()) {
      setOrderError("Iltimos, ism, telefon va manzilni to'ldiring.");
      return;
    }
    setOrderError(null);
    const orderNumber = `SS-${Date.now().toString().slice(-6)}`;
    const order = {
      orderNumber,
      items: cart,
      subtotal,
      customer: { ...orderForm },
      status: "Yangi",
      createdAt: new Date().toISOString(),
    };
    try {
      const existing = await window.storage.get(ORDERS_KEY, true);
      const list = existing && existing.value ? JSON.parse(existing.value) : [];
      list.unshift(order);
      await window.storage.set(ORDERS_KEY, JSON.stringify(list), true);
    } catch (err) {
      // order still confirms locally even if the shared log couldn't be written
    }
    setLastOrderNumber(orderNumber);
    setCheckoutStep("confirmed");
    setCart([]);
  };

  const normalizePhone = (v) => v.replace(/[^0-9+]/g, "");

  const sendCode = (e) => {
    e.preventDefault();
    const digits = authPhone.replace(/[^0-9]/g, "");
    if (digits.length < 9) {
      setAuthError("To'g'ri telefon raqam kiriting.");
      return;
    }
    setAuthError(null);
    const code = String(Math.floor(1000 + Math.random() * 9000));
    setGeneratedCode(code);
    setAuthStep("verify");
  };

  const verifyCode = async (e) => {
    e.preventDefault();
    if (authCodeInput.trim() !== generatedCode) {
      setAuthError("Kod noto'g'ri. Qaytadan urinib ko'ring.");
      return;
    }
    if (!profile && !authName.trim()) {
      setAuthError("Ismingizni kiriting.");
      return;
    }
    const newProfile = { phone: authPhone, name: profile ? profile.name : authName.trim() };
    setAuthError(null);
    setProfile(newProfile);
    try {
      await window.storage.set(PROFILE_KEY, JSON.stringify(newProfile), false);
    } catch (err) {
      // profile still works for this session even if it couldn't be saved for next time
    }
    setAuthStep("success");
  };

  useEffect(() => {
    if (authStep !== "success") return;
    const timer = setTimeout(() => {
      setPanel("none");
      setAuthStep("phone");
      setAuthPhone("");
      setAuthCodeInput("");
      setAuthName("");
      setGeneratedCode(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1400);
    return () => clearTimeout(timer);
  }, [authStep]);

  const logout = async () => {
    try {
      await window.storage.delete(PROFILE_KEY, false);
    } catch (err) {
      // nothing saved to delete, that's fine
    }
    setProfile(null);
    setPanel("none");
  };

  const toggleWishlist = (productId) => {
    setWishlist((current) =>
      current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]
    );
  };

  const loadMyOrders = async () => {
    if (!profile) return;
    setMyOrdersLoading(true);
    try {
      const result = await window.storage.get(ORDERS_KEY, true);
      const list = result && result.value ? JSON.parse(result.value) : [];
      setMyOrders(list.filter((o) => o.customer?.phone === profile.phone));
    } catch (e) {
      setMyOrders([]);
    } finally {
      setMyOrdersLoading(false);
      setMyOrdersLoaded(true);
    }
  };

  const filteredProducts = products
    .filter((p) => activeCategory === "Barchasi" || p.category === activeCategory)
    .filter((p) => p.name.toLowerCase().includes(searchQuery.trim().toLowerCase()));

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  const submitContactMessage = async (e) => {
    e.preventDefault();
    if (!contactForm.name.trim() || !contactForm.contact.trim() || !contactForm.message.trim()) {
      setContactError("Iltimos, barcha maydonlarni to'ldiring.");
      return;
    }
    setContactError(null);
    setContactSending(true);
    const entry = { ...contactForm, id: `msg-${Date.now()}`, createdAt: new Date().toISOString() };
    try {
      const existing = await window.storage.get(MESSAGES_KEY, true);
      const list = existing && existing.value ? JSON.parse(existing.value) : [];
      list.unshift(entry);
      await window.storage.set(MESSAGES_KEY, JSON.stringify(list), true);
    } catch (err) {
      // message still confirms to the visitor even if the shared log couldn't be written
    }
    setContactSending(false);
    setContactSent(true);
    setContactForm({ name: "", contact: "", message: "" });
  };

  return (
    <div className="sansiro-root min-h-screen">
      <style>{STYLES}</style>

      {/* Nav */}
      <nav className="px-4 md:px-12" style={{ borderBottom: "1px solid var(--line)" }}>
        <div className="flex items-center justify-between py-4 md:py-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="md:hidden text-lg leading-none"
              aria-label="Menyu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? "\u2715" : "\u2630"}
            </button>
            <div className="flex items-center gap-2">
              <Crown size={16} />
              <span className="font-display text-lg md:text-xl tracking-wide">SANSIRO</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm" style={{ color: "var(--ink-soft)" }}>
            <button onClick={() => catalogRef.current?.scrollIntoView({ behavior: "smooth" })} className="hover:underline">
              Katalog
            </button>
            <a href="#haqida" className="hover:underline">Haqida</a>
            <a href="#aloqa" className="hover:underline">Aloqa</a>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={() => setPanel("auth")}
              className="flex items-center gap-1.5 text-xs md:text-sm"
              aria-label="Hisob"
            >
              <UserIcon size={16} />
              <span className="hidden sm:inline font-mono">
                {profile ? profile.name.split(" ")[0].toUpperCase() : "KIRISH"}
              </span>
            </button>
            <button
              onClick={() => setPanel("wishlist")}
              className="relative flex items-center gap-1.5 text-xs md:text-sm"
              aria-label="Sevimlilar"
            >
              <HeartIcon size={16} filled={wishlist.length > 0} />
              {wishlist.length > 0 && (
                <span
                  className="inline-flex items-center justify-center rounded-full text-xs"
                  style={{ background: "var(--ink)", color: "var(--paper)", width: 20, height: 20 }}
                >
                  {wishlist.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setPanel("cart")}
              className="relative text-xs md:text-sm flex items-center gap-2 font-mono"
              aria-label="Savat"
            >
              SAVAT
              {itemCount > 0 && (
                <span
                  className="inline-flex items-center justify-center rounded-full text-xs"
                  style={{ background: "var(--ink)", color: "var(--paper)", width: 20, height: 20 }}
                >
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <div className={`mobile-menu md:hidden ${mobileMenuOpen ? "open" : ""}`}>
          <div className="flex flex-col text-sm px-2 pb-4" style={{ color: "var(--ink-soft)" }}>
            <button
              onClick={() => { catalogRef.current?.scrollIntoView({ behavior: "smooth" }); setMobileMenuOpen(false); }}
              className="text-left py-2.5"
            >
              Katalog
            </button>
            <a href="#haqida" onClick={() => setMobileMenuOpen(false)} className="py-2.5">Haqida</a>
            <a href="#aloqa" onClick={() => setMobileMenuOpen(false)} className="py-2.5">Aloqa</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="text-center px-5 py-16 md:py-28">
        <div className="crown-divider mb-4">
          <hr className="hairline" />
          <Crown size={26} />
          <hr className="hairline" />
        </div>
        <h1 className="hero-title font-display font-medium leading-none" style={{ fontSize: "clamp(2.8rem, 13vw, 8rem)" }}>
          SANSIRO
        </h1>
        <p className="tracking-widest text-xs md:text-sm mt-3" style={{ color: "var(--ink-soft)" }}>
          EST. 2024 &bull; LUXURY CLOTHING
        </p>
        <p className="font-display italic text-base md:text-xl mt-8 max-w-xl mx-auto px-2" style={{ color: "var(--ink)" }}>
          Cheklangan seriyadagi, qo'lda ishlangan hashamatli kiyimlar
        </p>
        <button
          onClick={() => catalogRef.current?.scrollIntoView({ behavior: "smooth" })}
          className="btn-ink font-mono text-xs tracking-wider px-8 py-3 mt-10"
        >
          KATALOGNI KO'RISH
        </button>
      </header>

      {/* Ticker */}
      <div style={{ borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }} className="py-3 overflow-hidden">
        <div className="ticker-track font-mono text-xs tracking-widest" style={{ color: "var(--ink-soft)" }}>
          {[...Array(2)].map((_, rep) => (
            <span key={rep} className="flex items-center">
              {["QO'LDA TIKILGAN", "CHEKLANGAN SERIYA", "HUNARMAND ISHI", "TABIIY GAZLAMALAR"].map((word, i) => (
                <span key={i} className="flex items-center">
                  <span className="px-4 md:px-6">{word}</span>
                  <Crown size={12} color="var(--gold)" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Catalog */}
      <section ref={catalogRef} className="px-4 md:px-12 py-14 md:py-16">
        <div className="crown-divider mb-8">
          <hr className="hairline" />
          <span className="font-display text-xl md:text-2xl tracking-wide">Katalog</span>
          <hr className="hairline" />
        </div>

        <div className="max-w-sm mx-auto mb-6 px-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Mahsulot qidirish..."
            className="input-line w-full py-2 text-sm text-center"
            aria-label="Mahsulot qidirish"
          />
        </div>

        <div className="flex justify-center gap-2 md:gap-3 mb-10 flex-wrap px-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`pill px-3 md:px-4 py-1.5 rounded-full text-xs tracking-wide ${activeCategory === cat ? "active" : ""}`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {searchQuery.trim() && (
          <p className="text-center text-xs mb-6" style={{ color: "var(--ink-soft)" }}>
            "{searchQuery}" bo'yicha {filteredProducts.length} ta natija topildi
          </p>
        )}

        {filteredProducts.length === 0 ? (
          <p className="text-center text-sm py-10" style={{ color: "var(--ink-soft)" }}>
            Hech narsa topilmadi. Boshqa kalit so'z yoki kategoriya bilan urinib ko'ring.
          </p>
        ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              onClick={() => openProduct(p)}
              onKeyDown={(e) => { if (e.key === "Enter") openProduct(p); }}
              role="button"
              tabIndex={0}
              className="tag-card text-left fade-in cursor-pointer"
            >
              <button
                onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); }}
                className="absolute z-10"
                style={{ top: 8, right: 8, color: wishlist.includes(p.id) ? "var(--gold)" : "var(--ink-soft)" }}
                aria-label="Sevimlilarga qo'shish"
              >
                <HeartIcon size={17} filled={wishlist.includes(p.id)} />
              </button>
              <div className="swatch aspect-square mx-3 mb-4">
                <div className="swatch-mark">
                  <Crown size={40} color="var(--gold-soft)" />
                </div>
                <div className="swatch-watermark">SANSIRO</div>
              </div>
              <div className="px-3 md:px-4 pb-4">
                <div className="text-xs" style={{ color: "var(--ink-soft)" }}>{p.category}</div>
                <div className="font-display text-base md:text-lg mt-1">{p.name}</div>
                <div className="font-mono text-xs md:text-sm mt-2" style={{ color: "var(--gold)" }}>{money(p.price)}</div>
              </div>
            </div>
          ))}
        </div>
        )}
      </section>

      {/* About */}
      <section id="haqida" className="px-5 md:px-12 py-16 md:py-20" style={{ background: "var(--paper-deep)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="crown-divider mb-6">
            <hr className="hairline" />
            <Crown size={22} />
            <hr className="hairline" />
          </div>
          <p className="font-display italic text-lg md:text-2xl leading-relaxed">
            "Har bir tikuv — hunarmandchilik va vaqtga bo'lgan hurmatning ifodasi"
          </p>
          <p className="text-sm mt-6 leading-relaxed" style={{ color: "var(--ink-soft)" }}>
            SANSIRO 2024-yilda tashkil topgan. Biz cheklangan seriyalarda, tabiiy gazlamalardan,
            qo'lda ishlov berilgan kiyimlar tayyorlaymiz — vaqt sinovidan o'tadigan, ortiqcha
            bezaksiz zamonaviy hashamat falsafasi asosida.
          </p>
        </div>
      </section>

      {/* Aloqa */}
      <section id="aloqa" className="px-5 md:px-12 py-16 md:py-20">
        <div className="crown-divider mb-10">
          <hr className="hairline" />
          <span className="font-display text-xl md:text-2xl tracking-wide">Aloqa</span>
          <hr className="hairline" />
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <div className="card-frame mb-3" style={{ border: "1px solid var(--line)" }}>
              <iframe
                title="SANSIRO manzili"
                src="https://www.openstreetmap.org/export/embed.html?bbox=71.9579%2C40.2814%2C71.9779%2C40.2914&layer=mapnik&marker=40.2864%2C71.9679"
                width="100%"
                height="280"
                style={{ border: 0, display: "block" }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Quvasoy+Farg%27ona+viloyati"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs hover:underline"
              style={{ color: "var(--gold)" }}
            >
              Google Xaritada ochish &rarr;
            </a>

            <div className="text-sm flex flex-col gap-4 mt-6">
              <div>
                <div className="text-xs tracking-wide mb-1" style={{ color: "var(--ink-soft)" }}>MANZIL</div>
                <div>Farg'ona viloyati, Quvasoy shahri</div>
              </div>
              <div>
                <div className="text-xs tracking-wide mb-1" style={{ color: "var(--ink-soft)" }}>TELEFON</div>
                <div className="font-mono">+998 90 000 00 00</div>
              </div>
              <div>
                <div className="text-xs tracking-wide mb-2" style={{ color: "var(--ink-soft)" }}>IJTIMOIY TARMOQLAR</div>
                <div className="flex gap-4">
                  <a
                    href={SOCIAL_LINKS.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:underline"
                    aria-label="Telegram"
                  >
                    <TelegramIcon size={18} /> Telegram
                  </a>
                  <a
                    href={SOCIAL_LINKS.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:underline"
                    aria-label="Instagram"
                  >
                    <InstagramIcon size={18} /> Instagram
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div>
            {contactSent ? (
              <div className="card p-6 text-center fade-in" style={{ border: "1px solid var(--line)" }}>
                <Crown size={24} />
                <p className="font-display text-lg mt-4">Rahmat!</p>
                <p className="text-sm mt-2" style={{ color: "var(--ink-soft)" }}>
                  Xabaringiz qabul qilindi, tez orada siz bilan bog'lanamiz.
                </p>
                <button onClick={() => setContactSent(false)} className="btn-ghost px-6 py-2 text-xs tracking-wide mt-6">
                  YANA XABAR YOZISH
                </button>
              </div>
            ) : (
              <form onSubmit={submitContactMessage} className="flex flex-col gap-5">
                <div>
                  <label className="block text-xs mb-1" style={{ color: "var(--ink-soft)" }}>Ism familiya</label>
                  <input
                    className="input-line py-2 text-sm"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1" style={{ color: "var(--ink-soft)" }}>Telefon yoki email</label>
                  <input
                    className="input-line py-2 text-sm"
                    value={contactForm.contact}
                    onChange={(e) => setContactForm({ ...contactForm, contact: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs mb-1" style={{ color: "var(--ink-soft)" }}>Xabar</label>
                  <textarea
                    className="input-line py-2 text-sm w-full"
                    rows={5}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  />
                </div>
                {contactError && <p className="text-xs" style={{ color: "var(--danger)" }}>{contactError}</p>}
                <button type="submit" disabled={contactSending} className="btn-ink py-3 text-sm tracking-wide">
                  {contactSending ? "YUBORILMOQDA..." : "XABAR YUBORISH"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-5 md:px-12 py-10 text-center" style={{ borderTop: "1px solid var(--line)" }}>
        <Crown size={20} />
        <div className="flex justify-center gap-5 mt-4">
          <a href={SOCIAL_LINKS.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram" style={{ color: "var(--ink-soft)" }}>
            <TelegramIcon size={18} />
          </a>
          <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" style={{ color: "var(--ink-soft)" }}>
            <InstagramIcon size={18} />
          </a>
        </div>
        <div className="flex justify-center gap-6 mt-5 text-xs" style={{ color: "var(--ink-soft)" }}>
          <button onClick={() => setPolicyView("return")} className="hover:underline">
            Qaytarish siyosati
          </button>
          <button onClick={() => setPolicyView("privacy")} className="hover:underline">
            Maxfiylik siyosati
          </button>
        </div>
        <p className="font-mono text-xs mt-4" style={{ color: "var(--ink-soft)" }}>
          &copy; 2026 SANSIRO. Barcha huquqlar himoyalangan.
        </p>
      </footer>

      {policyView && (
        <div className="modal-backdrop" onClick={() => setPolicyView(null)}>
          <div
            className="fade-in max-w-2xl w-full overflow-y-auto"
            style={{ background: "var(--paper)", border: "1px solid var(--line)", maxHeight: "85vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid var(--line)" }}>
              <span className="font-display text-lg">
                {policyView === "return" ? "Qaytarish va almashtirish siyosati" : "Maxfiylik siyosati"}
              </span>
              <button onClick={() => setPolicyView(null)} aria-label="Yopish" className="text-lg">&times;</button>
            </div>
            <div className="p-6 text-sm leading-relaxed flex flex-col gap-4" style={{ color: "var(--ink)" }}>
              {policyView === "return" ? (
                <>
                  <p><strong>1. Qaytarish muddati.</strong> Mahsulotni qo'lga olgan kundan boshlab 7 kun ichida, agar u kiyilmagan, yorlig'i saqlangan va asl holatida bo'lsa, qaytarish yoki almashtirish mumkin.</p>
                  <p><strong>2. Qaytarib bo'lmaydigan holatlar.</strong> Individual o'lchamga moslab tikilgan yoki chegirmadagi "yakuniy sotuv" mahsulotlar qaytarilmaydi.</p>
                  <p><strong>3. Qaytarish tartibi.</strong> Telefon yoki Telegram orqali buyurtma raqamingiz bilan murojaat qiling, biz yetkazib berish/qaytarish tartibini birga kelishamiz.</p>
                  <p><strong>4. Pulni qaytarish.</strong> Mahsulot qabul qilingandan so'ng, to'lov 3-7 ish kuni ichida qaytariladi.</p>
                  <p><strong>5. Nuqsonli mahsulot.</strong> Agar mahsulotda ishlab chiqarish nuqsoni bo'lsa, almashtirish yoki to'liq pul qaytarish bepul amalga oshiriladi.</p>
                  <p className="text-xs mt-4" style={{ color: "var(--ink-soft)" }}>
                    Eslatma: bu — umumiy shablon matn. Aniq shartlarni o'z biznesingizga mos ravishda tahrirlang; iste'molchilar huquqlari bo'yicha O'zbekiston qonunchiligiga muvofiqligini yurist bilan tekshirib olish tavsiya etiladi.
                  </p>
                </>
              ) : (
                <>
                  <p><strong>1. Qanday ma'lumot yig'amiz.</strong> Buyurtma berishda ism, telefon raqami va yetkazib berish manzilini so'raymiz. Ro'yxatdan o'tganda ham xuddi shu ma'lumotlar saqlanadi.</p>
                  <p><strong>2. Ma'lumotdan qanday foydalanamiz.</strong> Bu ma'lumotlar faqat buyurtmangizni bajarish, siz bilan bog'lanish va xizmat sifatini yaxshilash uchun ishlatiladi.</p>
                  <p><strong>3. Ma'lumotni uchinchi tomonga berish.</strong> Sizning ma'lumotlaringiz sotilmaydi va reklama maqsadida uchinchi tomonlarga berilmaydi.</p>
                  <p><strong>4. Ma'lumotni saqlash.</strong> Ma'lumotlar xizmatni ko'rsatish uchun zarur muddat davomida saqlanadi.</p>
                  <p><strong>5. Sizning huquqlaringiz.</strong> Istalgan vaqtda o'z ma'lumotlaringizni o'chirishni so'rashingiz mumkin — buning uchun biz bilan bog'laning.</p>
                  <p className="text-xs mt-4" style={{ color: "var(--ink-soft)" }}>
                    Eslatma: bu — umumiy shablon matn, huquqiy hujjat emas. To'liq shaxsiy ma'lumotlarni himoya qilish siyosati uchun yurist bilan maslahatlashish tavsiya etiladi.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Product quick view modal */}
      {selectedProduct && (
        <div className="modal-backdrop" onClick={() => setSelectedProduct(null)}>
          <div
            className="fade-in max-w-lg w-full"
            style={{ background: "var(--paper)", border: "1px solid var(--line)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="swatch aspect-video">
              <div className="swatch-mark"><Crown size={56} color="var(--gold-soft)" /></div>
            </div>
            <div className="p-5 md:p-6">
              <div className="text-xs" style={{ color: "var(--ink-soft)" }}>{selectedProduct.category}</div>
              <div className="font-display text-xl md:text-2xl mt-1">{selectedProduct.name}</div>
              <div className="font-mono text-base mt-2" style={{ color: "var(--gold)" }}>{money(selectedProduct.price)}</div>

              <div className="mt-5">
                <div className="text-xs mb-2 tracking-wide" style={{ color: "var(--ink-soft)" }}>O'LCHAM</div>
                <div className="flex gap-2 flex-wrap">
                  {selectedProduct.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`pill px-3 py-1 text-sm ${selectedSize === s ? "active" : ""}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button onClick={() => setSelectedProduct(null)} className="btn-ghost flex-1 py-3 text-xs md:text-sm tracking-wide">
                  BEKOR QILISH
                </button>
                <button onClick={addToCart} className="btn-ink flex-1 py-3 text-xs md:text-sm tracking-wide">
                  SAVATGA QO'SHISH
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scrim shared by cart + auth drawers */}
      <div className={`scrim ${panel !== "none" ? "open" : ""}`} onClick={() => setPanel("none")} />

      {/* Cart drawer */}
      <div className={`drawer ${panel === "cart" ? "open" : ""}`}>
        <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid var(--line)" }}>
          <span className="font-display text-lg">
            {checkoutStep === "cart" && "Savat"}
            {checkoutStep === "form" && "Buyurtma ma'lumotlari"}
            {checkoutStep === "confirmed" && "Buyurtma qabul qilindi"}
          </span>
          <button onClick={() => setPanel("none")} aria-label="Yopish" className="text-lg">&times;</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {checkoutStep === "cart" && (
            cart.length === 0 ? (
              <p className="text-sm text-center mt-10" style={{ color: "var(--ink-soft)" }}>
                Savatingiz bo'sh. Katalogdan mahsulot tanlang.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {cart.map((c) => (
                  <div key={`${c.productId}-${c.size}`} className="flex gap-3 pb-4" style={{ borderBottom: "1px solid var(--line)" }}>
                    <div className="swatch" style={{ width: 56, height: 56, flexShrink: 0 }}>
                      <div className="swatch-mark"><Crown size={20} color="var(--gold-soft)" /></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{c.name}</div>
                      <div className="text-xs mt-0.5" style={{ color: "var(--ink-soft)" }}>O'lcham: {c.size}</div>
                      <div className="flex items-center gap-3 mt-2">
                        <button onClick={() => updateQty(c.productId, c.size, -1)} className="btn-ghost w-6 h-6 text-xs flex items-center justify-center">-</button>
                        <span className="font-mono text-sm">{c.qty}</span>
                        <button onClick={() => updateQty(c.productId, c.size, 1)} className="btn-ghost w-6 h-6 text-xs flex items-center justify-center">+</button>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-mono text-sm">{money(c.price * c.qty)}</div>
                      <button onClick={() => removeItem(c.productId, c.size)} className="text-xs mt-2" style={{ color: "var(--ink-soft)" }}>
                        O'chirish
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {checkoutStep === "form" && (
            <form onSubmit={submitOrder} className="flex flex-col gap-5">
              <div>
                <label className="block text-xs mb-1" style={{ color: "var(--ink-soft)" }}>Ism familiya</label>
                <input
                  className="input-line py-2 text-sm"
                  value={orderForm.name}
                  onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: "var(--ink-soft)" }}>Telefon raqam</label>
                <input
                  className="input-line py-2 text-sm font-mono"
                  placeholder="+998 90 123 45 67"
                  value={orderForm.phone}
                  onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: "var(--ink-soft)" }}>Yetkazib berish manzili</label>
                <input
                  className="input-line py-2 text-sm"
                  value={orderForm.address}
                  onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: "var(--ink-soft)" }}>Izoh (ixtiyoriy)</label>
                <input
                  className="input-line py-2 text-sm"
                  value={orderForm.notes}
                  onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                />
              </div>
              {orderError && <p className="text-xs" style={{ color: "var(--danger)" }}>{orderError}</p>}
              <button type="submit" className="btn-ink py-3 text-sm tracking-wide mt-2">
                BUYURTMANI TASDIQLASH
              </button>
              <button type="button" onClick={() => setCheckoutStep("cart")} className="btn-ghost py-3 text-sm tracking-wide">
                ORQAGA
              </button>
            </form>
          )}

          {checkoutStep === "confirmed" && (
            <div className="text-center mt-10 fade-in">
              <Crown size={28} />
              <p className="font-display text-xl mt-4">Rahmat, {orderForm.name.split(" ")[0]}!</p>
              <p className="text-sm mt-3" style={{ color: "var(--ink-soft)" }}>
                Buyurtmangiz raqami: <span className="font-mono">{lastOrderNumber}</span>
              </p>
              <p className="text-sm mt-3" style={{ color: "var(--ink-soft)" }}>
                Tez orada operatorimiz {orderForm.phone} raqamiga qo'ng'iroq qilib, buyurtmani tasdiqlaydi.
              </p>
              <button
                onClick={() => { setPanel("none"); setCheckoutStep("cart"); setOrderForm({ name: "", phone: "", address: "", notes: "" }); }}
                className="btn-ink px-8 py-3 text-sm tracking-wide mt-8"
              >
                YOPISH
              </button>
            </div>
          )}
        </div>

        {checkoutStep === "cart" && cart.length > 0 && (
          <div className="p-5" style={{ borderTop: "1px solid var(--line)" }}>
            <div className="flex justify-between text-sm mb-4">
              <span style={{ color: "var(--ink-soft)" }}>Jami</span>
              <span className="font-mono">{money(subtotal)}</span>
            </div>
            <button onClick={goToCheckoutForm} className="btn-ink w-full py-3 text-sm tracking-wide">
              BUYURTMA BERISH
            </button>
          </div>
        )}
      </div>

      {/* Auth / registration drawer */}
      <div className={`drawer ${panel === "auth" ? "open" : ""}`}>
        <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid var(--line)" }}>
          <span className="font-display text-lg">
            {profile ? "Hisobim" : "Kirish / Ro'yxatdan o'tish"}
          </span>
          <button onClick={() => setPanel("none")} aria-label="Yopish" className="text-lg">&times;</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {authStep === "success" ? (
            <div className="text-center mt-10 fade-in">
              <Crown size={28} />
              <p className="font-display text-xl mt-4">Xush kelibsiz, {profile ? profile.name.split(" ")[0] : ""}!</p>
              <p className="text-sm mt-3" style={{ color: "var(--ink-soft)" }}>
                Ro'yxatdan muvaffaqiyatli o'tdingiz. Bosh sahifaga yo'naltirilmoqda...
              </p>
            </div>
          ) : profile ? (
            <div className="fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-full flex items-center justify-center" style={{ width: 44, height: 44, background: "var(--paper-deep)" }}>
                  <UserIcon size={20} />
                </div>
                <div>
                  <div className="font-display text-lg">{profile.name}</div>
                  <div className="text-xs font-mono" style={{ color: "var(--ink-soft)" }}>{profile.phone}</div>
                </div>
              </div>
              <button
                onClick={() => { setPanel("orders"); loadMyOrders(); }}
                className="btn-ink w-full py-3 text-sm tracking-wide mb-3"
              >
                MENING BUYURTMALARIM
              </button>
              <button onClick={logout} className="btn-ghost w-full py-3 text-sm tracking-wide">
                CHIQISH
              </button>
            </div>
          ) : authStep === "phone" ? (
            <form onSubmit={sendCode} className="flex flex-col gap-5 fade-in">
              <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
                Telefon raqamingizni kiriting — tasdiqlash kodi yuboriladi.
              </p>
              <div>
                <label className="block text-xs mb-1" style={{ color: "var(--ink-soft)" }}>Telefon raqam</label>
                <input
                  className="input-line py-2 text-sm font-mono"
                  placeholder="+998 90 123 45 67"
                  value={authPhone}
                  onChange={(e) => setAuthPhone(normalizePhone(e.target.value))}
                />
              </div>
              {authError && <p className="text-xs" style={{ color: "var(--danger)" }}>{authError}</p>}
              <button type="submit" className="btn-ink py-3 text-sm tracking-wide">
                KODNI YUBORISH
              </button>
            </form>
          ) : (
            <form onSubmit={verifyCode} className="flex flex-col gap-5 fade-in">
              <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
                {authPhone} raqamiga yuborilgan 4 xonali kodni kiriting.
              </p>
              <div className="code-note text-xs px-3 py-2">
                Demo rejimi: haqiqiy SMS xizmati hali ulanmagan, shuning uchun kodni shu yerda ko'rsatamiz — <span className="font-mono">{generatedCode}</span>
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: "var(--ink-soft)" }}>Tasdiqlash kodi</label>
                <input
                  className="input-line py-2 text-sm font-mono tracking-widest"
                  maxLength={4}
                  value={authCodeInput}
                  onChange={(e) => setAuthCodeInput(e.target.value.replace(/[^0-9]/g, ""))}
                />
              </div>
              {!profile && (
                <div>
                  <label className="block text-xs mb-1" style={{ color: "var(--ink-soft)" }}>Ism familiya</label>
                  <input
                    className="input-line py-2 text-sm"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                  />
                </div>
              )}
              {authError && <p className="text-xs" style={{ color: "var(--danger)" }}>{authError}</p>}
              <button type="submit" className="btn-ink py-3 text-sm tracking-wide">
                TASDIQLASH
              </button>
              <button type="button" onClick={() => { setAuthStep("phone"); setAuthError(null); }} className="btn-ghost py-3 text-sm tracking-wide">
                ORQAGA
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Wishlist drawer */}
      <div className={`drawer ${panel === "wishlist" ? "open" : ""}`}>
        <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid var(--line)" }}>
          <span className="font-display text-lg">Sevimlilar</span>
          <button onClick={() => setPanel("none")} aria-label="Yopish" className="text-lg">&times;</button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {wishlistProducts.length === 0 ? (
            <p className="text-sm text-center mt-10" style={{ color: "var(--ink-soft)" }}>
              Sevimlilar ro'yxati bo'sh. Mahsulot kartochkasidagi yurak belgisini bosing.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {wishlistProducts.map((p) => (
                <div key={p.id} className="flex gap-3 pb-4" style={{ borderBottom: "1px solid var(--line)" }}>
                  <div className="swatch" style={{ width: 56, height: 56, flexShrink: 0 }}>
                    <div className="swatch-mark"><Crown size={20} color="var(--gold-soft)" /></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{p.name}</div>
                    <div className="font-mono text-xs mt-1" style={{ color: "var(--gold)" }}>{money(p.price)}</div>
                  </div>
                  <div className="flex flex-col gap-2 items-end flex-shrink-0">
                    <button
                      onClick={() => { setPanel("none"); openProduct(p); }}
                      className="btn-ghost px-3 py-1 text-xs"
                    >
                      KO'RISH
                    </button>
                    <button onClick={() => toggleWishlist(p.id)} className="text-xs" style={{ color: "var(--ink-soft)" }}>
                      Olib tashlash
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Order history drawer */}
      <div className={`drawer ${panel === "orders" ? "open" : ""}`}>
        <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid var(--line)" }}>
          <span className="font-display text-lg">Mening buyurtmalarim</span>
          <button onClick={() => setPanel("none")} aria-label="Yopish" className="text-lg">&times;</button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {myOrdersLoading ? (
            <p className="text-sm text-center mt-10" style={{ color: "var(--ink-soft)" }}>Yuklanmoqda...</p>
          ) : myOrders.length === 0 ? (
            <p className="text-sm text-center mt-10" style={{ color: "var(--ink-soft)" }}>
              {myOrdersLoaded ? "Hali buyurtmalaringiz yo'q." : "Buyurtmalar tez orada yuklanadi."}
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {myOrders.map((o) => (
                <div key={o.orderNumber} className="pb-4" style={{ borderBottom: "1px solid var(--line)" }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm">{o.orderNumber}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--paper-deep)", color: "var(--ink-soft)" }}>
                      {o.status}
                    </span>
                  </div>
                  <div className="text-xs mb-2" style={{ color: "var(--ink-soft)" }}>
                    {new Date(o.createdAt).toLocaleDateString("uz-UZ")}
                  </div>
                  {(o.items || []).map((it) => (
                    <div key={`${it.productId}-${it.size}`} className="text-xs flex justify-between py-0.5">
                      <span>{it.name} ({it.size}) &times; {it.qty}</span>
                      <span className="font-mono">{money(it.price * it.qty)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-sm font-medium mt-2">
                    <span>Jami</span>
                    <span className="font-mono">{money(o.subtotal)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
