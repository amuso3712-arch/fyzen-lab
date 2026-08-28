# Fyzen Lab Telegram Admin

Fyzen Lab boshqaruvi uchun asosiy kanal — **[@fyzen_bot](https://t.me/fyzen_bot)**. Server bot amallarini faqat Telegram numeric ID `8548524660` uchun qabul qiladi. `admin.html` saqlanib qolgan va ikkilamchi web fallback sifatida ishlaydi.

## Boshlash

Botga `/start` yoki `/admin` yuboring. Bot inline menyuni ko‘rsatadi: buyurtmalar, yangi buyurtma, mahsulot qo‘shish, draft mahsulotlar va yangilash.

## Buyurtmalar

**Buyurtmalar** tugmasi so‘nggi buyurtmalarni ko‘rsatadi. Buyurtmani tanlaganingizda mijoz ma’lumotlari, mahsulotlar va hozirgi holat chiqadi. Holatni `new`, `processing`, `completed` yoki `cancelled` tugmalari orqali o‘zgartirish mumkin. Har bir o‘zgarish actor ID, amal, target va oldingi/keyingi qiymatlar bilan audit jadvaliga yoziladi.

**Buyurtma qo‘shish** wizardida mijoz ismi, telefon raqami, tashkilot va mahsulot nomi/miqdorini kiriting. Yakuniy tasdiqdan keyin buyurtma `order_requests` jadvalida `new` holatida saqlanadi.

## Mahsulot qo‘shish va nashr qilish

**Mahsulot qo‘shish** wizardida nom, brend, kategoriya, narx, tavsif va foto yuboriladi. Rasm JPG/PNG sifatida Telegramdan olinib, S3 storage’ga yuklanadi; 8 MB dan katta rasm rad etiladi. Mahsulot avval `draft` sifatida saqlanadi va public katalogda ko‘rinmaydi.

**Draft mahsulotlar** bo‘limida mahsulotni tahrirlash yoki tasdiqlash mumkin. Tahrirlash nom, brend, kategoriya, narx yoki tavsif bo‘yicha ishlaydi. `Tasdiqlash` bosilgach status `approved` bo‘ladi va mahsulot `/api/products/published` orqali public Products/Catalog sahifalariga sinxronlanadi.

## Bekor qilish va xavfsizlik

Har bir wizarddagi **Bekor qilish** tugmasi sessiyani `idle` holatiga qaytaradi. Webhook `X-Telegram-Bot-Api-Secret-Token` headerini tekshiradi, takroriy update ID’larini qayta ishlamaydi va admin bo‘lmagan foydalanuvchilardan kelgan xabarlarni e’tiborsiz qoldiradi.

## Texnik endpointlar

| Endpoint | Vazifasi |
|---|---|
| `POST /api/telegram/webhook` | Telegram update’larini qabul qiladi; secret bilan himoyalangan |
| `GET /api/products/published` | Tasdiqlangan bot mahsulotlarini public katalogga beradi |
| `GET /api/admin/orders` | OAuth orqali web fallback buyurtma ro‘yxati |
| `PATCH /api/admin/orders/:requestId/status` | Web fallback status o‘zgarishi |
