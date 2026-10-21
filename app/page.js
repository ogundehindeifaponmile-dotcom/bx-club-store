export default function Home() {
  return (
    <div dangerouslySetInnerHTML={{ __html: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>BX CLUB | Blackxcellencee — Olfactory Atelier</title>
<link rel="shortcut icon" type="image/png" href="https://res.cloudinary.com/dzosy1sic/image/upload/w_32,h_32,c_fill/v1785715293/BX_CLUB_logo_oin4k5.png">
<link rel="icon" type="image/png" href="https://res.cloudinary.com/dzosy1sic/image/upload/w_32,h_32,c_fill/v1785715293/BX_CLUB_logo_oin4k5.png">
<link rel="apple-touch-icon" href="https://res.cloudinary.com/dzosy1sic/image/upload/w_180,h_180,c_fill/v1785715293/BX_CLUB_logo_oin4k5.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://js.stripe.com/v3/"></script>
<script>
tailwind.config = {
  theme: {
    extend: {
      colors: {
        'bx-black': '#0a0a0a',
        'bx-white': '#ffffff',
        'bx-gray': '#888888',
        'bx-light-gray': '#f5f5f5',
        'bx-border': '#e5e5e5',
      },
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      }
    }
  }
}
</script>
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: #ffffff; color: #0a0a0a; font-family: 'Inter', sans-serif; overflow-x: hidden; }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: #f5f5f5; }
::-webkit-scrollbar-thumb { background: #0a0a0a; }
.hero-carousel { position: relative; width: 100%; height: 100vh; min-height: 600px; overflow: hidden; }
.hero-slide { position: absolute; inset: 0; opacity: 0; transition: opacity 0.8s ease; display: flex; align-items: center; justify-content: center; }
.hero-slide.active { opacity: 1; z-index: 2; }
.hero-slide img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.hero-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.35); z-index: 1; }
.hero-content { position: relative; z-index: 3; text-align: center; color: #fff; }
.hero-content h1 { font-family: 'Playfair Display', serif; font-size: clamp(2.5rem, 6vw, 5rem); font-weight: 400; letter-spacing: 0.02em; line-height: 1.1; margin-bottom: 1.5rem; }
.hero-content p { font-size: 0.85rem; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 2rem; font-weight: 300; }
.hero-btn { display: inline-block; padding: 14px 40px; background: #fff; color: #0a0a0a; font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 500; text-decoration: none; transition: all 0.3s ease; border: 1px solid #fff; }
.hero-btn:hover { background: transparent; color: #fff; }
.carousel-dots { position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); display: flex; gap: 12px; z-index: 4; }
.carousel-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.4); cursor: pointer; transition: all 0.3s ease; }
.carousel-dot.active { background: #fff; transform: scale(1.2); }
.main-nav { position: fixed; top: 0; left: 0; right: 0; z-index: 50; background: transparent; border-bottom: none; transition: transform 0.4s ease, background 0.3s ease; }
.main-nav.hidden { transform: translateY(-100%); }
.main-nav.scrolled { background: rgba(255,255,255,0.95); backdrop-filter: blur(10px); box-shadow: 0 2px 20px rgba(0,0,0,0.05); }
.main-nav.scrolled .nav-link { color: #0a0a0a; }
.main-nav.scrolled .nav-link::after { background: #0a0a0a; }
.main-nav.scrolled #cartBtn, .main-nav.scrolled #currencyBtn { color: #0a0a0a !important; }
.main-nav.scrolled .mobile-menu-btn { color: #0a0a0a; }
.main-nav.scrolled .nav-logo img { filter: brightness(1) invert(0) contrast(1.2) !important; }
.nav-link { font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; color: #ffffff; text-decoration: none; font-weight: 400; padding: 8px 0; position: relative; transition: color 0.3s ease; }
.nav-link::after { content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 1px; background: #ffffff; transition: width 0.3s ease; }
.nav-link:hover::after, .nav-link.active::after { width: 100%; }
.nav-logo { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 600; letter-spacing: 0.05em; color: #0a0a0a; text-decoration: none; }
.nav-logo img { height: 60px; width: auto; object-fit: contain; background: transparent !important; filter: brightness(0) invert(1); }
.mobile-menu-btn { display: none; background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #ffffff; }
.mobile-nav { display: none; position: fixed; top: 60px; left: 0; right: 0; background: #fff; border-bottom: 1px solid #e5e5e5; padding: 20px; z-index: 49; }
.mobile-nav.open { display: block; }
.mobile-nav a { display: block; padding: 12px 0; font-size: 0.8rem; letter-spacing: 0.15em; text-transform: uppercase; color: #0a0a0a; text-decoration: none; border-bottom: 1px solid #f5f5f5; }
.section-heading { text-align: center; margin-bottom: 3rem; }
.section-heading h2 { font-family: 'Playfair Display', serif; font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 400; margin-bottom: 0.5rem; }
.section-heading p { font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; color: #888; }
.product-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
.product-card { position: relative; cursor: pointer; text-decoration: none; color: inherit; }
.product-card .product-img-wrap { position: relative; overflow: hidden; background: #f5f5f5; aspect-ratio: 3/4; margin-bottom: 12px; }
.product-card .product-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
.product-card:hover .product-img-wrap img { transform: scale(1.05); }
.product-card .quick-view { position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%) translateY(10px); opacity: 0; background: #0a0a0a; color: #fff; padding: 10px 24px; font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; border: none; cursor: pointer; transition: all 0.3s ease; white-space: nowrap; }
.product-card:hover .quick-view { opacity: 1; transform: translateX(-50%) translateY(0); }
.product-card .product-name { font-size: 0.8rem; font-weight: 400; margin-bottom: 4px; line-height: 1.4; }
.product-card .product-price { font-size: 0.8rem; font-weight: 500; color: #0a0a0a; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.product-card .product-price .alt-price { color: #888; font-size: 0.8em; font-weight: 400; }
.category-banner { position: relative; overflow: hidden; aspect-ratio: 16/9; cursor: pointer; }
.category-banner img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.8s ease; }
.category-banner:hover img { transform: scale(1.05); }
.category-banner .overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.25); display: flex; align-items: center; justify-content: center; flex-direction: column; color: #fff; }
.category-banner h3 { font-family: 'Playfair Display', serif; font-size: clamp(1.5rem, 3vw, 2.5rem); font-weight: 400; margin-bottom: 1rem; }
.category-banner .shop-link { font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: #fff; text-decoration: none; border-bottom: 1px solid #fff; padding-bottom: 4px; transition: all 0.3s ease; }
.category-banner .shop-link:hover { border-color: transparent; }
.faq-item { border-bottom: 1px solid #e5e5e5; }
.faq-question { width: 100%; padding: 20px 0; display: flex; justify-content: space-between; align-items: center; background: none; border: none; cursor: pointer; font-size: 0.9rem; font-weight: 500; text-align: left; }
.faq-question i { transition: transform 0.3s ease; }
.faq-item.open .faq-question i { transform: rotate(180deg); }
.faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.3s ease; }
.faq-item.open .faq-answer { max-height: 200px; }
.faq-answer p { padding-bottom: 20px; font-size: 0.85rem; color: #888; line-height: 1.6; }
.site-footer { background: #0a0a0a; color: #fff; padding: 60px 0 30px; }
.site-footer a { color: #888; text-decoration: none; font-size: 0.75rem; transition: color 0.3s ease; }
.site-footer a:hover { color: #fff; }
.site-footer h4 { font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 1.5rem; font-weight: 500; }
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 100; display: none; align-items: center; justify-content: center; padding: 20px; }
.modal-overlay.active { display: flex; }
.modal-content { background: #fff; max-width: 900px; width: 100%; max-height: 90vh; overflow-y: auto; position: relative; }
.modal-close { position: absolute; top: 20px; right: 20px; background: none; border: none; font-size: 1.2rem; cursor: pointer; z-index: 2; color: #0a0a0a; }
.quick-view-grid { display: grid; grid-template-columns: 1fr 1fr; }
.quick-view-img { aspect-ratio: 3/4; background: #f5f5f5; }
.quick-view-img img { width: 100%; height: 100%; object-fit: cover; }
.quick-view-info { padding: 40px; }
.quick-view-info h2 { font-family: 'Playfair Display', serif; font-size: 1.5rem; margin-bottom: 0.5rem; }
.quick-view-info .price { font-size: 1.1rem; font-weight: 500; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.quick-view-info .price .alt-price { color: #888; font-size: 0.85em; font-weight: 400; }
.quick-view-info .desc { font-size: 0.85rem; color: #888; line-height: 1.6; margin-bottom: 1.5rem; }
.quick-view-info .notes { font-size: 0.75rem; color: #888; margin-bottom: 2rem; }
.add-to-cart-btn { width: 100%; padding: 16px; background: #0a0a0a; color: #fff; border: none; font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; transition: background 0.3s ease; }
.add-to-cart-btn:hover { background: #333; }
.cart-drawer { position: fixed; top: 0; right: 0; width: 100%; max-width: 420px; height: 100vh; background: #fff; z-index: 100; transform: translateX(100%); transition: transform 0.4s ease; display: flex; flex-direction: column; }
.cart-drawer.open { transform: translateX(0); }
.cart-drawer-header { padding: 24px; border-bottom: 1px solid #e5e5e5; display: flex; justify-content: space-between; align-items: center; }
.cart-drawer-header h3 { font-family: 'Playfair Display', serif; font-size: 1.2rem; }
.cart-drawer-body { flex: 1; overflow-y: auto; padding: 24px; }
.cart-drawer-footer { padding: 24px; border-top: 1px solid #e5e5e5; }
.cart-item { display: flex; gap: 16px; margin-bottom: 20px; padding-bottom: 20px; border-bottom: 1px solid #f5f5f5; }
.cart-item img { width: 80px; height: 100px; object-fit: cover; background: #f5f5f5; }
.cart-item-info { flex: 1; }
.cart-item-info h4 { font-size: 0.85rem; margin-bottom: 4px; }
.cart-item-info .price { font-size: 0.8rem; font-weight: 500; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
.cart-item-info .price .alt-price { color: #888; font-size: 0.85em; font-weight: 400; }
.cart-qty { display: flex; align-items: center; gap: 12px; margin-top: 8px; }
.cart-qty button { width: 28px; height: 28px; border: 1px solid #e5e5e5; background: none; cursor: pointer; font-size: 0.8rem; }
.cart-qty span { font-size: 0.8rem; min-width: 20px; text-align: center; }
.remove-item { background: none; border: none; color: #888; cursor: pointer; font-size: 0.75rem; margin-top: 8px; }
.remove-item:hover { color: #0a0a0a; }
.cart-subtotal { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.85rem; }
.cart-total { display: flex; justify-content: space-between; font-size: 1rem; font-weight: 500; margin-bottom: 20px; padding-top: 12px; border-top: 1px solid #e5e5e5; }
.checkout-btn { width: 100%; padding: 16px; background: #0a0a0a; color: #fff; border: none; font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; margin-bottom: 10px; transition: background 0.3s ease; }
.checkout-btn:hover { background: #333; }
.checkout-form input, .checkout-form textarea, .checkout-form select { width: 100%; padding: 14px 16px; border: 1px solid #e5e5e5; font-size: 0.85rem; font-family: 'Inter', sans-serif; outline: none; transition: border-color 0.3s ease; margin-bottom: 12px; }
.checkout-form input:focus, .checkout-form textarea:focus, .checkout-form select:focus { border-color: #0a0a0a; }
.checkout-form label { display: block; font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 6px; color: #888; }
.payment-option { border: 1px solid #e5e5e5; padding: 16px; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; gap: 12px; }
.payment-option:hover, .payment-option.selected { border-color: #0a0a0a; }
.payment-option.selected { background: #f5f5f5; }
.currency-toggle { display: inline-flex; align-items: center; gap: 4px; background: none; border: 1px solid currentColor; color: inherit; font-size: 0.65rem; letter-spacing: 0.1em; text-transform: uppercase; padding: 4px 10px; cursor: pointer; transition: all 0.3s ease; border-radius: 2px; }
.currency-toggle:hover { background: rgba(255,255,255,0.1); }
.main-nav.scrolled .currency-toggle { color: #0a0a0a; border-color: #0a0a0a; }
.main-nav.scrolled .currency-toggle:hover { background: rgba(0,0,0,0.05); }
.toast-msg { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%) translateY(100px); background: #0a0a0a; color: #fff; padding: 14px 32px; font-size: 0.8rem; z-index: 200; opacity: 0; transition: all 0.4s ease; white-space: nowrap; }
.toast-msg.show { opacity: 1; transform: translateX(-50%) translateY(0); }
.currency-detect-loader { position: fixed; top: 80px; right: 20px; z-index: 60; background: #0a0a0a; color: #fff; padding: 8px 16px; font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; border-radius: 2px; opacity: 0; transform: translateY(-10px); transition: all 0.4s ease; pointer-events: none; }
.currency-detect-loader.show { opacity: 1; transform: translateY(0); }
@media (min-width: 768px) { .md\\:hidden { display: none !important; } }
@media (max-width: 1024px) { .product-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 768px) { .product-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; } .quick-view-grid { grid-template-columns: 1fr; } .quick-view-img { aspect-ratio: 1/1; } .nav-links { display: none; } .mobile-menu-btn { display: block; } .hero-carousel { height: 70vh; min-height: 400px; } }
@media (max-width: 480px) { .product-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; } }
.whatsapp-float { position: fixed; bottom: 30px; right: 30px; z-index: 90; width: 56px; height: 56px; background: #25D366; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(37, 211, 102, 0.4); cursor: pointer; transition: all 0.3s ease; text-decoration: none; }
.whatsapp-float:hover { transform: scale(1.1); box-shadow: 0 6px 24px rgba(37, 211, 102, 0.5); }
.whatsapp-float i { color: #fff; font-size: 1.6rem; }
.whatsapp-tooltip { position: fixed; bottom: 40px; right: 96px; background: #0a0a0a; color: #fff; padding: 8px 14px; font-size: 0.75rem; border-radius: 4px; white-space: nowrap; opacity: 0; transform: translateX(10px); transition: all 0.3s ease; pointer-events: none; z-index: 89; }
.whatsapp-tooltip::after { content: ''; position: absolute; top: 50%; right: -6px; transform: translateY(-50%); border-width: 6px 0 6px 6px; border-style: solid; border-color: transparent transparent transparent #0a0a0a; }
.whatsapp-float:hover + .whatsapp-tooltip, .whatsapp-tooltip:hover { opacity: 1; transform: translateX(0); }
@media (max-width: 768px) { .whatsapp-float { width: 48px; height: 48px; bottom: 20px; right: 20px; } .whatsapp-float i { font-size: 1.4rem; } .whatsapp-tooltip { display: none; } }
.success-section { display: none; min-height: 100vh; background: #0a0a0a; color: #fff; padding: 40px 20px; }
.success-section.active { display: flex; align-items: center; justify-content: center; }
.success-card { background: #111; border: 1px solid #222; border-radius: 12px; max-width: 600px; width: 100%; padding: 48px 40px; text-align: center; }
.success-icon { width: 72px; height: 72px; background: rgba(212, 175, 55, 0.1); border: 2px solid #d4af37; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; }
.success-icon i { color: #d4af37; font-size: 1.8rem; }
.success-card h1 { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 400; margin-bottom: 8px; }
.success-card .subtitle { color: #888; font-size: 0.9rem; margin-bottom: 32px; }
.order-box { background: #1a1a1a; border-radius: 8px; padding: 24px; margin-bottom: 24px; text-align: left; }
.order-box h3 { font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; color: #888; margin-bottom: 16px; border-bottom: 1px solid #333; padding-bottom: 10px; }
.order-row { display: flex; justify-content: space-between; margin-bottom: 10px; font-size: 0.85rem; }
.order-row span:first-child { color: #888; }
.order-row span:last-child { color: #fff; font-weight: 500; }
.order-row.total { border-top: 1px solid #333; padding-top: 12px; margin-top: 12px; }
.order-row.total span:last-child { color: #d4af37; font-size: 1.1rem; }
.item-list { margin-bottom: 16px; }
.item-row { display: flex; justify-content: space-between; align-items: flex-start; padding: 10px 0; border-bottom: 1px solid #222; font-size: 0.85rem; }
.item-row:last-child { border-bottom: none; }
.item-name { color: #ccc; flex: 1; padding-right: 12px; }
.item-qty { color: #888; margin-right: 12px; }
.item-price { color: #fff; font-weight: 500; white-space: nowrap; }
.btn-gold { display: inline-block; width: 100%; padding: 16px; background: #d4af37; color: #0a0a0a; border: none; font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase; font-weight: 600; text-decoration: none; cursor: pointer; margin-bottom: 12px; transition: background 0.3s ease; }
.btn-gold:hover { background: #c4a030; }
.btn-outline { display: inline-block; width: 100%; padding: 14px; background: transparent; color: #888; border: 1px solid #333; font-size: 0.7rem; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; cursor: pointer; transition: all 0.3s ease; }
.btn-outline:hover { border-color: #d4af37; color: #d4af37; }
.email-note { margin-top: 24px; padding-top: 20px; border-top: 1px solid #222; font-size: 0.8rem; color: #666; line-height: 1.6; }
.email-note i { color: #d4af37; margin-right: 6px; }
@media (max-width: 480px) { .success-card { padding: 32px 20px; } .success-card h1 { font-size: 1.5rem; } }
</style>
<base target="_blank">
</head>
<body>
<div class="currency-detect-loader" id="currencyLoader">
<i class="fas fa-globe" style="margin-right:6px;"></i>
<span id="currencyLoaderText">Detecting your location...</span>
</div>
<div class="toast-msg" id="toast"></div>

<nav class="main-nav" id="mainNav">
<div class="max-w-7xl mx-auto px-6 py-4">
<div class="flex items-center justify-between">
<div class="hidden md:flex items-center gap-8 flex-1">
<a href="#shop" class="nav-link">Shop</a>
<a href="#mixmatch" class="nav-link">Mix & Match</a>
<a href="#collections" class="nav-link">Collections</a>
</div>
<div class="flex-1 flex justify-center" style="position:absolute;left:50%;transform:translateX(-50%);">
<a href="#" class="nav-logo" onclick="scrollToTop(); return false;">
<img src="https://res.cloudinary.com/dzosy1sic/image/upload/v1781553647/bcde1dde-4501-4ec0-b649-cfbcfcdca496_biowj2.png" alt="BX CLUB" style="height: 60px; width: auto; object-fit: contain; background: transparent !important; filter: brightness(0) invert(1);">
</a>
</div>
<div class="hidden md:flex items-center gap-6 flex-1 justify-end">
<a href="#about" class="nav-link">About</a>
<a href="#contact" class="nav-link">Contact</a>
<a href="#faqs" class="nav-link">FAQs</a>
<button onclick="toggleCurrency()" class="currency-toggle" id="currencyBtn" title="Switch currency">NGN</button>
<button onclick="toggleCart()" id="cartBtn" style="background:none;border:none;cursor:pointer;position:relative;color:#ffffff;">
<i class="fas fa-shopping-bag text-lg"></i>
<span id="cartBadge" style="position:absolute;top:-8px;right:-8px;width:18px;height:18px;background:#0a0a0a;color:#fff;font-size:0.65rem;border-radius:50%;display:none;align-items:center;justify-content:center;">0</span>
</button>
</div>
<div class="flex items-center gap-4 md:ml-auto" style="position:relative;z-index:2;">
<button onclick="toggleCurrency()" class="currency-toggle md:hidden" id="currencyBtnMobile" title="Switch currency">NGN</button>
<button onclick="toggleCart()" id="cartBtnMobile" class="md:hidden" style="background:none;border:none;cursor:pointer;position:relative;color:#ffffff;">
<i class="fas fa-shopping-bag text-lg"></i>
<span id="cartBadgeMobile" style="position:absolute;top:-8px;right:-8px;width:18px;height:18px;background:#0a0a0a;color:#fff;font-size:0.65rem;border-radius:50%;display:none;align-items:center;justify-content:center;">0</span>
</button>
<button class="mobile-menu-btn md:hidden" onclick="toggleMobileMenu()">
<i class="fas fa-bars"></i>
</button>
</div>
</div>
</div>
</nav>

<div class="mobile-nav" id="mobileNav">
<a href="#shop" onclick="toggleMobileMenu()">Shop</a>
<a href="#mixmatch" onclick="toggleMobileMenu()">Mix & Match</a>
<a href="#collections" onclick="toggleMobileMenu()">Collections</a>
<a href="#about" onclick="toggleMobileMenu()">About</a>
<a href="#contact" onclick="toggleMobileMenu()">Contact</a>
<a href="#faqs" onclick="toggleMobileMenu()">FAQs</a>
</div>

<section class="hero-carousel" id="hero">
<div class="hero-slide active">
<img src="https://res.cloudinary.com/dzosy1sic/image/upload/v1781539336/9f90b26a-1b28-4551-a430-34a2488b992a_pffzw0.png" alt="Midnight in Lagos">
<div class="hero-overlay"></div>
<div class="hero-content">
<p>Explore Our New Collection</p>
<a href="#shop" class="hero-btn" onclick="event.preventDefault(); document.getElementById('shop').scrollIntoView({behavior: 'smooth'});">Shop Now</a>
</div>
</div>
<div class="hero-slide">
<img src="https://res.cloudinary.com/dzosy1sic/image/upload/v1781520868/46cb790a-0f20-4834-8408-42dd4a0782fc_kwptbn.png" alt="New Drops">
<div class="hero-overlay"></div>
<div class="hero-content">
<p>New Drops</p>
<a href="#shop" class="hero-btn" onclick="event.preventDefault(); document.getElementById('shop').scrollIntoView({behavior: 'smooth'});">Shop Now</a>
</div>
</div>
<div class="hero-slide">
<img src="https://res.cloudinary.com/dzosy1sic/image/upload/v1781519647/b2ffd146-1262-4c4e-8cfc-9193d2eb4b06_qlzct5.png" alt="Crafted With Intention">
<div class="hero-overlay"></div>
<div class="hero-content">
<p>Crafted With Intention</p>
<a href="#shop" class="hero-btn" onclick="event.preventDefault(); document.getElementById('shop').scrollIntoView({behavior: 'smooth'});">Shop Now</a>
</div>
</div>
<div class="carousel-dots">
<div class="carousel-dot active" onclick="goToSlide(0)"></div>
<div class="carousel-dot" onclick="goToSlide(1)"></div>
<div class="carousel-dot" onclick="goToSlide(2)"></div>
</div>
</section>

<section class="py-20 px-6" id="shop">
<div class="max-w-7xl mx-auto">
<div class="section-heading"><p>Catalog</p><h2>Shop All Products</h2></div>
<div class="product-grid" id="shopGrid"></div>
</div>
</section>

<section class="py-20 px-6" style="background:#ffffff; color:#0a0a0a;" id="mixmatch">
<div class="max-w-7xl mx-auto">
<div class="section-heading" style="margin-bottom:3rem;">
<p style="color:#888;">Build Your Own</p>
<h2 style="color:#0a0a0a;">Mix & Match</h2>
<p style="font-size:0.85rem; color:#888; margin-top:12px; max-width:500px; margin-left:auto; margin-right:auto; line-height:1.6;">
Pick any two items from our collections and create your own bundle. Mix a candle with a diffuser, or pair two candles — it's your choice. Save 10% when you bundle.
</p>
</div>
<div id="mmStep1" style="margin-bottom:40px;">
<div style="display:flex; align-items:center; gap:12px; margin-bottom:24px;">
<span style="width:32px;height:32px;border-radius:50%;background:#0a0a0a;color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:600;">1</span>
<h3 style="font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:400;color:#0a0a0a;">Pick Your First Item</h3>
</div>
<div class="product-grid" id="mmGrid1"></div>
</div>
<div id="mmStep2" style="margin-bottom:40px; display:none;">
<div style="display:flex; align-items:center; gap:12px; margin-bottom:24px;">
<span style="width:32px;height:32px;border-radius:50%;background:#0a0a0a;color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:600;">2</span>
<h3 style="font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:400;color:#0a0a0a;">Pick Your Second Item</h3>
</div>
<div class="product-grid" id="mmGrid2"></div>
</div>
<div id="mmStep3" style="display:none;">
<div style="display:flex; align-items:center; gap:12px; margin-bottom:24px;">
<span style="width:32px;height:32px;border-radius:50%;background:#0a0a0a;color:#fff;display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:600;">3</span>
<h3 style="font-family:'Playfair Display',serif;font-size:1.3rem;font-weight:400;color:#0a0a0a;">Your Bundle</h3>
</div>
<div style="background:#f5f5f5; border:1px solid #e5e5e5; padding:32px; max-width:600px; margin:0 auto;">
<div id="mmBundleItems" style="margin-bottom:24px;"></div>
<div style="border-top:1px solid #e5e5e5; padding-top:20px;">
<div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.85rem; color:#888;">
<span>Individual Total</span><span id="mmOriginalTotal" style="text-decoration:line-through;">0.00</span>
</div>
<div style="display:flex; justify-content:space-between; margin-bottom:8px; font-size:0.85rem; color:#888;">
<span>Bundle Discount (10%)</span><span id="mmDiscountAmount" style="color:#4ade80;">-₦0.00</span>
</div>
<div style="display:flex; justify-content:space-between; font-size:1.2rem; font-weight:500; border-top:1px solid #e5e5e5; padding-top:12px;">
<span>Bundle Total</span><span id="mmBundleTotal" style="color:#0a0a0a;">₦0.00</span>
</div>
</div>
<button class="checkout-btn" style="margin-top:24px; background:#fff; color:#0a0a0a;" onclick="addBundleToCart()">
<i class="fas fa-shopping-bag" style="margin-right:8px;"></i>Add Bundle to Cart
</button>
<button onclick="resetMixMatch()" style="width:100%; padding:14px; background:none; color:#888; border:1px solid #e5e5e5; font-size:0.7rem; letter-spacing:0.15em; text-transform:uppercase; cursor:pointer; margin-top:10px; transition:all 0.3s ease;">Start Over</button>
</div>
</div>
</div>
</section>

<section class="py-10 px-6" id="collections">
<div class="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
<div class="category-banner" onclick="filterByCollection('summer')">
<img src="https://res.cloudinary.com/dzosy1sic/image/upload/v1781540425/32da19e9-6287-4ed8-ab5b-456f2db859fc_atjihx.png" alt="Summer in London">
<div class="overlay"><h3>Summer in London</h3><span class="shop-link">Explore Now</span></div>
</div>
<div class="category-banner" onclick="filterByCollection('midnight')">
<img src="https://res.cloudinary.com/dzosy1sic/image/upload/v1781539336/9f90b26a-1b28-4551-a430-34a2488b992a_pffzw0.png" alt="Midnight in Lagos">
<div class="overlay"><h3>Midnight in Lagos</h3><span class="shop-link">Explore Now</span></div>
</div>
</div>
</section>

<section class="py-20 px-6" style="background:#f5f5f5;">
<div class="max-w-7xl mx-auto">
<div class="section-heading"><p>Featured</p><h2>Best Sellers</h2></div>
<div class="product-grid" id="bestSellersGrid"></div>
</div>
</section>

<section class="py-20 px-6" id="about">
<div class="max-w-4xl mx-auto text-center">
<div class="section-heading"><p>Our Story</p><h2>About BX CLUB</h2></div>
<p class="text-bx-gray leading-relaxed mb-6" style="font-size:0.95rem;">BX CLUB is a luxury olfactory atelier under the umbrella of Blackxcellencee. We craft hand-poured candles, diffusers, and accessories that capture the soul of Lagos and the elegance of London. Every piece is created with intention — designed to elevate your space and spirit.</p>
<p class="text-bx-gray leading-relaxed" style="font-size:0.95rem;">From the obsidian hours of the ancient city to the playful warmth of imperial gardens, our fragrances tell stories. We believe that scent is the most direct path to memory, to peace, and to the divine.</p>
</div>
</section>

<section class="py-20 px-6" style="background:#f5f5f5;" id="faqs">
<div class="max-w-3xl mx-auto">
<div class="section-heading"><p>Questions</p><h2>Frequently Asked</h2></div>
<div id="faqList"></div>
</div>
</section>

<section class="py-20 px-6" id="contact">
<div class="max-w-4xl mx-auto">
<div class="section-heading"><p>Get In Touch</p><h2>Contact Us</h2></div>
<div class="grid md:grid-cols-2 gap-12">
<div>
<div class="mb-8"><h4 style="font-size:0.7rem;letter-spacing:0.2em;text-transform:uppercase;color:#888;margin-bottom:8px;">Email</h4><a href="mailto:bxclubhq@gmail.com" style="font-size:0.9rem;color:#0a0a0a;text-decoration:none;">bxclubhq@gmail.com</a></div>
<div class="mb-8"><h4 style="font-size:0.7rem;letter-spacing:0.2em;text-transform:uppercase;color:#888;margin-bottom:8px;">Phone</h4><a href="tel:+447538277711" style="font-size:0.9rem;color:#0a0a0a;text-decoration:none;">+44 7538 277711</a></div>
<div class="mb-8"><h4 style="font-size:0.7rem;letter-spacing:0.2em;text-transform:uppercase;color:#888;margin-bottom:8px;">Follow Us</h4><div class="flex gap-4"><a href="https://www.instagram.com/bxclubhq/" target="_blank" style="font-size:1.2rem;color:#0a0a0a;"><i class="fab fa-instagram"></i></a></div></div>
</div>
<form onsubmit="handleContact(event)" class="checkout-form">
<input type="text" placeholder="Your Name" required>
<input type="email" placeholder="Your Email" required>
<textarea placeholder="Your Message" rows="5" required></textarea>
<button type="submit" class="checkout-btn" style="margin:0;">Send Message</button>
</form>
</div>
</div>
</section>

<footer class="site-footer">
<div class="max-w-7xl mx-auto px-6">
<div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
<div><h4>Shop</h4><ul style="list-style:none;padding:0;"><li style="margin-bottom:10px;"><a href="#shop">New In</a></li><li style="margin-bottom:10px;"><a href="#shop">All Products</a></li><li style="margin-bottom:10px;"><a href="#collections">Collections</a></li><li style="margin-bottom:10px;"><a href="#" onclick="filterByCollection('summer'); return false;">Summer in London</a></li><li><a href="#" onclick="filterByCollection('midnight'); return false;">Midnight in Lagos</a></li></ul></div>
<div><h4>Support</h4><ul style="list-style:none;padding:0;"><li style="margin-bottom:10px;"><a href="#faqs">FAQs</a></li><li style="margin-bottom:10px;"><a href="#" onclick="showToast('Shipping info coming soon'); return false;">Shipping</a></li><li style="margin-bottom:10px;"><a href="#" onclick="showToast('Returns policy coming soon'); return false;">Returns</a></li><li><a href="#" onclick="showToast('Track order coming soon'); return false;">Track Order</a></li></ul></div>
<div><h4>Company</h4><ul style="list-style:none;padding:0;"><li style="margin-bottom:10px;"><a href="#about">About Us</a></li><li style="margin-bottom:10px;"><a href="#contact">Contact</a></li><li style="margin-bottom:10px;"><a href="#" onclick="showToast('Privacy policy coming soon'); return false;">Privacy Policy</a></li><li><a href="#" onclick="showToast('Terms coming soon'); return false;">Terms of Service</a></li></ul></div>
<div><h4>Newsletter</h4><p style="font-size:0.75rem;color:#666;margin-bottom:16px;">Subscribe for exclusive drops and updates.</p><form onsubmit="handleNewsletter(event)" style="display:flex;"><input type="email" placeholder="Your email" style="flex:1;padding:10px 12px;border:1px solid #333;background:transparent;color:#fff;font-size:0.75rem;outline:none;"><button type="submit" style="padding:10px 16px;background:#fff;color:#0a0a0a;border:none;font-size:0.7rem;cursor:pointer;">JOIN</button></form></div>
</div>
<div style="border-top:1px solid #222;padding-top:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;">
<p style="font-size:0.7rem;color:#666;">© 2026 BX CLUB by Blackxcellencee. All rights reserved.</p>
<div class="flex gap-4"><a href="https://www.instagram.com/bxclubhq/" target="_blank" style="color:#888;"><i class="fab fa-instagram"></i></a></div>
</div>
</div>
</footer>

<div class="modal-overlay" id="quickViewModal" onclick="closeQuickView(event)">
<div class="modal-content" onclick="event.stopPropagation()">
<button class="modal-close" onclick="closeQuickView()"><i class="fas fa-times"></i></button>
<div class="quick-view-grid">
<div class="quick-view-img"><img src="" alt="" id="qvImage"></div>
<div class="quick-view-info">
<h2 id="qvName"></h2>
<p class="price" id="qvPrice"></p>
<p class="desc" id="qvDesc"></p>
<p class="notes" id="qvNotes"></p>
<div style="margin-bottom:16px;">
<label style="font-size:0.7rem;letter-spacing:0.1em;text-transform:uppercase;color:#888;margin-bottom:6px;display:block;">Quantity</label>
<div class="cart-qty" style="margin-top:0;"><button onclick="updateQVQty(-1)">−</button><span id="qvQty">1</span><button onclick="updateQVQty(1)">+</button></div>
</div>
<button class="add-to-cart-btn" id="qvAddBtn" onclick="addFromQuickView()">Add to Cart</button>
</div>
</div>
</div>
</div>

<div style="position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:99;display:none;" id="cartOverlay" onclick="toggleCart()"></div>
<div class="cart-drawer" id="cartDrawer">
<div class="cart-drawer-header">
<h3>Your Cart</h3>
<div style="display:flex;align-items:center;gap:12px;">
<button onclick="toggleCurrency()" class="currency-toggle" id="cartCurrencyBtn" style="color:#0a0a0a;border-color:#0a0a0a;">NGN</button>
<button onclick="toggleCart()" style="background:none;border:none;cursor:pointer;font-size:1.1rem;"><i class="fas fa-times"></i></button>
</div>
</div>
<div class="cart-drawer-body" id="cartBody">
<div style="text-align:center;padding:64px 0;"><i class="fas fa-shopping-bag" style="font-size:2.5rem;color:#ddd;margin-bottom:16px;"></i><p style="color:#888;font-size:0.9rem;">Your cart is empty</p><a href="#shop" onclick="toggleCart()" style="display:inline-block;margin-top:16px;font-size:0.75rem;letter-spacing:0.15em;text-transform:uppercase;border-bottom:1px solid #0a0a0a;padding-bottom:2px;color:#0a0a0a;text-decoration:none;">Continue Shopping</a></div>
</div>
<div class="cart-drawer-footer" id="cartFooter" style="display:none;">
<div class="cart-subtotal"><span>Subtotal</span><span id="cartSubtotal">₦0.00</span></div>
<div class="cart-total"><span>Total</span><span id="cartTotal">0.00</span></div>
<button class="checkout-btn" onclick="openShippingInvoice()">Proceed to Invoice</button>
<p style="font-size:0.65rem;color:#888;text-align:center;margin-top:8px;">
<i class="fas fa-shield-alt" style="margin-right:4px;"></i>
Secured by Stripe. All major cards, Apple Pay, and Google Pay accepted.
</p>
</div>
</div>

<div class="modal-overlay" id="shippingInvoiceModal" onclick="closeShippingInvoice(event)">
<div class="modal-content" style="max-width:500px;" onclick="event.stopPropagation()">
<button class="modal-close" onclick="closeShippingInvoice()"><i class="fas fa-times"></i></button>
<div style="padding:40px;">
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
<h2 style="font-family:'Playfair Display',serif;font-size:1.8rem;">Shipping Invoice</h2>
<button onclick="toggleCurrency()" class="currency-toggle" id="invoiceCurrencyBtn" style="color:#0a0a0a;border-color:#0a0a0a;">NGN</button>
</div>
<div style="background:#f5f5f5;padding:20px;margin-bottom:24px;">
<h4 style="font-size:0.7rem;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:16px;">Order Summary</h4>
<div id="invoiceSummary"></div>
<div style="border-top:1px solid #ddd;margin-top:16px;padding-top:16px;">
<div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:0.85rem;"><span>Subtotal</span><span id="invoiceSubtotal">₦0.00</span></div>
<div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:0.85rem;color:#888;"><span><i class="fas fa-truck" style="margin-right:6px;"></i>Shipping</span><span id="invoiceShipping">₦0.00</span></div>
<div style="display:flex;justify-content:space-between;font-weight:500;font-size:1rem;border-top:1px solid #ddd;margin-top:8px;padding-top:12px;"><span>Total</span><span id="invoiceTotal">₦0.00</span></div>
</div>
</div>
<div style="margin-bottom:20px;">
<label style="font-size:0.7rem;letter-spacing:0.1em;text-transform:uppercase;color:#888;margin-bottom:8px;display:block;">Shipping Destination</label>
<select id="invoiceCountry" onchange="updateInvoiceShipping()" style="width:100%;padding:14px 16px;border:1px solid #e5e5e5;font-size:0.85rem;font-family:'Inter',sans-serif;outline:none;">
<option value="nigeria">Nigeria</option>
<option value="uk">United Kingdom</option>
</select>
<p style="font-size:0.7rem;color:#888;margin-top:8px;"><i class="fas fa-info-circle" style="margin-right:4px;"></i>Shipping costs are calculated based on your destination.</p>
</div>
<button class="checkout-btn" onclick="proceedToPayment()" id="proceedToPaymentBtn">Proceed to Payment</button>
<button onclick="closeShippingInvoice()" style="width:100%;padding:14px;background:none;color:#888;border:1px solid #e5e5e5;font-size:0.7rem;letter-spacing:0.15em;text-transform:uppercase;cursor:pointer;margin-top:10px;transition:all 0.3s ease;">Back to Cart</button>
</div>
</div>
</div>

<div class="modal-overlay" id="paymentModal" onclick="closePayment(event)">
<div class="modal-content" style="max-width:600px;" onclick="event.stopPropagation()">
<button class="modal-close" onclick="closePayment()"><i class="fas fa-times"></i></button>
<div style="padding:40px;">
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:24px;">
<h2 style="font-family:'Playfair Display',serif;font-size:1.8rem;">Payment Details</h2>
<button onclick="toggleCurrency()" class="currency-toggle" id="paymentCurrencyBtn" style="color:#0a0a0a;border-color:#0a0a0a;">NGN</button>
</div>
<div style="background:#f5f5f5;padding:20px;margin-bottom:24px;">
<h4 style="font-size:0.7rem;letter-spacing:0.15em;text-transform:uppercase;margin-bottom:12px;">Final Total</h4>
<div id="paymentSummary"></div>
<div style="border-top:1px solid #ddd;margin-top:12px;padding-top:12px;">
<div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:0.85rem;"><span>Subtotal</span><span id="paymentSubtotal">₦0.00</span></div>
<div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:0.85rem;color:#888;"><span><i class="fas fa-truck" style="margin-right:6px;"></i>Shipping</span><span id="paymentShipping">₦0.00</span></div>
<div style="display:flex;justify-content:space-between;font-weight:500;border-top:1px solid #ddd;margin-top:8px;padding-top:12px;"><span>Amount to Pay</span><span id="paymentTotalAmount">0.00</span></div>
</div>
</div>
<form onsubmit="placeOrder(event)" class="checkout-form">
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
<div><label>First Name</label><input type="text" id="coFirstName" required></div>
<div><label>Last Name</label><input type="text" id="coLastName" required></div>
</div>
<div><label>Email</label><input type="email" id="coEmail" required></div>
<div><label>Phone</label><input type="tel" id="coPhone" required></div>
<div><label>Address</label><textarea id="coAddress" rows="3" required></textarea></div>
<div><label>City</label><input type="text" id="coCity" required></div>
<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
<div>
<label>Country</label>
<select id="coCountry" onchange="setCurrencyByCountry(this.value); updatePaymentSummary();">
<option value="nigeria">Nigeria</option>
<option value="uk">United Kingdom</option>
</select>
</div>
<div><label>Postal Code</label><input type="text" id="coPostal" required></div>
</div>
<div style="margin:20px 0;">
<label>Payment Method</label>
<div style="display:grid;grid-template-columns:1fr;gap:12px;margin-top:8px;">
<div class="payment-option selected" onclick="selectPayment('stripe', this)" id="payStripe" style="justify-content:center; gap: 12px;">
<svg width="40" height="25" viewBox="0 0 60 25" xmlns="http://www.w3.org/2000/svg">
<path fill="#635BFF" d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.06 5.5c1.4 0 2.3.6 2.88 1.05l-.24 3.58a4.5 4.5 0 0 0-2.64-.83c-2.22 0-3.36 1.42-3.36 4.28v6.7h-4.1V5.86h3.98v1.5c.72-1.11 1.76-1.86 3.48-1.86zM28.9 5.86c1.4 0 2.3.6 2.88 1.05l-.24 3.58a4.5 4.5 0 0 0-2.64-.83c-2.22 0-3.36 1.42-3.36 4.28v6.7h-4.1V5.86h3.98v1.5c.72-1.11 1.76-1.86 3.48-1.86zM15.44 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM0 14.28h4.1V5.86H0v8.42z"/>
</svg>
<span style="font-size:0.8rem; font-weight: 500;">Stripe Checkout</span>
</div>
</div>
<div style="display:flex;align-items:center;justify-content:center;gap:16px;margin-top:12px;">
<span style="font-size:0.65rem;color:#888;letter-spacing:0.05em;">Also accepts:</span>
<span style="display:inline-flex;align-items:center;gap:3px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:15px;font-weight:500;color:#000;border:1.5px solid #000;border-radius:6px;padding:4px 10px;background:#fff;">
<i class="fab fa-apple" style="font-size:18px;"></i><span>Pay</span>
</span>
</div>
<p style="font-size:0.7rem;color:#888;margin-top:8px;text-align:center;">
<i class="fas fa-info-circle" style="margin-right:4px;"></i>
All payments are securely processed through Stripe. Supports all major cards, Apple Pay, Google Pay, and local payment methods.
</p>
</div>
<button type="submit" class="checkout-btn" style="margin-top:16px;" id="submitOrderBtn">Proceed to Checkout</button>
<button type="button" onclick="backToInvoice()" style="width:100%;padding:14px;background:none;color:#888;border:1px solid #e5e5e5;font-size:0.7rem;letter-spacing:0.15em;text-transform:uppercase;cursor:pointer;margin-top:10px;transition:all 0.3s ease;">Back to Invoice</button>
</form>
</div>
</div>
</div>

<script>
const STRIPE_PUBLIC_KEY = 'pk_live_51UIkNGCFKrLmTsm1ReQRdelWGyckF0MskvUd4qbylqqw9igzw6yNsfsG0VfRm9Dff4hbTMvwe2dv8TwFQZfo9sbJ00f09qM9OW';
const API_BASE_URL = 'https://bx-club-store.vercel.app';
const stripe = Stripe(STRIPE_PUBLIC_KEY);

const countryCurrencyMap = { 'NG': 'NGN', 'GB': 'GBP', 'US': 'USD', 'EUR': 'EUR' };
const currencySymbols = { 'NGN': '₦', 'GBP': '£', 'USD': '$', 'EUR': '€' };
const FALLBACK_CURRENCY = 'USD';

const products = [
  { id: 1, name: "BX CLUB Candle — Summer in London", shortName: "Candle — Summer in London", collection: "summer", type: "candle", priceNGN: 65000, priceGBP: 35, image: "https://res.cloudinary.com/dzosy1sic/image/upload/v1781517668/05a944f8-5de4-4e7f-bc2c-2d58086e4c71_iwpcme.png", description: "A fruity gourmand fragrance inspired by summer in London.", notes: ["Black Cherry", "Raspberry", "Blackcurrant", "Vanilla", "Tonka Bean", "Musk", "Sandalwood"] },
  { id: 2, name: "BX CLUB Candle — Midnight in Lagos", shortName: "Candle — Midnight in Lagos", collection: "midnight", type: "candle", priceNGN: 65000, priceGBP: 35, image: "https://res.cloudinary.com/dzosy1sic/image/upload/v1781571548/bcaaea51-cf78-4962-9929-afb4665ea903_mwftya.png", description: "A woody leather candle inspired by Lagos nights.", notes: ["Plum", "Peach", "Violet", "Leather", "Sandalwood", "Vanilla", "Musk"] },
  { id: 3, name: "BX CLUB Diffuser — Summer in London", shortName: "Diffuser — Summer in London", collection: "summer", type: "diffuser", priceNGN: 65000, priceGBP: 35, image: "https://res.cloudinary.com/dzosy1sic/image/upload/v1781519410/e64c5794-56a4-4a2d-a66a-3a3e57d8d34a_lltpuq.png", description: "A fruity gourmand diffuser inspired by summer in London.", notes: ["Black Cherry", "Raspberry", "Blackcurrant", "Vanilla", "Tonka Bean", "Musk", "Sandalwood"] },
  { id: 4, name: "BX CLUB Diffuser — Midnight in Lagos", shortName: "Diffuser — Midnight in Lagos", collection: "midnight", type: "diffuser", priceNGN: 65000, priceGBP: 35, image: "https://res.cloudinary.com/dzosy1sic/image/upload/v1781519609/6dcc16c1-d477-4b03-9868-792ff0fa46c4_hmqnab.png", description: "A woody leather diffuser inspired by Lagos nights.", notes: ["Plum", "Peach", "Violet", "Leather", "Sandalwood", "Vanilla", "Musk"] }
];
const singleProducts = [
  { id: 101, name: "BX CLUB — Summer in London Collection", shortName: "Summer in London Set", collection: "summer", type: "set", priceNGN: 156000, priceGBP: 85, image: "https://res.cloudinary.com/dzosy1sic/image/upload/v1784329241/ChatGPT_Image_Jul_17_2026_04_00_18_PM_ajutoz.png", description: "The complete Summer in London collection.", notes: ["Candle", "Diffuser", "Instruments"] },
  { id: 102, name: "BX CLUB — Midnight in Lagos Collection", shortName: "Midnight in Lagos Set", collection: "midnight", type: "set", priceNGN: 156000, priceGBP: 85, image: "https://res.cloudinary.com/dzosy1sic/image/upload/v1784328986/ChatGPT_Image_Jul_17_2026_03_42_18_PM_gggxg8.png", description: "The complete Midnight in Lagos collection.", notes: ["Candle", "Diffuser", "Instruments"] },
  { id: 105, name: "BX CLUB Instruments of Flame", shortName: "Instruments of Flame", collection: "accessories", type: "accessories", priceNGN: 37000, priceGBP: 20, image: "https://res.cloudinary.com/dzosy1sic/image/upload/v1781519239/53ccd5ce-71e8-4b6f-ba12-646bfb8949f4_em3liv.png", description: "Essential tools for the discerning luminary owner.", notes: ["Wick Trimmer", "Wick Dipper", "Candle Snuffer", "Tray"] }
];
const faqs = [
  { q: "How long do your candles burn?", a: "Our candles burn for 55-80 hours. For optimal burn time, trim the wick to 6mm before each use." },
  { q: "Do you ship internationally?", a: "Yes, we ship worldwide. Shipping to Nigeria and the UK is calculated at checkout." },
  { q: "What payment methods do you accept?", a: "All payments are securely processed through Stripe, which supports all major credit/debit cards, Apple Pay, and Google Pay." },
  { q: "How do I care for my candle?", a: "Trim the wick to 6mm before each burn. Burn for no longer than 4 hours at a time." },
  { q: "Can I return or exchange?", a: "Due to the nature of our products, we do not accept returns on used items. Unopened products may be returned within 14 days." },
  { q: "Are your products handmade?", a: "Yes, every BX CLUB candle and diffuser is hand-poured with intention in small batches." }
];

let cart = JSON.parse(localStorage.getItem('bxclub_cart')) || [];
let currentCurrency = localStorage.getItem('bxclub_currency') || 'NGN';
let selectedPayment = 'stripe';
let currentQVProduct = null;
let qvQty = 1;
let exchangeRates = {};
let detectedCountry = null;
let autoDetectedCurrency = null;
let isCurrencyManuallyChanged = localStorage.getItem('bxclub_manual_currency') === 'true';
const SHIPPING_NIGERIA_NGN = 5000;
const SHIPPING_UK_GBP = 3.99;

function getProductPrice(product) {
  if (currentCurrency === 'NGN') return { price: product.priceNGN, symbol: '₦' };
  if (currentCurrency === 'GBP') return { price: product.priceGBP, symbol: '£' };
  const rate = exchangeRates[currentCurrency] || 1800;
  return { price: Math.round(product.priceGBP * rate), symbol: currencySymbols[currentCurrency] || currentCurrency };
}

function getCartItemPrice(item) {
  if (currentCurrency === 'NGN') return { price: item.priceNGN, symbol: '₦' };
  if (currentCurrency === 'GBP') return { price: item.priceGBP, symbol: '£' };
  const rate = exchangeRates[currentCurrency] || 1800;
  return { price: Math.round(item.priceGBP * rate), symbol: currencySymbols[currentCurrency] || currentCurrency };
}

function getCartSubtotal() {
  return cart.reduce((sum, item) => sum + (getCartItemPrice(item).price * item.quantity), 0);
}

function getShippingCost(country) {
  if (country === 'uk') return { price: SHIPPING_UK_GBP, symbol: '£' };
  return { price: SHIPPING_NIGERIA_NGN, symbol: '₦' };
}

function formatPrice(price) {
  return Number(price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function renderProductCard(product) {
  const info = getProductPrice(product);
  return '<div class="product-card">' +
    '<div class="product-img-wrap" onclick="openQuickView(' + product.id + ')">' +
    '<img src="' + product.image + '" alt="' + product.shortName + '" loading="lazy">' +
    '<button class="quick-view" onclick="event.stopPropagation(); openQuickView(' + product.id + ')">Quick View</button>' +
    '</div>' +
    '<div onclick="openQuickView(' + product.id + ')" style="cursor:pointer;">' +
    '<h3 class="product-name">' + product.shortName + '</h3>' +
    '<p class="product-price"><span>' + info.symbol + formatPrice(info.price) + '</span></p>' +
    '</div>' +
    '<button onclick="addToCart(' + product.id + ', 1)" class="add-btn" style="width:100%;margin-top:10px;padding:10px;background:#0a0a0a;color:#fff;border:none;font-size:0.65rem;letter-spacing:0.15em;text-transform:uppercase;cursor:pointer;opacity:0;transition:opacity 0.3s ease;">Add to Cart</button>' +
    '</div>';
}

function renderProducts() {
  const allProducts = [...products, ...singleProducts];
  document.getElementById('shopGrid').innerHTML = allProducts.map(renderProductCard).join('');
  const bestSellers = [products[0], products[1], singleProducts[0], singleProducts[1]];
  document.getElementById('bestSellersGrid').innerHTML = bestSellers.map(renderProductCard).join('');
}

function filterByCollection(collection) {
  const allProducts = [...products, ...singleProducts];
  const filtered = allProducts.filter(p => p.collection === collection);
  document.getElementById('shopGrid').innerHTML = filtered.map(renderProductCard).join('');
  document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
}

function openQuickView(productId) {
  const product = [...products, ...singleProducts].find(p => p.id === productId);
  if(!product) return;
  currentQVProduct = product;
  qvQty = 1;
  const info = getProductPrice(product);
  document.getElementById('qvImage').src = product.image;
  document.getElementById('qvName').textContent = product.name;
  document.getElementById('qvPrice').innerHTML = '<span>' + info.symbol + formatPrice(info.price) + '</span>';
  document.getElementById('qvDesc').textContent = product.description;
  document.getElementById('qvNotes').textContent = 'Notes: ' + product.notes.join(', ');
  document.getElementById('qvQty').textContent = qvQty;
  document.getElementById('quickViewModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeQuickView(e) {
  if(e && e.target !== e.currentTarget && e.type === 'click') return;
  document.getElementById('quickViewModal').classList.remove('active');
  document.body.style.overflow = '';
}

function updateQVQty(delta) {
  qvQty = Math.max(1, qvQty + delta);
  document.getElementById('qvQty').textContent = qvQty;
}

function addFromQuickView() {
  if(!currentQVProduct) return;
  addToCart(currentQVProduct.id, qvQty);
  closeQuickView();
}

function addToCart(productId, qty) {
  const product = [...products, ...singleProducts].find(p => p.id === productId);
  if(!product) return;
  const existing = cart.find(item => item.id === productId);
  if(existing) {
    existing.quantity += qty;
  } else {
    cart.push({
      id: product.id, name: product.name, shortName: product.shortName,
      image: product.image, priceNGN: product.priceNGN, priceGBP: product.priceGBP, quantity: qty
    });
  }
  saveCart();
  updateCartUI();
  showToast(product.shortName + ' added to cart');
}

function removeFromCart(productId) {
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartUI();
}

function updateCartQty(productId, delta) {
  const item = cart.find(i => i.id === productId);
  if(item) {
    item.quantity += delta;
    if(item.quantity <= 0) removeFromCart(productId);
    else { saveCart(); updateCartUI(); }
  }
}

function saveCart() {
  localStorage.setItem('bxclub_cart', JSON.stringify(cart));
}

function updateCartUI() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  ['cartBadge', 'cartBadgeMobile'].forEach(id => {
    const badge = document.getElementById(id);
    if(badge) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  });
  const body = document.getElementById('cartBody');
  const footer = document.getElementById('cartFooter');
  if(cart.length === 0) {
    body.innerHTML = '<div style="text-align:center;padding:64px 0;"><i class="fas fa-shopping-bag" style="font-size:2.5rem;color:#ddd;margin-bottom:16px;"></i><p style="color:#888;font-size:0.9rem;">Your cart is empty</p><a href="#shop" onclick="toggleCart()" style="display:inline-block;margin-top:16px;font-size:0.75rem;letter-spacing:0.15em;text-transform:uppercase;border-bottom:1px solid #0a0a0a;padding-bottom:2px;color:#0a0a0a;text-decoration:none;">Continue Shopping</a></div>';
    footer.style.display = 'none';
    return;
  }
  footer.style.display = 'block';
  body.innerHTML = cart.map(item => {
    const info = getCartItemPrice(item);
    return '<div class="cart-item"><img src="' + item.image + '" alt="' + item.shortName + '"><div class="cart-item-info"><h4>' + item.name + '</h4><p class="price"><span>' + info.symbol + formatPrice(info.price) + '</span></p><div class="cart-qty"><button onclick="updateCartQty(' + item.id + ', -1)">−</button><span>' + item.quantity + '</span><button onclick="updateCartQty(' + item.id + ', 1)">+</button></div><button class="remove-item" onclick="removeFromCart(' + item.id + ')">Remove</button></div></div>';
  }).join('');
  const symbol = currencySymbols[currentCurrency] || currentCurrency;
  const subtotal = getCartSubtotal();
  document.getElementById('cartSubtotal').textContent = symbol + formatPrice(subtotal);
  document.getElementById('cartTotal').textContent = symbol + formatPrice(subtotal);
}

function toggleCart() {
  document.getElementById('cartDrawer').classList.toggle('open');
  document.getElementById('cartOverlay').style.display = document.getElementById('cartDrawer').classList.contains('open') ? 'block' : 'none';
  document.body.style.overflow = document.getElementById('cartDrawer').classList.contains('open') ? 'hidden' : '';
}

function openShippingInvoice() {
  if(cart.length === 0) { showToast('Your cart is empty'); return; }
  if(document.getElementById('cartDrawer').classList.contains('open')) toggleCart();
  const countrySelect = document.getElementById('invoiceCountry');
  if(detectedCountry === 'GB') countrySelect.value = 'uk';
  else if(detectedCountry === 'NG') countrySelect.value = 'nigeria';
  
  document.getElementById('invoiceSummary').innerHTML = cart.map(item => {
    const info = getCartItemPrice(item);
    return '<div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:0.85rem;"><span>' + item.shortName + ' × ' + item.quantity + '</span><span>' + info.symbol + formatPrice(info.price * item.quantity) + '</span></div>';
  }).join('');
  
  const symbol = currencySymbols[currentCurrency] || currentCurrency;
  document.getElementById('invoiceSubtotal').textContent = symbol + formatPrice(getCartSubtotal());
  updateInvoiceShipping();
  document.getElementById('shippingInvoiceModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeShippingInvoice(e) {
  if(e && e.target !== e.currentTarget && e.type === 'click') return;
  document.getElementById('shippingInvoiceModal').classList.remove('active');
  document.body.style.overflow = '';
}

function updateInvoiceShipping() {
  const country = document.getElementById('invoiceCountry').value;
  const ship = getShippingCost(country);
  const symbol = currencySymbols[currentCurrency] || currentCurrency;
  document.getElementById('invoiceShipping').textContent = ship.symbol + formatPrice(ship.price);
  document.getElementById('invoiceTotal').textContent = symbol + formatPrice(getCartSubtotal() + ship.price);
}

function proceedToPayment() {
  closeShippingInvoice();
  document.getElementById('coCountry').value = document.getElementById('invoiceCountry').value;
  updatePaymentSummary();
  document.getElementById('paymentModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePayment(e) {
  if(e && e.target !== e.currentTarget && e.type === 'click') return;
  document.getElementById('paymentModal').classList.remove('active');
  document.body.style.overflow = '';
}

function backToInvoice() {
  closePayment();
  document.getElementById('shippingInvoiceModal').classList.add('active');
  document.body.style.overflow = 'hidden';
  updateInvoiceShipping();
}

function setCurrencyByCountry(country) {
  const map = { 'nigeria': 'NGN', 'uk': 'GBP' };
  const cur = map[country];
  if(!cur || cur === currentCurrency) return;
  currentCurrency = cur;
  isCurrencyManuallyChanged = true;
  localStorage.setItem('bxclub_manual_currency', 'true');
  localStorage.setItem('bxclub_currency', currentCurrency);
  updateCurrencyButtons();
  renderProducts();
  updateCartUI();
}

function updatePaymentSummary() {
  if(cart.length === 0) return;
  const country = document.getElementById('coCountry').value;
  const symbol = currencySymbols[currentCurrency] || currentCurrency;
  document.getElementById('paymentSummary').innerHTML = cart.map(item => {
    const info = getCartItemPrice(item);
    return '<div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:0.8rem;"><span>' + item.shortName + ' × ' + item.quantity + '</span><span>' + info.symbol + formatPrice(info.price * item.quantity) + '</span></div>';
  }).join('');
  const subtotal = getCartSubtotal();
  const ship = getShippingCost(country);
  document.getElementById('paymentSubtotal').textContent = symbol + formatPrice(subtotal);
  document.getElementById('paymentShipping').textContent = ship.symbol + formatPrice(ship.price);
  document.getElementById('paymentTotalAmount').textContent = symbol + formatPrice(subtotal + ship.price);
}

function selectPayment(method, el) {
  selectedPayment = method;
  document.querySelectorAll('.payment-option').forEach(p => p.classList.remove('selected'));
  el.classList.add('selected');
}

async function placeOrder(e) {
  e.preventDefault();
  if(cart.length === 0) { showToast('Your cart is empty'); return; }

  const customer = {
    firstName: document.getElementById('coFirstName').value.trim(),
    lastName: document.getElementById('coLastName').value.trim(),
    email: document.getElementById('coEmail').value.trim(),
    phone: document.getElementById('coPhone').value.trim(),
    address: document.getElementById('coAddress').value.trim(),
    city: document.getElementById('coCity').value.trim(),
    country: document.getElementById('coCountry').value,
    postal: document.getElementById('coPostal').value.trim()
  };

  if(!customer.firstName || !customer.lastName || !customer.email || !customer.phone || !customer.address || !customer.city || !customer.postal) {
    showToast('Please fill in all fields'); return;
  }

  const btn = document.getElementById('submitOrderBtn');
  const originalBtnText = btn.textContent;
  btn.textContent = 'Processing...';
  btn.disabled = true;

  try {
    const response = await fetch(API_BASE_URL + '/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: cart,
        customer: customer,
        currency: currentCurrency.toLowerCase(),
        shippingCost: getShippingCost(customer.country).price
      })
    });

    const session = await response.json();
    if (session.error) throw new Error(session.error);
    if (session.url) {
      window.location.href = session.url;
    } else {
      throw new Error('Failed to create checkout session');
    }
  } catch (error) {
    console.error('Checkout error:', error);
    showToast('Failed to start checkout. Please try again.');
    btn.textContent = originalBtnText;
    btn.disabled = false;
  }
}

function checkSuccessPage() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('success') === 'true' && params.get('session_id')) {
    document.getElementById('hero').style.display = 'none';
    document.getElementById('shop').style.display = 'none';
    document.getElementById('mixmatch').style.display = 'none';
    document.getElementById('collections').style.display = 'none';
    const about = document.getElementById('about'); if (about) about.style.display = 'none';
    const faqs = document.getElementById('faqs'); if (faqs) faqs.style.display = 'none';
    const contact = document.getElementById('contact'); if (contact) contact.style.display = 'none';
    const footer = document.querySelector('.site-footer'); if (footer) footer.style.display = 'none';
    document.getElementById('mainNav').style.display = 'none';
    document.getElementById('successSection').classList.add('active');
    renderSuccessOrder(params.get('session_id'));
    return true;
  }
  return false;
}

function renderSuccessOrder(sessionId) {
  const orderDetailsEl = document.getElementById('successOrderDetails');
  const shippingBox = document.getElementById('successShippingBox');
  
  if (!sessionId) {
    orderDetailsEl.innerHTML = '<p style="color:#888;font-size:0.85rem;">No order reference found.</p>';
    return;
  }

  orderDetailsEl.innerHTML = 
    '<div class="order-row"><span>Session ID</span><span style="font-size:0.75rem;">' + sessionId + '</span></div>' +
    '<div class="order-row"><span>Status</span><span style="color:#4ade80;"><i class="fas fa-check-circle" style="margin-right:4px;"></i>Paid</span></div>' +
    '<p style="color:#888;font-size:0.85rem;margin-top:16px;line-height:1.6;">' +
    'Thank you for your purchase! Your order has been successfully processed. ' +
    'A confirmation email with your full receipt and tracking details has been sent to your inbox.' +
    '</p>';
  
  shippingBox.style.display = 'none';
}

function renderFAQs() {
  document.getElementById('faqList').innerHTML = faqs.map((faq, i) => {
    return '<div class="faq-item" id="faq-' + i + '"><button class="faq-question" onclick="toggleFAQ(' + i + ')">' + faq.q + '<i class="fas fa-chevron-down" style="font-size:0.7rem;color:#888;"></i></button><div class="faq-answer"><p>' + faq.a + '</p></div></div>';
  }).join('');
}

function toggleFAQ(index) {
  document.getElementById('faq-' + index).classList.toggle('open');
}

function handleContact(e) {
  e.preventDefault();
  showToast('Message sent! We will respond shortly.');
  e.target.reset();
}

function handleNewsletter(e) {
  e.preventDefault();
  showToast('Subscribed! Welcome to the club.');
  e.target.reset();
}

function toggleMobileMenu() {
  document.getElementById('mobileNav').classList.toggle('open');
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

let lastScrollY = 0;
window.addEventListener('scroll', () => {
  const nav = document.getElementById('mainNav');
  const currentScrollY = window.scrollY;
  if (currentScrollY < 100) {
    nav.classList.remove('hidden');
    nav.classList.remove('scrolled');
  } else if (currentScrollY > lastScrollY) {
    nav.classList.add('hidden');
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('hidden');
    nav.classList.add('scrolled');
  }
  lastScrollY = currentScrollY;
});

function updateCurrencyButtons() {
  const btns = ['currencyBtn', 'currencyBtnMobile', 'cartCurrencyBtn', 'invoiceCurrencyBtn', 'paymentCurrencyBtn'];
  btns.forEach(id => {
    const el = document.getElementById(id);
    if(el) el.textContent = currentCurrency;
  });
}

function toggleCurrency() {
  isCurrencyManuallyChanged = true;
  localStorage.setItem('bxclub_manual_currency', 'true');
  const available = ['NGN', 'GBP'];
  const currentIndex = available.indexOf(currentCurrency);
  currentCurrency = available[(currentIndex + 1) % available.length];
  localStorage.setItem('bxclub_currency', currentCurrency);
  updateCurrencyButtons();
  renderProducts();
  updateCartUI();
  showToast('Currency switched to ' + currentCurrency);
}

async function detectCurrencyFromIP() {
  // Simplified for brevity, defaults to NGN if detection fails
  currentCurrency = 'NGN';
  updateCurrencyButtons();
  renderProducts();
  updateCartUI();
}

let mmSelected1 = null;
let mmSelected2 = null;
const MM_DISCOUNT_PERCENT = 10;
const mmEligibleProducts = products.filter(p => p.type === 'candle' || p.type === 'diffuser');

function renderMixMatchGrid1() {
  const grid = document.getElementById('mmGrid1');
  if (!grid) return;
  grid.innerHTML = mmEligibleProducts.map(p => {
    const info = getProductPrice(p);
    const isSelected = mmSelected1 && mmSelected1.id === p.id;
    return '<div class="product-card" style="' + (isSelected ? 'outline:2px solid #0a0a0a; outline-offset:4px;' : '') + '" onclick="selectMM1(' + p.id + ')">' +
      '<div class="product-img-wrap" style="background:#f5f5f5;"><img src="' + p.image + '" alt="' + p.shortName + '" loading="lazy">' +
      (isSelected ? '<div style="position:absolute;inset:0;background:rgba(0,0,0,0.05);display:flex;align-items:center;justify-content:center;"><span style="background:#0a0a0a;color:#fff;padding:8px 16px;font-size:0.7rem;letter-spacing:0.15em;text-transform:uppercase;font-weight:500;">Selected</span></div>' : '') +
      '</div><div style="cursor:pointer; padding-top:12px;"><h3 class="product-name" style="color:#0a0a0a;">' + p.shortName + '</h3>' +
      '<p class="product-price" style="color:#0a0a0a;"><span>' + info.symbol + formatPrice(info.price) + '</span></p></div></div>';
  }).join('');
}

function renderMixMatchGrid2() {
  const grid = document.getElementById('mmGrid2');
  if (!grid) return;
  const available = mmEligibleProducts.filter(p => !mmSelected1 || p.id !== mmSelected1.id);
  grid.innerHTML = available.map(p => {
    const info = getProductPrice(p);
    const isSelected = mmSelected2 && mmSelected2.id === p.id;
    return '<div class="product-card" style="' + (isSelected ? 'outline:2px solid #0a0a0a; outline-offset:4px;' : '') + '" onclick="selectMM2(' + p.id + ')">' +
      '<div class="product-img-wrap" style="background:#f5f5f5;"><img src="' + p.image + '" alt="' + p.shortName + '" loading="lazy">' +
      (isSelected ? '<div style="position:absolute;inset:0;background:rgba(0,0,0,0.05);display:flex;align-items:center;justify-content:center;"><span style="background:#0a0a0a;color:#fff;padding:8px 16px;font-size:0.7rem;letter-spacing:0.15em;text-transform:uppercase;font-weight:500;">Selected</span></div>' : '') +
      '</div><div style="cursor:pointer; padding-top:12px;"><h3 class="product-name" style="color:#0a0a0a;">' + p.shortName + '</h3>' +
      '<p class="product-price" style="color:#0a0a0a;"><span>' + info.symbol + formatPrice(info.price) + '</span></p></div></div>';
  }).join('');
}

function selectMM1(productId) {
  mmSelected1 = mmEligibleProducts.find(p => p.id === productId);
  mmSelected2 = null;
  renderMixMatchGrid1();
  document.getElementById('mmStep2').style.display = 'block';
  document.getElementById('mmStep3').style.display = 'none';
  setTimeout(() => document.getElementById('mmStep2').scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  renderMixMatchGrid2();
}

function selectMM2(productId) {
  mmSelected2 = mmEligibleProducts.find(p => p.id === productId);
  renderMixMatchGrid2();
  showBundleSummary();
}

function showBundleSummary() {
  if (!mmSelected1 || !mmSelected2) return;
  const info1 = getProductPrice(mmSelected1);
  const info2 = getProductPrice(mmSelected2);
  const symbol = info1.symbol;
  const originalTotal = info1.price + info2.price;
  const discount = Math.round(originalTotal * (MM_DISCOUNT_PERCENT / 100));
  const bundleTotal = originalTotal - discount;

  document.getElementById('mmBundleItems').innerHTML =
    '<div style="display:flex; gap:16px; margin-bottom:16px; padding-bottom:16px; border-bottom:1px solid #e5e5e5;">' +
    '<img src="' + mmSelected1.image + '" style="width:80px; height:100px; object-fit:cover; background:#fff;">' +
    '<div style="flex:1;"><h4 style="font-size:0.9rem; margin-bottom:4px; color:#0a0a0a;">' + mmSelected1.name + '</h4>' +
    '<p style="font-size:0.8rem; color:#888;">' + symbol + formatPrice(info1.price) + '</p></div></div>' +
    '<div style="display:flex; gap:16px;">' +
    '<img src="' + mmSelected2.image + '" style="width:80px; height:100px; object-fit:cover; background:#fff;">' +
    '<div style="flex:1;"><h4 style="font-size:0.9rem; margin-bottom:4px; color:#0a0a0a;">' + mmSelected2.name + '</h4>' +
    '<p style="font-size:0.8rem; color:#888;">' + symbol + formatPrice(info2.price) + '</p></div></div>';

  document.getElementById('mmOriginalTotal').textContent = symbol + formatPrice(originalTotal);
  document.getElementById('mmDiscountAmount').textContent = '-' + symbol + formatPrice(discount);
  document.getElementById('mmBundleTotal').textContent = symbol + formatPrice(bundleTotal);
  document.getElementById('mmStep3').style.display = 'block';
  setTimeout(() => document.getElementById('mmStep3').scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
}

function addBundleToCart() {
  if (!mmSelected1 || !mmSelected2) return;
  const info1 = getProductPrice(mmSelected1);
  const info2 = getProductPrice(mmSelected2);
  const originalTotal = info1.price + info2.price;
  const discount = Math.round(originalTotal * (MM_DISCOUNT_PERCENT / 100));
  const bundleTotal = originalTotal - discount;
  const symbol = info1.symbol;

  let priceNGN = currentCurrency === 'NGN' ? bundleTotal : Math.round(bundleTotal * 1800);
  let priceGBP = currentCurrency === 'GBP' ? bundleTotal : Math.round(bundleTotal / 1800 * 100) / 100;

  cart.push({
    id: 999000 + Date.now(), name: 'Mix & Match Bundle', shortName: 'Mix & Match Bundle',
    image: mmSelected1.image, priceNGN: priceNGN, priceGBP: priceGBP, quantity: 1,
    bundleItems: [{ name: mmSelected1.shortName, image: mmSelected1.image }, { name: mmSelected2.shortName, image: mmSelected2.image }],
    isBundle: true
  });
  saveCart();
  updateCartUI();
  showToast('Mix & Match bundle added! You saved ' + symbol + formatPrice(discount));
  resetMixMatch();
  setTimeout(() => toggleCart(), 500);
}

function resetMixMatch() {
  mmSelected1 = null; mmSelected2 = null;
  document.getElementById('mmStep2').style.display = 'none';
  document.getElementById('mmStep3').style.display = 'none';
  renderMixMatchGrid1();
}

let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.carousel-dot');
let carouselInterval;

function goToSlide(index) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = index;
  if(currentSlide >= slides.length) currentSlide = 0;
  if(currentSlide < 0) currentSlide = slides.length - 1;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}

function nextSlide() { goToSlide((currentSlide + 1) % slides.length); }
function startCarousel() { carouselInterval = setInterval(nextSlide, 5000); }

document.querySelector('.hero-carousel').addEventListener('mouseenter', () => clearInterval(carouselInterval));
document.querySelector('.hero-carousel').addEventListener('mouseleave', startCarousel);

document.addEventListener('DOMContentLoaded', () => {
  if (checkSuccessPage()) return;
  updateCurrencyButtons();
  renderProducts();
  renderFAQs();
  updateCartUI();
  startCarousel();
  renderMixMatchGrid1();
  detectCurrencyFromIP();
});

document.addEventListener('keydown', (e) => {
  if(e.key === 'Escape') {
    closeQuickView(); closeShippingInvoice(); closePayment();
    if(document.getElementById('cartDrawer').classList.contains('open')) toggleCart();
  }
});
</script>

<a href="https://wa.me/447538277711" target="_blank" class="whatsapp-float" aria-label="Chat on WhatsApp">
<i class="fab fa-whatsapp"></i>
</a>
<div class="whatsapp-tooltip">Chat with us on WhatsApp</div>

<div class="success-section" id="successSection">
<div>
<div style="text-align:center;margin-bottom:40px;">
<a href="/" onclick="window.location.search=''; return false;" style="display:inline-block;">
<img src="https://res.cloudinary.com/dzosy1sic/image/upload/v1781553647/bcde1dde-4501-4ec0-b649-cfbcfcdca496_biowj2.png" alt="BX CLUB" style="height:50px;width:auto;filter:brightness(0) invert(1);">
</a>
</div>
<div class="success-card">
<div class="success-icon"><i class="fas fa-check"></i></div>
<h1>Thank You</h1>
<p class="subtitle">Your order has been received and is being prepared.</p>
<div class="order-box">
<h3>Order Details</h3>
<div id="successOrderDetails"><p style="color:#888;font-size:0.85rem;">Loading order details...</p></div>
</div>
<div class="order-box" id="successShippingBox" style="display:none;">
<h3>Shipping To</h3>
<div id="successShippingDetails"></div>
</div>
<a href="/" class="btn-gold">Continue Shopping</a>
<a href="https://wa.me/447538277711" target="_blank" class="btn-outline">
<i class="fab fa-whatsapp" style="margin-right:6px;"></i>Need Help? Chat on WhatsApp
</a>
<div class="email-note">
<i class="fas fa-envelope"></i>
A confirmation email has been sent to your inbox. If you don't see it, please check your spam folder.
</div>
</div>
</div>
</div>
</body>
</html>
    `}} />
  )
}
