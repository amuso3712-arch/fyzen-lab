
## Hero revision — 2026-08-24

Homepage hero endi Vanta/Three.js 3D network qatlamisiz, bitta `/manus-storage/fyzen-lab-hero_62b36318.jpg` laboratoriya rasmi bilan ishlaydi. Desktop preview’da chap tomonda qoramtir gradient ustida oq sarlavha va CTA’lar, o‘ng tomonda laboratoriya uskunalari ko‘rinadi; 10+ years badge rasm ustida joylashgan.

Mobile preview’da ham bitta fon rasmi va vertikal gradient ishlaydi. Dastlabki mobil suratda to‘liq sahifa kengligi emas, preview overlay’ining oq qismi ko‘ringan; interaktiv browser navigatsiyasida hero va rasmli kompozitsiya to‘g‘ri yuklandi. Keyingi tekshiruvda mobil gorizontal overflow va CTA’lar alohida nazorat qilinadi.

DOM tekshiruvida hero computed style’i yangi storage URL va linear-gradient overlay’ni ko‘rsatdi. Desktop viewportda hero width `1265px`, document scrollWidth `1265px`, ya’ni horizontal overflow aniqlanmadi. Console’da yangi JavaScript xatolari yo‘q.

## About va Contact audit — 2026-08-24

About sahifasida asosiy sarlavha, kompaniya missiyasi, global hamkorlik, core values va clients bloklari mavjud. Keyingi yaxshilashlar: intro kompozitsiyasini homepage hero bilan vizual bog‘lash, matn ierarxiyasini kuchaytirish, mission/value kartalarini bir xil ritmga keltirish va mobil spacing’ni tekshirish.

Contact sahifasida dark-blue intro band, chap tomonda aloqa kartalari, o‘ng tomonda Send Message formasi mavjud. Formada Full Name, Email Address va Message maydonlari bor; phone, email, Telegram va Instagram ko‘rsatilgan. Sahifa ichida manzil Khorezm, footerda esa Tashkent deb ko‘rsatilgan — keyingi tahrirda foydalanuvchidan tasdiqlangan manzilni so‘rab, nomuvofiqlikni bartaraf etish kerak. Forma va mobil stacked layout alohida tekshiriladi.

## About va Contact refinement audit — 2026-08-24

Desktop preview’da About intro card, quote, quality block, core values va clients section vizual jihatdan yaxlitlandi. Contact sahifasida page header, contact cards va form card bir xil radius, shadow, cyan accent va navy hierarchy’ga keltirildi. Production build xatosiz o‘tdi.

Mobil preview’da About intro kompozitsiyasi stacked ko‘rinishda ishlaydi va Contact cardlar vertikal joylashadi. Preview’da sahifaning o‘ng tomonida oq bo‘shliq/overflow ko‘rinishi saqlanib qoldi; bu mavjud mobil shell yoki drawer o‘lchamlari bilan bog‘liq bo‘lishi mumkin va keyingi fix sifatida alohida tekshiriladi. Mobil headerda tagline ko‘rinmasligi avvalgi responsive optimizatsiyaning natijasi bo‘lishi mumkin.
