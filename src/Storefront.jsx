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

@keyframes hero-rise {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}
.hero-anim {
  opacity: 0;
  animation: hero-rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes badge-bump {
  0% { transform: scale(0.6); }
  50% { transform: scale(1.25); }
  100% { transform: scale(1); }
}
.badge-bump { animation: badge-bump 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }

@keyframes heart-pop {
  0% { transform: scale(1); }
  35% { transform: scale(1.35); }
  60% { transform: scale(0.9); }
  100% { transform: scale(1); }
}
.heart-pop { animation: heart-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }

@keyframes added-flash {
  0% { background: var(--ink); }
  40% { background: var(--gold); }
  100% { background: var(--ink); }
}
.added-flash { animation: added-flash 0.6s ease; }

@media (prefers-reduced-motion: reduce) {
  .hero-anim { animation: none; opacity: 1; }
  .badge-bump, .heart-pop, .added-flash { animation: none; }
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
  box-shadow: inset 0 1px 3px rgba(32,28,22,0.18), 0 10px 22px rgba(32,28,22,0.10);
  transform: translateY(-4px) scale(1.015);
}
.tag-card .swatch img {
  transition: transform 0.4s ease;
}
.tag-card:hover .swatch img {
  transform: scale(1.05);
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
  transition: background 0.15s ease, transform 0.12s ease;
}
.btn-ink:hover { background: #362F24; }
.btn-ink:active { transform: scale(0.97); }
.btn-ink:disabled { opacity: 0.4; cursor: not-allowed; }

.btn-ghost {
  background: transparent;
  color: var(--ink);
  border: 1px solid var(--ink);
  transition: background 0.15s ease, color 0.15s ease, transform 0.12s ease;
}
.btn-ghost:hover { background: var(--ink); color: var(--paper); }
.btn-ghost:active { transform: scale(0.97); }

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
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} xmlns="http://www.w3.org/2000/svg" className="heart-pop">
      <path
        d="M12 20.5s-7.5-4.6-10-9.3C0.4 8 1.8 4.8 4.8 4C7 3.4 9.4 4.3 12 7c2.6-2.7 5-3.6 7.2-3C22.2 4.8 23.6 8 22 11.2c-2.5 4.7-10 9.3-10 9.3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarIcon({ size = 14, filled = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "var(--gold)" : "none"} xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12 2.5 15 9l7 1-5.2 4.9L18.2 22 12 18.3 5.8 22 7.2 14.9 2 10l7-1Z"
        stroke="var(--gold)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarRating({ value, size = 14 }) {
  return (
    <span className="inline-flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon key={n} size={size} filled={n <= Math.round(value)} />
      ))}
    </span>
  );
}

function StarPicker({ value, onChange }) {
  return (
    <span className="inline-flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" onClick={() => onChange(n)} aria-label={`${n} yulduz`}>
          <StarIcon size={20} filled={n <= value} />
        </button>
      ))}
    </span>
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

const LANGUAGES = [
  { code: "uz", label: "UZ" },
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
];

const TRANSLATIONS = {
  uz: {
    nav_catalog: "Katalog", nav_about: "Haqida", nav_contact: "Aloqa", nav_admin: "Admin panel",
    login: "KIRISH", cart: "SAVAT", wishlist_label: "Sevimlilar",
    hero_tagline: "Cheklangan seriyadagi, qo'lda ishlangan hashamatli kiyimlar",
    hero_cta: "KATALOGNI KO'RISH",
    see_all: "BARCHASINI KO'RISH", back_to_home: "\u2190 Bosh sahifaga qaytish", back_to_catalog: "\u2190 Katalogga qaytish",
    all_products_title: "Barcha mahsulotlar", search_placeholder: "Mahsulot qidirish...",
    no_results: "Hech narsa topilmadi. Boshqa kalit so'z yoki kategoriya bilan urinib ko'ring.",
    size_label: "O'LCHAM", color_label: "RANG", add_to_cart: "SAVATGA QO'SHISH",
    reviews_title: "Mijozlar sharhlari", no_reviews: "Hali sharh yo'q. Birinchi bo'lib fikr bildiring.",
    your_rating: "Bahoingiz:", your_name: "Ismingiz", write_review: "Fikringizni yozing...",
    submit_review: "SHARH QOLDIRISH", sending: "YUBORILMOQDA...",
    cart_empty: "Savatingiz bo'sh. Katalogdan mahsulot tanlang.", size_word: "O'lcham", color_word: "Rang",
    total: "Jami", place_order: "BUYURTMA BERISH", remove: "O'chirish",
    about_title: "Haqida", contact_title: "Aloqa", account_title: "Hisobim",
    my_orders: "MENING BUYURTMALARIM", logout: "CHIQISH",
    return_policy: "Qaytarish siyosati", privacy_policy: "Maxfiylik siyosati",
    all_rights: "Barcha huquqlar himoyalangan.",
    checkout_name: "Ism familiya", checkout_phone: "Telefon raqam", checkout_address: "Yetkazib berish manzili",
    checkout_notes: "Izoh (ixtiyoriy)", confirm_order: "BUYURTMANI TASDIQLASH", back: "ORQAGA",
    order_details: "Buyurtma ma'lumotlari", order_confirmed: "Buyurtma qabul qilindi", close: "YOPISH",
    thank_you: "Rahmat", order_number_label: "Buyurtmangiz raqami:", will_call: "Tez orada operatorimiz sizga qo'ng'iroq qilib, buyurtmani tasdiqlaydi.",
    login_register_title: "Kirish / Ro'yxatdan o'tish",
    payment_method_label: "To'lov usuli", cash_label: "Naqd pul", card_label: "Karta orqali"
  },
  ru: {
    nav_catalog: "Каталог", nav_about: "О нас", nav_contact: "Контакты", nav_admin: "Админ-панель",
    login: "ВОЙТИ", cart: "КОРЗИНА", wishlist_label: "Избранное",
    hero_tagline: "Роскошная одежда ограниченной серии ручной работы",
    hero_cta: "СМОТРЕТЬ КАТАЛОГ",
    see_all: "ПОКАЗАТЬ ВСЕ", back_to_home: "\u2190 На главную", back_to_catalog: "\u2190 Назад в каталог",
    all_products_title: "Все товары", search_placeholder: "Поиск товара...",
    no_results: "Ничего не найдено. Попробуйте другой запрос или категорию.",
    size_label: "РАЗМЕР", color_label: "ЦВЕТ", add_to_cart: "В КОРЗИНУ",
    reviews_title: "Отзывы клиентов", no_reviews: "Отзывов пока нет. Будьте первым.",
    your_rating: "Ваша оценка:", your_name: "Ваше имя", write_review: "Напишите отзыв...",
    submit_review: "ОСТАВИТЬ ОТЗЫВ", sending: "ОТПРАВКА...",
    cart_empty: "Ваша корзина пуста. Выберите товар из каталога.", size_word: "Размер", color_word: "Цвет",
    total: "Итого", place_order: "ОФОРМИТЬ ЗАКАЗ", remove: "Удалить",
    about_title: "О нас", contact_title: "Контакты", account_title: "Мой аккаунт",
    my_orders: "МОИ ЗАКАЗЫ", logout: "ВЫЙТИ",
    return_policy: "Политика возврата", privacy_policy: "Политика конфиденциальности",
    all_rights: "Все права защищены.",
    checkout_name: "Имя и фамилия", checkout_phone: "Номер телефона", checkout_address: "Адрес доставки",
    checkout_notes: "Комментарий (необязательно)", confirm_order: "ПОДТВЕРДИТЬ ЗАКАЗ", back: "НАЗАД",
    order_details: "Данные заказа", order_confirmed: "Заказ принят", close: "ЗАКРЫТЬ",
    thank_you: "Спасибо", order_number_label: "Номер вашего заказа:", will_call: "Наш оператор скоро позвонит вам и подтвердит заказ.",
    login_register_title: "Вход / Регистрация",
    payment_method_label: "Способ оплаты", cash_label: "Наличными", card_label: "Картой"
  },
  en: {
    nav_catalog: "Catalog", nav_about: "About", nav_contact: "Contact", nav_admin: "Admin panel",
    login: "SIGN IN", cart: "CART", wishlist_label: "Wishlist",
    hero_tagline: "Limited-edition, handcrafted luxury clothing",
    hero_cta: "VIEW CATALOG",
    see_all: "SEE ALL", back_to_home: "\u2190 Back to home", back_to_catalog: "\u2190 Back to catalog",
    all_products_title: "All products", search_placeholder: "Search products...",
    no_results: "Nothing found. Try a different keyword or category.",
    size_label: "SIZE", color_label: "COLOR", add_to_cart: "ADD TO CART",
    reviews_title: "Customer reviews", no_reviews: "No reviews yet. Be the first to share your thoughts.",
    your_rating: "Your rating:", your_name: "Your name", write_review: "Write your review...",
    submit_review: "SUBMIT REVIEW", sending: "SENDING...",
    cart_empty: "Your cart is empty. Choose something from the catalog.", size_word: "Size", color_word: "Color",
    total: "Total", place_order: "PLACE ORDER", remove: "Remove",
    about_title: "About", contact_title: "Contact", account_title: "My account",
    my_orders: "MY ORDERS", logout: "SIGN OUT",
    return_policy: "Return policy", privacy_policy: "Privacy policy",
    all_rights: "All rights reserved.",
    checkout_name: "Full name", checkout_phone: "Phone number", checkout_address: "Delivery address",
    checkout_notes: "Note (optional)", confirm_order: "CONFIRM ORDER", back: "BACK",
    order_details: "Order details", order_confirmed: "Order confirmed", close: "CLOSE",
    thank_you: "Thank you", order_number_label: "Your order number:", will_call: "Our operator will call you shortly to confirm the order.",
    login_register_title: "Sign in / Register",
    payment_method_label: "Payment method", cash_label: "Cash", card_label: "Card"
  },
};

const CATEGORY_LABELS = {
  uz: { "Barchasi": "Barchasi", "Ayollar": "Ayollar", "Erkaklar": "Erkaklar", "Aksessuar": "Aksessuar" },
  ru: { "Barchasi": "Все", "Ayollar": "Женщины", "Erkaklar": "Мужчины", "Aksessuar": "Аксессуары" },
  en: { "Barchasi": "All", "Ayollar": "Women", "Erkaklar": "Men", "Aksessuar": "Accessories" },
};

const COLOR_HEX = {
  "qora": "#1A1A1A", "oq": "#F5F5F5", "kulrang": "#9B9B9B", "kul rang": "#9B9B9B",
  "qizil": "#B23A48", "ko'k": "#3B5C8E", "kok": "#3B5C8E", "havorang": "#7FA8C9",
  "yashil": "#4A7A5E", "sariq": "#D9B54A", "jigarrang": "#6B4A34", "bej": "#D9CBB0",
  "pushti": "#D89AAE", "binafsha": "#7A5C8E", "kumush": "#C4C4C4", "oltin": "#B8862F",
  "to'q ko'k": "#1F3A5F", "krem": "#E9E1CC", "shokolod": "#4A3423",
};
function colorToHex(name) {
  return COLOR_HEX[(name || "").trim().toLowerCase()] || null;
}

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
const REVIEWS_KEY = "sansiro:reviews";

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
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, comment: "" });
  const [reviewError, setReviewError] = useState(null);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [orderForm, setOrderForm] = useState({ name: "", phone: "", address: "", notes: "", paymentMethod: "naqd" });
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
  const [authError, setAuthError] = useState(null);
  const [authSending, setAuthSending] = useState(false);

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

  const [currentPath, setCurrentPath] = useState(() =>
    typeof window !== "undefined" ? window.location.pathname : "/"
  );

  const [lang, setLang] = useState("uz");
  const [langLoaded, setLangLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const result = await window.storage.get("sansiro:lang", false);
        if (result && result.value && TRANSLATIONS[result.value]) setLang(result.value);
      } catch (e) {
        // default to uz
      } finally {
        setLangLoaded(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!langLoaded) return;
    window.storage.set("sansiro:lang", lang, false).catch(() => {});
  }, [lang, langLoaded]);

  const t = (key) => (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || TRANSLATIONS.uz[key] || key;
  const catLabel = (cat) => (CATEGORY_LABELS[lang] && CATEGORY_LABELS[lang][cat]) || cat;

  useEffect(() => {
    const onPopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState(null, "", path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  };

  const goToProduct = (product) => navigateTo(`/product/${product.id}`);

  const scrollToSection = (idOrRef) => {
    const doScroll = () => {
      if (idOrRef === "catalog") {
        catalogRef.current?.scrollIntoView({ behavior: "smooth" });
      } else {
        document.getElementById(idOrRef)?.scrollIntoView({ behavior: "smooth" });
      }
    };
    if (currentPath !== "/") {
      navigateTo("/");
      setTimeout(doScroll, 80);
    } else {
      doScroll();
    }
  };

  useEffect(() => {
    if (!currentPath.startsWith("/product/")) {
      setSelectedProduct(null);
      return;
    }
    const id = currentPath.replace("/product/", "");
    const product = products.find((p) => p.id === id);
    if (!product) {
      setSelectedProduct(null);
      return;
    }
    setSelectedProduct(product);
    setSelectedSize(product.sizes[0]);
    setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0] : null);
    setSelectedImageIndex(0);
    setReviewForm({ name: "", rating: 5, comment: "" });
    setReviewError(null);
    loadReviews(product.id);
  }, [currentPath, products]);

  useEffect(() => {
    document.title = selectedProduct ? `${selectedProduct.name} — SANSIRO` : "SANSIRO — Hashamatli kiyimlar";
  }, [selectedProduct]);

  const loadReviews = async (productId) => {
    setReviewsLoading(true);
    try {
      const result = await window.storage.get(REVIEWS_KEY, true);
      const list = result && result.value ? JSON.parse(result.value) : [];
      setReviews(list.filter((r) => r.productId === productId));
    } catch (e) {
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.comment.trim()) {
      setReviewError("Ismingizni va sharhingizni kiriting.");
      return;
    }
    setReviewError(null);
    setReviewSubmitting(true);
    const entry = {
      id: `rev-${Date.now()}`,
      productId: selectedProduct.id,
      name: reviewForm.name.trim(),
      rating: reviewForm.rating,
      comment: reviewForm.comment.trim(),
      createdAt: new Date().toISOString(),
    };
    try {
      let list = [];
      try {
        const result = await window.storage.get(REVIEWS_KEY, true);
        list = result && result.value ? JSON.parse(result.value) : [];
      } catch (err) {
        if (!String(err.message || "").includes("Kalit topilmadi")) throw err;
        list = [];
      }
      list.unshift(entry);
      await window.storage.set(REVIEWS_KEY, JSON.stringify(list), true);
      setReviews((current) => [entry, ...current]);
    } catch (err) {
      setReviewError("Sharhni saqlashda xatolik yuz berdi.");
    } finally {
      setReviewSubmitting(false);
      setReviewForm({ name: "", rating: 5, comment: "" });
    }
  };

  const addToCart = () => {
    if (!selectedProduct || !selectedSize) return;
    setCart((current) => {
      const existing = current.find(
        (c) => c.productId === selectedProduct.id && c.size === selectedSize && c.color === selectedColor
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
          color: selectedColor,
          qty: 1,
          image: (selectedProduct.images && selectedProduct.images[0]) || selectedProduct.image || null,
        },
      ];
    });
    setSelectedProduct(null);
    setPanel("cart");
    setCheckoutStep("cart");
  };

  const updateQty = (productId, size, color, delta) => {
    setCart((current) =>
      current
        .map((c) =>
          c.productId === productId && c.size === size && c.color === color
            ? { ...c, qty: c.qty + delta }
            : c
        )
        .filter((c) => c.qty > 0)
    );
  };

  const removeItem = (productId, size, color) => {
    setCart((current) => current.filter((c) => !(c.productId === productId && c.size === size && c.color === color)));
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
    let list = [];
    try {
      const existing = await window.storage.get(ORDERS_KEY, true);
      list = existing && existing.value ? JSON.parse(existing.value) : [];
    } catch (err) {
      if (!String(err.message || "").includes("Kalit topilmadi")) {
        setOrderError("Buyurtmani saqlashda xatolik yuz berdi. Internetni tekshirib, qayta urinib ko'ring.");
        return;
      }
      list = [];
    }
    list.unshift(order);
    try {
      await window.storage.set(ORDERS_KEY, JSON.stringify(list), true);
    } catch (err) {
      setOrderError("Buyurtmani saqlashda xatolik yuz berdi. Internetni tekshirib, qayta urinib ko'ring.");
      return;
    }
    setLastOrderNumber(orderNumber);
    setCheckoutStep("confirmed");
    setCart([]);
  };

  const normalizePhone = (v) => v.replace(/[^0-9+]/g, "");

  const AUTH_FUNCTION_URL = "https://bhecsyaxlonixnguqlqw.supabase.co/functions/v1/telegram-auth";
  const BOT_USERNAME = "sansirouzbot"; // agar bot username boshqacha bo'lsa, shu yerni to'g'irlang

  const sendCode = async (e) => {
    e.preventDefault();
    const digits = authPhone.replace(/[^0-9]/g, "");
    if (digits.length < 9) {
      setAuthError("To'g'ri telefon raqam kiriting.");
      return;
    }
    setAuthError(null);
    setAuthSending(true);
    try {
      const res = await fetch(AUTH_FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send", phone: digits }),
      });
      const data = await res.json();
      if (!data.ok && data.reason === "not_linked") {
        setAuthError(
          `Bu raqam hali Telegram botga ulanmagan. Avval @${BOT_USERNAME} botni oching, "Start" bosing va telefon raqamingizni ulashing, so'ng qayta urinib ko'ring.`
        );
        return;
      }
      if (!data.ok) {
        setAuthError("Kod yuborishda xatolik yuz berdi. Qayta urinib ko'ring.");
        return;
      }
      setAuthStep("verify");
    } catch (err) {
      setAuthError("Server bilan bog'lanishda xatolik yuz berdi.");
    } finally {
      setAuthSending(false);
    }
  };

  const verifyCode = async (e) => {
    e.preventDefault();
    if (!profile && !authName.trim()) {
      setAuthError("Ismingizni kiriting.");
      return;
    }
    setAuthError(null);
    setAuthSending(true);
    try {
      const digits = authPhone.replace(/[^0-9]/g, "");
      const res = await fetch(AUTH_FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify", phone: digits, code: authCodeInput.trim() }),
      });
      const data = await res.json();
      if (!data.ok) {
        setAuthError("Kod noto'g'ri yoki muddati o'tgan. Qaytadan urinib ko'ring.");
        return;
      }
      const newProfile = { phone: authPhone, name: profile ? profile.name : authName.trim() };
      setProfile(newProfile);
      try {
        await window.storage.set(PROFILE_KEY, JSON.stringify(newProfile), false);
      } catch (err) {
        // profile still works for this session even if it couldn't be saved for next time
      }
      setAuthStep("success");
    } catch (err) {
      setAuthError("Server bilan bog'lanishda xatolik yuz berdi.");
    } finally {
      setAuthSending(false);
    }
  };

  useEffect(() => {
    if (authStep !== "success") return;
    const timer = setTimeout(() => {
      setPanel("none");
      setAuthStep("phone");
      setAuthPhone("");
      setAuthCodeInput("");
      setAuthName("");
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

  const HOME_PRODUCT_LIMIT = 9;
  const homeProducts = products.slice(0, HOME_PRODUCT_LIMIT);

  const renderProductCard = (p) => (
    <div
      key={p.id}
      onClick={() => goToProduct(p)}
      onKeyDown={(e) => { if (e.key === "Enter") goToProduct(p); }}
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
        <HeartIcon key={wishlist.includes(p.id)} size={17} filled={wishlist.includes(p.id)} />
      </button>
      <div className="swatch aspect-square mx-3 mb-4">
        {p.image ? (
          <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <>
            <div className="swatch-mark">
              <Crown size={40} color="var(--gold-soft)" />
            </div>
            <div className="swatch-watermark">SANSIRO</div>
          </>
        )}
      </div>
      <div className="px-3 md:px-4 pb-4">
        <div className="text-xs" style={{ color: "var(--ink-soft)" }}>{catLabel(p.category)}</div>
        <div className="font-display text-base md:text-lg mt-1">{p.name}</div>
        <div className="font-mono text-xs md:text-sm mt-2" style={{ color: "var(--gold)" }}>{money(p.price)}</div>
      </div>
    </div>
  );

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
    let list = [];
    try {
      const existing = await window.storage.get(MESSAGES_KEY, true);
      list = existing && existing.value ? JSON.parse(existing.value) : [];
    } catch (err) {
      if (!String(err.message || "").includes("Kalit topilmadi")) {
        setContactError("Xabarni yuborishda xatolik yuz berdi. Qayta urinib ko'ring.");
        setContactSending(false);
        return;
      }
      list = [];
    }
    list.unshift(entry);
    try {
      await window.storage.set(MESSAGES_KEY, JSON.stringify(list), true);
    } catch (err) {
      setContactError("Xabarni yuborishda xatolik yuz berdi. Qayta urinib ko'ring.");
      setContactSending(false);
      return;
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
            <button onClick={() => navigateTo("/")} className="flex items-center gap-2">
              <Crown size={16} />
              <span className="font-display text-lg md:text-xl tracking-wide">SANSIRO</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm" style={{ color: "var(--ink-soft)" }}>
            <button onClick={() => scrollToSection("catalog")} className="hover:underline">
              {t("nav_catalog")}
            </button>
            <button onClick={() => scrollToSection("haqida")} className="hover:underline">{t("nav_about")}</button>
            <button onClick={() => scrollToSection("aloqa")} className="hover:underline">{t("nav_contact")}</button>
          </div>

          <div className="flex items-center gap-3 md:gap-5">
            <div className="hidden sm:flex items-center gap-1 font-mono text-xs" style={{ color: "var(--ink-soft)" }}>
              {LANGUAGES.map((l, i) => (
                <React.Fragment key={l.code}>
                  {i > 0 && <span>/</span>}
                  <button
                    onClick={() => setLang(l.code)}
                    style={{ color: lang === l.code ? "var(--ink)" : "var(--ink-soft)", fontWeight: lang === l.code ? 600 : 400 }}
                  >
                    {l.label}
                  </button>
                </React.Fragment>
              ))}
            </div>
            <button
              onClick={() => setPanel("auth")}
              className="flex items-center gap-1.5 text-xs md:text-sm"
              aria-label="Hisob"
            >
              <UserIcon size={16} />
              <span className="hidden sm:inline font-mono">
                {profile ? profile.name.split(" ")[0].toUpperCase() : t("login")}
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
                  key={wishlist.length}
                  className="inline-flex items-center justify-center rounded-full text-xs badge-bump"
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
              {t("cart")}
              {itemCount > 0 && (
                <span
                  key={itemCount}
                  className="inline-flex items-center justify-center rounded-full text-xs badge-bump"
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
              onClick={() => { scrollToSection("catalog"); setMobileMenuOpen(false); }}
              className="text-left py-2.5"
            >
              {t("nav_catalog")}
            </button>
            <button onClick={() => { scrollToSection("haqida"); setMobileMenuOpen(false); }} className="text-left py-2.5">{t("nav_about")}</button>
            <button onClick={() => { scrollToSection("aloqa"); setMobileMenuOpen(false); }} className="text-left py-2.5">{t("nav_contact")}</button>
            <div className="flex items-center gap-3 font-mono text-xs pt-2">
              {LANGUAGES.map((l, i) => (
                <React.Fragment key={l.code}>
                  {i > 0 && <span>/</span>}
                  <button
                    onClick={() => setLang(l.code)}
                    style={{ color: lang === l.code ? "var(--ink)" : "var(--ink-soft)", fontWeight: lang === l.code ? 600 : 400 }}
                  >
                    {l.label}
                  </button>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {selectedProduct ? (() => {
        const galleryImages =
          selectedProduct.images && selectedProduct.images.length > 0
            ? selectedProduct.images
            : selectedProduct.image
            ? [selectedProduct.image]
            : [];
        const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null;
        return (
          <section className="px-5 md:px-12 py-8 max-w-4xl mx-auto fade-in">
            <button onClick={() => scrollToSection("catalog")} className="text-xs mb-6 hover:underline" style={{ color: "var(--ink-soft)" }}>
              {t("back_to_catalog")}
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="swatch aspect-square">
                  {galleryImages.length > 0 ? (
                    <img
                      src={galleryImages[selectedImageIndex] || galleryImages[0]}
                      alt={selectedProduct.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <div className="swatch-mark"><Crown size={64} color="var(--gold-soft)" /></div>
                  )}
                </div>
                {galleryImages.length > 1 && (
                  <div className="flex gap-2 mt-3 overflow-x-auto">
                    {galleryImages.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImageIndex(i)}
                        style={{
                          width: 56,
                          height: 56,
                          flexShrink: 0,
                          border: i === selectedImageIndex ? "2px solid var(--gold)" : "1px solid var(--line)",
                        }}
                      >
                        <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <div className="text-xs" style={{ color: "var(--ink-soft)" }}>{catLabel(selectedProduct.category)}</div>
                <div className="font-display text-2xl md:text-3xl mt-1">{selectedProduct.name}</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="font-mono text-lg" style={{ color: "var(--gold)" }}>{money(selectedProduct.price)}</span>
                  {avgRating && (
                    <span className="flex items-center gap-1 text-xs" style={{ color: "var(--ink-soft)" }}>
                      <StarRating value={avgRating} /> ({reviews.length})
                    </span>
                  )}
                </div>

                {selectedProduct.description && (
                  <p className="text-sm mt-4 leading-relaxed" style={{ color: "var(--ink-soft)" }}>
                    {selectedProduct.description}
                  </p>
                )}

                <div className="mt-5">
                  <div className="text-xs mb-2 tracking-wide" style={{ color: "var(--ink-soft)" }}>{t("size_label")}</div>
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

                {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                  <div className="mt-5">
                    <div className="text-xs mb-2 tracking-wide" style={{ color: "var(--ink-soft)" }}>
                      {t("color_label")}{selectedColor ? `: ${selectedColor}` : ""}
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {selectedProduct.colors.map((c) => {
                        const hex = colorToHex(c);
                        return (
                          <button
                            key={c}
                            onClick={() => setSelectedColor(c)}
                            title={c}
                            aria-label={c}
                            className={`pill px-3 py-1 text-sm flex items-center gap-2 ${selectedColor === c ? "active" : ""}`}
                          >
                            {hex && (
                              <span
                                style={{
                                  display: "inline-block",
                                  width: 12,
                                  height: 12,
                                  borderRadius: "50%",
                                  background: hex,
                                  border: "1px solid var(--line)",
                                }}
                              />
                            )}
                            {c}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <button onClick={addToCart} className="btn-ink w-full py-3 text-sm tracking-wide mt-8">
                  {t("add_to_cart")}
                </button>

                <div className="mt-10 pt-6" style={{ borderTop: "1px solid var(--line)" }}>
                  <div className="font-display text-lg mb-4">{t("reviews_title")}</div>

                  {reviewsLoading ? (
                    <p className="text-xs" style={{ color: "var(--ink-soft)" }}>...</p>
                  ) : reviews.length === 0 ? (
                    <p className="text-xs mb-4" style={{ color: "var(--ink-soft)" }}>{t("no_reviews")}</p>
                  ) : (
                    <div className="flex flex-col gap-4 mb-6">
                      {reviews.map((r) => (
                        <div key={r.id} className="text-sm">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{r.name}</span>
                            <StarRating value={r.rating} size={12} />
                          </div>
                          <p className="mt-1" style={{ color: "var(--ink-soft)" }}>{r.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <form onSubmit={submitReview} className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs" style={{ color: "var(--ink-soft)" }}>{t("your_rating")}</span>
                      <StarPicker value={reviewForm.rating} onChange={(n) => setReviewForm({ ...reviewForm, rating: n })} />
                    </div>
                    <input
                      className="input-line py-2 text-sm"
                      placeholder={t("your_name")}
                      value={reviewForm.name}
                      onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                    />
                    <textarea
                      className="input-line py-2 text-sm w-full"
                      rows={3}
                      placeholder={t("write_review")}
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    />
                    {reviewError && <p className="text-xs" style={{ color: "var(--danger)" }}>{reviewError}</p>}
                    <button type="submit" disabled={reviewSubmitting} className="btn-ghost py-2 text-xs tracking-wide self-start px-5">
                      {reviewSubmitting ? t("sending") : t("submit_review")}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        );
      })() : currentPath === "/katalog" ? (
        <section className="px-4 md:px-12 py-10 max-w-5xl mx-auto fade-in">
          <button onClick={() => navigateTo("/")} className="text-xs mb-6 hover:underline" style={{ color: "var(--ink-soft)" }}>
            {t("back_to_home")}
          </button>

          <div className="crown-divider mb-8">
            <hr className="hairline" />
            <span className="font-display text-xl md:text-2xl tracking-wide">{t("all_products_title")}</span>
            <hr className="hairline" />
          </div>

          <div className="max-w-sm mx-auto mb-6 px-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("search_placeholder")}
              className="input-line w-full py-2 text-sm text-center"
              aria-label={t("search_placeholder")}
            />
          </div>

          <div className="flex justify-center gap-2 md:gap-3 mb-10 flex-wrap px-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`pill px-3 md:px-4 py-1.5 rounded-full text-xs tracking-wide ${activeCategory === cat ? "active" : ""}`}
              >
                {catLabel(cat).toUpperCase()}
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
              {t("no_results")}
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {filteredProducts.map(renderProductCard)}
            </div>
          )}
        </section>
      ) : (
      <>
      {/* Hero */}
      <header className="text-center px-5 py-16 md:py-28">
        <div className="crown-divider mb-4 hero-anim" style={{ animationDelay: "0.05s" }}>
          <hr className="hairline" />
          <Crown size={26} />
          <hr className="hairline" />
        </div>
        <h1 className="hero-title font-display font-medium leading-none hero-anim" style={{ fontSize: "clamp(2.8rem, 13vw, 8rem)", animationDelay: "0.15s" }}>
          SANSIRO
        </h1>
        <p className="tracking-widest text-xs md:text-sm mt-3 hero-anim" style={{ color: "var(--ink-soft)", animationDelay: "0.25s" }}>
          EST. 2024 &bull; LUXURY CLOTHING
        </p>
        <p className="font-display italic text-base md:text-xl mt-8 max-w-xl mx-auto px-2 hero-anim" style={{ color: "var(--ink)", animationDelay: "0.35s" }}>
          {t("hero_tagline")}
        </p>
        <button
          onClick={() => catalogRef.current?.scrollIntoView({ behavior: "smooth" })}
          className="btn-ink font-mono text-xs tracking-wider px-8 py-3 mt-10 hero-anim"
          style={{ animationDelay: "0.45s" }}
        >
          {t("hero_cta")}
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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
          {homeProducts.map(renderProductCard)}
        </div>

        {products.length > HOME_PRODUCT_LIMIT && (
          <div className="text-center mt-10">
            <button onClick={() => navigateTo("/katalog")} className="btn-ghost px-8 py-3 text-xs tracking-wider">
              {t("see_all")} ({products.length})
            </button>
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
          <span className="font-display text-xl md:text-2xl tracking-wide">{t("contact_title")}</span>
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
      </>
      )}

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
            {t("return_policy")}
          </button>
          <button onClick={() => setPolicyView("privacy")} className="hover:underline">
            {t("privacy_policy")}
          </button>
        </div>
        <p className="font-mono text-xs mt-4" style={{ color: "var(--ink-soft)" }}>
          &copy; 2026 SANSIRO. {t("all_rights")}
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

      {/* Scrim shared by cart + auth drawers */}
      <div className={`scrim ${panel !== "none" ? "open" : ""}`} onClick={() => setPanel("none")} />

      {/* Cart drawer */}
      <div className={`drawer ${panel === "cart" ? "open" : ""}`}>
        <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid var(--line)" }}>
          <span className="font-display text-lg">
            {checkoutStep === "cart" && t("cart")}
            {checkoutStep === "form" && t("order_details")}
            {checkoutStep === "confirmed" && t("order_confirmed")}
          </span>
          <button onClick={() => setPanel("none")} aria-label="Yopish" className="text-lg">&times;</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {checkoutStep === "cart" && (
            cart.length === 0 ? (
              <p className="text-sm text-center mt-10" style={{ color: "var(--ink-soft)" }}>
                {t("cart_empty")}
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {cart.map((c) => (
                  <div key={`${c.productId}-${c.size}-${c.color || ""}`} className="flex gap-3 pb-4" style={{ borderBottom: "1px solid var(--line)" }}>
                    <div className="swatch" style={{ width: 56, height: 56, flexShrink: 0 }}>
                      {c.image ? (
                        <img src={c.image} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div className="swatch-mark"><Crown size={20} color="var(--gold-soft)" /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{c.name}</div>
                      <div className="text-xs mt-0.5" style={{ color: "var(--ink-soft)" }}>
                        {t("size_word")}: {c.size}{c.color ? ` \u00b7 ${t("color_word")}: ${c.color}` : ""}
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <button onClick={() => updateQty(c.productId, c.size, c.color, -1)} className="btn-ghost w-6 h-6 text-xs flex items-center justify-center">-</button>
                        <span className="font-mono text-sm">{c.qty}</span>
                        <button onClick={() => updateQty(c.productId, c.size, c.color, 1)} className="btn-ghost w-6 h-6 text-xs flex items-center justify-center">+</button>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-mono text-sm">{money(c.price * c.qty)}</div>
                      <button onClick={() => removeItem(c.productId, c.size, c.color)} className="text-xs mt-2" style={{ color: "var(--ink-soft)" }}>
                        {t("remove")}
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
                <label className="block text-xs mb-1" style={{ color: "var(--ink-soft)" }}>{t("checkout_name")}</label>
                <input
                  className="input-line py-2 text-sm"
                  value={orderForm.name}
                  onChange={(e) => setOrderForm({ ...orderForm, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: "var(--ink-soft)" }}>{t("checkout_phone")}</label>
                <input
                  className="input-line py-2 text-sm font-mono"
                  placeholder="+998 90 123 45 67"
                  value={orderForm.phone}
                  onChange={(e) => setOrderForm({ ...orderForm, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: "var(--ink-soft)" }}>{t("checkout_address")}</label>
                <input
                  className="input-line py-2 text-sm"
                  value={orderForm.address}
                  onChange={(e) => setOrderForm({ ...orderForm, address: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs mb-2" style={{ color: "var(--ink-soft)" }}>{t("payment_method_label")}</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderForm({ ...orderForm, paymentMethod: "naqd" })}
                    className={`pill px-4 py-1.5 text-sm flex-1 ${orderForm.paymentMethod === "naqd" ? "active" : ""}`}
                  >
                    {t("cash_label")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderForm({ ...orderForm, paymentMethod: "karta" })}
                    className={`pill px-4 py-1.5 text-sm flex-1 ${orderForm.paymentMethod === "karta" ? "active" : ""}`}
                  >
                    {t("card_label")}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs mb-1" style={{ color: "var(--ink-soft)" }}>{t("checkout_notes")}</label>
                <input
                  className="input-line py-2 text-sm"
                  value={orderForm.notes}
                  onChange={(e) => setOrderForm({ ...orderForm, notes: e.target.value })}
                />
              </div>
              {orderError && <p className="text-xs" style={{ color: "var(--danger)" }}>{orderError}</p>}
              <button type="submit" className="btn-ink py-3 text-sm tracking-wide mt-2">
                {t("confirm_order")}
              </button>
              <button type="button" onClick={() => setCheckoutStep("cart")} className="btn-ghost py-3 text-sm tracking-wide">
                {t("back")}
              </button>
            </form>
          )}

          {checkoutStep === "confirmed" && (
            <div className="text-center mt-10 fade-in">
              <Crown size={28} />
              <p className="font-display text-xl mt-4">{t("thank_you")}, {orderForm.name.split(" ")[0]}!</p>
              <p className="text-sm mt-3" style={{ color: "var(--ink-soft)" }}>
                {t("order_number_label")} <span className="font-mono">{lastOrderNumber}</span>
              </p>
              <p className="text-sm mt-3" style={{ color: "var(--ink-soft)" }}>
                {t("will_call")}
              </p>
              <button
                onClick={() => { setPanel("none"); setCheckoutStep("cart"); setOrderForm({ name: "", phone: "", address: "", notes: "", paymentMethod: "naqd" }); }}
                className="btn-ink px-8 py-3 text-sm tracking-wide mt-8"
              >
                {t("close")}
              </button>
            </div>
          )}
        </div>

        {checkoutStep === "cart" && cart.length > 0 && (
          <div className="p-5" style={{ borderTop: "1px solid var(--line)" }}>
            <div className="flex justify-between text-sm mb-4">
              <span style={{ color: "var(--ink-soft)" }}>{t("total")}</span>
              <span className="font-mono">{money(subtotal)}</span>
            </div>
            <button onClick={goToCheckoutForm} className="btn-ink w-full py-3 text-sm tracking-wide">
              {t("place_order")}
            </button>
          </div>
        )}
      </div>

      {/* Auth / registration drawer */}
      <div className={`drawer ${panel === "auth" ? "open" : ""}`}>
        <div className="flex items-center justify-between p-5" style={{ borderBottom: "1px solid var(--line)" }}>
          <span className="font-display text-lg">
            {profile ? t("account_title") : t("login_register_title")}
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
                {t("my_orders")}
              </button>
              <button onClick={logout} className="btn-ghost w-full py-3 text-sm tracking-wide">
                {t("logout")}
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
              <button type="submit" disabled={authSending} className="btn-ink py-3 text-sm tracking-wide">
                {authSending ? "YUBORILMOQDA..." : "KODNI YUBORISH"}
              </button>
            </form>
          ) : (
            <form onSubmit={verifyCode} className="flex flex-col gap-5 fade-in">
              <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
                Telegram botimizga yuborilgan 4 xonali kodni kiriting.
              </p>
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
              <button type="submit" disabled={authSending} className="btn-ink py-3 text-sm tracking-wide">
                {authSending ? "TEKSHIRILMOQDA..." : "TASDIQLASH"}
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
          <span className="font-display text-lg">{t("wishlist_label")}</span>
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
                    {p.image ? (
                      <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div className="swatch-mark"><Crown size={20} color="var(--gold-soft)" /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{p.name}</div>
                    <div className="font-mono text-xs mt-1" style={{ color: "var(--gold)" }}>{money(p.price)}</div>
                  </div>
                  <div className="flex flex-col gap-2 items-end flex-shrink-0">
                    <button
                      onClick={() => { setPanel("none"); goToProduct(p); }}
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
          <span className="font-display text-lg">{t("my_orders")}</span>
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
                    <div key={`${it.productId}-${it.size}-${it.color || ""}`} className="text-xs flex justify-between py-0.5">
                      <span>{it.name} ({it.size}{it.color ? `, ${it.color}` : ""}) &times; {it.qty}</span>
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
