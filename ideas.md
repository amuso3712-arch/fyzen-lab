# Fyzen Lab — Tiklash bo‘yicha dizayn qaydlari

## Ground-truth yo‘nalish

Foydalanuvchi yuborgan `fyzen-lab.zip` arxivi ushbu tiklash ishining yagona vizual va funksional manbasi hisoblanadi. Sayt aslida ko‘p sahifali statik laboratoriya uskunalari katalogi bo‘lib, asosiy navigatsiya `index.html`, `catalog.html`, `products.html`, `product-details.html`, `brands.html`, `about.html`, `blog.html`, `contact.html`, `cart.html`, `wishlist.html` va `checkout.html` sahifalaridan tashkil topgan. Tiklashda mavjud HTML tarkibi, CSS qoidalari, tarjima lug‘ati, mahsulot ma’lumotlari, rasmlar, logotiplar, savat/istaklar ro‘yxati va chatbot xatti-harakatlari imkon qadar o‘z holicha saqlanadi.

## Tanlangan dizayn falsafasi

**Design Movement:** zamonaviy ilmiy-korporativ minimalizm — aniqlik, ishonchlilik va laboratoriya muhitining toza texnik estetikasiga tayangan yo‘nalish.

**Core Principles:**
1. Asl Fyzen Lab vizual tilini buzmasdan, mavjud ko‘k/navy ranglar, laboratoriya fotografiyasi va texnik ikonografiyani saqlash.
2. Katalogga yo‘naltirilgan navigatsiyani birinchi o‘ringa qo‘yish: mahsulot, toifa, brend va aloqa yo‘llari doimo ko‘rinadigan va qaytish imkoniga ega bo‘ladi.
3. Oq bo‘shliq, aniq kontrast va tartibli kartochkalar orqali ko‘p ma’lumotni oson skan qilinadigan qilish.
4. Interaktivlikni amaliy saqlash: til almashtirish, qidiruv, savat, wishlist, checkout va yordamchi chatbot kabi mavjud oqimlar tiklanadi; dekorativ effektlar funksiyani to‘smasligi kerak.

**Color Philosophy:** chuqur navy rang texnik ishonchlilikni, sovuq ko‘k aniqlik va raqamli interfeysni, oq va och kulrang yuzalar esa laboratoriya tozaligi hamda o‘qiluvchanlikni ifodalaydi. Accent ranglar faqat amallar, holatlar va muhim yo‘nalishlarni ajratish uchun ishlatiladi.

**Layout Paradigm:** ko‘p sahifali, nav + kontent + footer skeleti. Bosh sahifada laboratoriya kategoriyalariga olib boruvchi vizual bloklar, katalogda mahsulotlarni ko‘rish va filtrlash, detail sahifada media-ma’lumot-amal oqimi, checkoutda bosqichli forma ishlatiladi. Bu arxivdagi sahifa tuzilmasi uchun ground-truth hisoblanadi.

**Signature Elements:** Fyzen logotipi va kub belgisi; laboratoriya toifalari uchun tematik rasmlar; texnik ko‘k gradient/yorug‘lik aksentlari va yumshoq soyali mahsulot kartochkalari.

**Interaction Philosophy:** foydalanuvchi har bir muhim amalni ko‘rinarli javob bilan his qiladi: hoverda karta ko‘tariladi, tugma bosilganda qisqa feedback beradi, savat/wishlist soni yangilanadi, til o‘zgarganda sahifa matnlari almashadi, chatbot esa mahsulot yoki yetkazib berish bo‘yicha yo‘l ko‘rsatadi. Keyboard focus va mobil navigatsiya saqlanadi.

**Animation:** mavjud arxivdagi animatsiyalarni minimal va tezkor ko‘rinishda saqlash; hover va press effektlari 100–220ms atrofida; sahifa kirishlari faqat opacity/transform orqali; `prefers-reduced-motion` yoqilganda dekorativ motion o‘chiriladi.

**Typography System:** arxivda ishlatilgan fontlar va o‘lchamlar birinchi navbatda saqlanadi. Sarlavhalar uchun aniq, yarim qalin sans-serif; asosiy matn uchun yuqori o‘qiluvchan neytral sans-serif; raqamlar va mahsulot ko‘rsatkichlarida bir xil, zichligi yaxshi font ishlatiladi.

**Brand Essence:** laboratoriyalar, klinikalar, ishlab chiqarish va ta’lim muassasalari uchun ishonchli ilmiy uskunalar katalogi — toifalangan assortiment, texnik aniqlik va xizmatga yo‘naltirilgan aloqa bilan farqlanadi. Personality: aniq, ishonchli, zamonaviy.

**Brand Voice:** sarlavhalar qisqa va faktga asoslangan; CTA’lar aniq harakatni bildiradi; microcopy foydalanuvchini amaliy keyingi qadamga olib boradi. Misollar: “Laboratoriyangiz uchun aniq yechimni toping.” va “Mahsulotni ko‘ring — texnik tafsilotlarni solishtiring.”

**Wordmark & Logo:** mavjud arxivdagi Fyzen wordmark va kub belgisi asosiy manba sifatida ishlatiladi. Agar tiklash jarayonida ular yetishmasa, alohida geometrik kub/lens mark fallback sifatida ishlatiladi; yangi logotip matnni oddiy default shrift bilan almashtirmaydi.

**Signature Brand Color:** Fyzen Cobalt — chuqur ko‘k va yorqin ko‘k oralig‘idagi texnik accent; amaliy tugmalar, faol holatlar va brend detalini birlashtiradi.

## Tiklashdagi muhim cheklovlar

- Foydalanuvchi bergan arxivdagi server/backend kodlari frontend tiklash doirasidan tashqarida qoladi; mavjud frontend oqimlari buzilmasdan ko‘chiriladi.
- Arxivdagi barcha sahifalar va toifalar saqlanadi; faqat muhitga moslash uchun yo‘llar va asset manzillari o‘zgartirilishi mumkin.
- Mahsulot sharhlari yoki reytinglari uydirilmaydi.
- Katta rasmlar va media WebDev asset storage orqali ulanadi; vaqtinchalik lokal yo‘llar production kodida ishlatilmaydi.
