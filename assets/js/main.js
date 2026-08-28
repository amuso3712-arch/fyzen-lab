// ====================================================
// SERVER API HELPERS
// ====================================================
function getApiUrl(endpoint) {
    const isLocalDev = window.location.protocol === 'file:' ||
        ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port !== '3000');
    const baseUrl = isLocalDev ? 'http://localhost:3000' : '';
    return baseUrl + endpoint;
}
window.getApiUrl = getApiUrl;

async function postServerMessage(endpoint, payload) {
    try {
        const response = await fetch(getApiUrl(endpoint), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const result = await response.json().catch(() => ({}));
        return response.ok && result.success === true;
    } catch (error) {
        console.error('Server notification failed:', error);
        return false;
    }
}

async function sendTelegramNotification(order) {
    return postServerMessage('/api/order-notification', order);
}

async function sendContactMessage(data) {
    return postServerMessage('/api/contact', data);
}

// ====================================================
// DATA MANAGEMENT
// ====================================================
const DEFAULT_PRODUCTS = [
    {
        "id": 1,
        "name": "Mindray BC-5000",
        "name_uz": "Mindray BC-5000 Gematologik Analizator",
        "name_ru": "Mindray BC-5000 Ð“ÐµÐ¼Ð°Ñ‚Ð¾Ð»Ð¾Ð³Ð¸Ñ‡ÐµÑÐºÐ¸Ð¹ ÐÐ½Ð°Ð»Ð¸Ð·Ð°Ñ‚Ð¾Ñ€",
        "name_en": "Mindray BC-5000 Hematology Analyzer",
        "category": "medical",
        "brand": "Mindray",
        "img": "/assets/images/mindray_bc5000_3f60d97e.jpg",
        "price": "Request"
    },
    {
        "id": 2,
        "name": "Mindray BS-240",
        "name_uz": "Mindray BS-240 Bioximik Analizator",
        "name_ru": "Mindray BS-240 Ð‘Ð¸Ð¾Ñ…Ð¸Ð¼Ð¸Ñ‡ÐµÑÐºÐ¸Ð¹ ÐÐ½Ð°Ð»Ð¸Ð·Ð°Ñ‚Ð¾Ñ€",
        "name_en": "Mindray BS-240 Biochemistry Analyzer",
        "category": "medical",
        "brand": "Mindray",
        "img": "/assets/images/mindray_dc70_d9fd8a0e.jpg",
        "price": "Request"
    },
    {
        "id": 3,
        "name": "Nexcope NE910",
        "name_uz": "Nexcope NE910 Trinokuljar Mikroskop",
        "name_ru": "Nexcope NE910 Ð¢Ñ€Ð¸Ð½Ð¾ÐºÑƒÐ»ÑÑ€Ð½Ñ‹Ð¹ ÐœÐ¸ÐºÑ€Ð¾ÑÐºÐ¾Ð¿",
        "name_en": "Nexcope NE910 Trinocular Microscope",
        "category": "analytical",
        "brand": "Nexcope",
        "img": "/assets/images/nexcope_ne910_dad1b169.jpg",
        "price": "Request"
    },
    {
        "id": 4,
        "name": "Shimadzu GC-2030",
        "name_uz": "Shimadzu GC-2030 Gaz Xromatografi",
        "name_ru": "Shimadzu GC-2030 Ð“Ð°Ð·Ð¾Ð²Ñ‹Ð¹ Ð¥Ñ€Ð¾Ð¼Ð°Ñ‚Ð¾Ð³Ñ€Ð°Ñ„",
        "name_en": "Shimadzu GC-2030 Gas Chromatograph",
        "category": "chemistry",
        "brand": "Shimadzu",
        "img": "/assets/images/shimadzu_gc2030_eb0a7e59.jpg",
        "price": "Request"
    },
    {
        "id": 5,
        "name": "Olympus BX53",
        "name_uz": "Olympus BX53 Tadqiqot Mikroskobi",
        "name_ru": "Olympus BX53 Ð˜ÑÑÐ»ÐµÐ´Ð¾Ð²Ð°Ñ‚ÐµÐ»ÑŒÑÐºÐ¸Ð¹ ÐœÐ¸ÐºÑ€Ð¾ÑÐºÐ¾Ð¿",
        "name_en": "Olympus BX53 Research Microscope",
        "category": "analytical",
        "brand": "Olympus",
        "img": "/assets/images/olympus_bx53_eff0f61a.jpg",
        "price": "Request"
    },
    {
        "id": 6,
        "name": "Roche cobas e411",
        "name_uz": "Roche cobas e411 Immunologik Analizator",
        "name_ru": "Roche cobas e411 Ð˜Ð¼Ð¼ÑƒÐ½Ð¾Ð»Ð¾Ð³Ð¸Ñ‡ÐµÑÐºÐ¸Ð¹ ÐÐ½Ð°Ð»Ð¸Ð·Ð°Ñ‚Ð¾Ñ€",
        "name_en": "Roche cobas e411 Immunology Analyzer",
        "category": "medical",
        "brand": "Roche",
        "img": "/assets/images/siemens_somatom_f3144f82.jpg",
        "price": "Request"
    },
    {
        "id": 7,
        "name": "Anton Paar DMA 5000",
        "name_uz": "Anton Paar DMA 5000 Zichlik O'lchagich",
        "name_ru": "Anton Paar DMA 5000 Ð˜Ð·Ð¼ÐµÑ€Ð¸Ñ‚ÐµÐ»ÑŒ ÐŸÐ»Ð¾Ñ‚Ð½Ð¾ÑÑ‚Ð¸",
        "name_en": "Anton Paar DMA 5000 Density Meter",
        "category": "petroleum",
        "brand": "Anton Paar",
        "img": "/assets/images/anton_paar_dma_fc700bcb.jpg",
        "price": "Request"
    },
    {
        "id": 8,
        "name": "Binder KB 53",
        "name_uz": "Binder KB 53 Iqlim Kamerasi",
        "name_ru": "Binder KB 53 ÐšÐ»Ð¸Ð¼Ð°Ñ‚Ð¸Ñ‡ÐµÑÐºÐ°Ñ ÐšÐ°Ð¼ÐµÑ€Ð°",
        "name_en": "Binder KB 53 Climate Chamber",
        "category": "biology",
        "brand": "Binder",
        "img": "/assets/images/binder_kb53_0923396b.jpg",
        "price": "Request"
    },
    {
        "id": 16,
        "name": "Eppendorf Centrifuge 5810",
        "name_uz": "Eppendorf 5810 Sentrifuga",
        "name_ru": "Eppendorf 5810 Ð¦ÐµÐ½Ñ‚Ñ€Ð¸Ñ„ÑƒÐ³Ð°",
        "name_en": "Eppendorf 5810 Centrifuge",
        "category": "biology",
        "brand": "Eppendorf",
        "img": "/assets/images/agilent_1260_5fded2ca.jpg",
        "price": "Request"
    },
    {
        "id": 17,
        "name": "PCR Thermocycler Pro",
        "name_uz": "PCR Termosikler Pro",
        "name_ru": "PCR Ð¢ÐµÑ€Ð¼Ð¾Ñ†Ð¸ÐºÐ»ÐµÑ€ Pro",
        "name_en": "PCR Thermocycler Pro",
        "category": "biology",
        "brand": "Bio-Rad",
        "img": "/assets/images/kern_obn_1c32962d.jpg",
        "price": "Request"
    },
    {
        "id": 9,
        "name": "MATEST S205",
        "name_uz": "MATEST S205 Siqishga Sinov Mashinasi",
        "name_ru": "MATEST S205 ÐœÐ°ÑˆÐ¸Ð½Ð° Ð´Ð»Ñ Ð¡Ð¶Ð°Ñ‚Ð¸Ñ",
        "name_en": "MATEST S205 Compression Testing Machine",
        "category": "industrial",
        "brand": "MATEST",
        "img": "/assets/images/matest_s205_b00d84f8.jpg",
        "price": "Request"
    },
    {
        "id": 18,
        "name": "Shimadzu Hardness Tester",
        "name_uz": "Shimadzu Qattiqlik Sinov Qurilmasi",
        "name_ru": "Shimadzu Ð¢Ð²ÐµÑ€Ð´Ð¾Ð¼ÐµÑ€",
        "name_en": "Shimadzu Hardness Tester",
        "category": "industrial",
        "brand": "Shimadzu",
        "img": "/assets/images/shimadzu_gc2030_eb0a7e59.jpg",
        "price": "Request"
    },
    {
        "id": 19,
        "name": "Universal Testing Machine",
        "name_uz": "Universal Sinov Mashinasi",
        "name_ru": "Ð£Ð½Ð¸Ð²ÐµÑ€ÑÐ°Ð»ÑŒÐ½Ð°Ñ Ð˜ÑÐ¿Ñ‹Ñ‚Ð°Ñ‚ÐµÐ»ÑŒÐ½Ð°Ñ ÐœÐ°ÑˆÐ¸Ð½Ð°",
        "name_en": "Universal Testing Machine",
        "category": "industrial",
        "brand": "MATEST",
        "img": "/assets/images/anton_paar_dma_fc700bcb.jpg",
        "price": "Request"
    },
    {
        "id": 10,
        "name": "Zeiss Axio Observer",
        "name_uz": "Zeiss Axio Observer Teskari Mikroskop",
        "name_ru": "Zeiss Axio Observer Ð˜Ð½Ð²ÐµÑ€Ñ‚Ð¸Ñ€Ð¾Ð²Ð°Ð½Ð½Ñ‹Ð¹ ÐœÐ¸ÐºÑ€Ð¾ÑÐºÐ¾Ð¿",
        "name_en": "Zeiss Axio Observer Inverted Microscope",
        "category": "physics",
        "brand": "Zeiss",
        "img": "/assets/images/zeiss_axio_ed273a39.jpg",
        "price": "Request"
    },
    {
        "id": 20,
        "name": "Optical Spectrometer SP-300",
        "name_uz": "Optik Spektrometr SP-300",
        "name_ru": "ÐžÐ¿Ñ‚Ð¸Ñ‡ÐµÑÐºÐ¸Ð¹ Ð¡Ð¿ÐµÐºÑ‚Ñ€Ð¾Ð¼ÐµÑ‚Ñ€ SP-300",
        "name_en": "Optical Spectrometer SP-300",
        "category": "physics",
        "brand": "Shimadzu",
        "img": "/assets/images/mindray_bc5000_3f60d97e.jpg",
        "price": "Request"
    },
    {
        "id": 21,
        "name": "Digital Oscilloscope DS1054",
        "name_uz": "Raqamli Osiloskop DS1054",
        "name_ru": "Ð¦Ð¸Ñ„Ñ€Ð¾Ð²Ð¾Ð¹ ÐžÑÑ†Ð¸Ð»Ð»Ð¾Ð³Ñ€Ð°Ñ„ DS1054",
        "name_en": "Digital Oscilloscope DS1054",
        "category": "physics",
        "brand": "Rigol",
        "img": "/assets/images/siemens_somatom_f3144f82.jpg",
        "price": "Request"
    },
    {
        "id": 11,
        "name": "Agilent 1260 Infinity",
        "name_uz": "Agilent 1260 Infinity HPLC Tizimi",
        "name_ru": "Agilent 1260 Infinity Ð’Ð­Ð–Ð¥ Ð¡Ð¸ÑÑ‚ÐµÐ¼Ð°",
        "name_en": "Agilent 1260 Infinity HPLC System",
        "category": "environmental",
        "brand": "Agilent",
        "img": "/assets/images/agilent_1260_5fded2ca.jpg",
        "price": "Request"
    },
    {
        "id": 22,
        "name": "Water Quality Analyzer WQA-7",
        "name_uz": "Suv Sifati Analizatori WQA-7",
        "name_ru": "ÐÐ½Ð°Ð»Ð¸Ð·Ð°Ñ‚Ð¾Ñ€ ÐšÐ°Ñ‡ÐµÑÑ‚Ð²Ð° Ð’Ð¾Ð´Ñ‹ WQA-7",
        "name_en": "Water Quality Analyzer WQA-7",
        "category": "environmental",
        "brand": "Hach",
        "img": "/assets/images/matest_s205_b00d84f8.jpg",
        "price": "Request"
    },
    {
        "id": 23,
        "name": "Air Particle Counter APC-3",
        "name_uz": "Havo Zarracha Hisoblagichi APC-3",
        "name_ru": "Ð¡Ñ‡Ñ‘Ñ‚Ñ‡Ð¸Ðº Ð§Ð°ÑÑ‚Ð¸Ñ† Ð’Ð¾Ð·Ð´ÑƒÑ…Ð° APC-3",
        "name_en": "Air Particle Counter APC-3",
        "category": "environmental",
        "brand": "TSI",
        "img": "/assets/images/binder_kb53_0923396b.jpg",
        "price": "Request"
    },
    {
        "id": 12,
        "name": "KERN OBN 132",
        "name_uz": "KERN OBN 132 O'quv Mikroskobi",
        "name_ru": "KERN OBN 132 Ð£Ñ‡ÐµÐ±Ð½Ñ‹Ð¹ ÐœÐ¸ÐºÑ€Ð¾ÑÐºÐ¾Ð¿",
        "name_en": "KERN OBN 132 Educational Microscope",
        "category": "educational",
        "brand": "KERN",
        "img": "/assets/images/kern_obn_1c32962d.jpg",
        "price": "Request"
    },
    {
        "id": 24,
        "name": "Student Physics Kit Pro",
        "name_uz": "O'quvchi Fizika To'plami Pro",
        "name_ru": "Ð¨ÐºÐ¾Ð»ÑŒÐ½Ñ‹Ð¹ Ð¤Ð¸Ð·Ð¸Ñ‡ÐµÑÐºÐ¸Ð¹ ÐÐ°Ð±Ð¾Ñ€ Pro",
        "name_en": "Student Physics Kit Pro",
        "category": "educational",
        "brand": "FYZEN",
        "img": "/assets/images/zeiss_axio_ed273a39.jpg",
        "price": "Request"
    },
    {
        "id": 25,
        "name": "Biology Classroom Set",
        "name_uz": "Biologiya Sinf Xonasi To'plami",
        "name_ru": "ÐšÐ¾Ð¼Ð¿Ð»ÐµÐºÑ‚ Ð´Ð»Ñ ÐšÐ°Ð±Ð¸Ð½ÐµÑ‚Ð° Ð‘Ð¸Ð¾Ð»Ð¾Ð³Ð¸Ð¸",
        "name_en": "Biology Classroom Set",
        "category": "educational",
        "brand": "FYZEN",
        "img": "/assets/images/olympus_bx53_eff0f61a.jpg",
        "price": "Request"
    },
    {
        "id": 13,
        "name": "Soil Testing Kit V2",
        "name_uz": "Tuproq Tahlil Komplekti V2",
        "name_ru": "ÐšÐ¾Ð¼Ð¿Ð»ÐµÐºÑ‚ ÐÐ½Ð°Ð»Ð¸Ð·Ð° ÐŸÐ¾Ñ‡Ð²Ñ‹ V2",
        "name_en": "Soil Testing Kit V2",
        "category": "agriculture",
        "brand": "FYZEN",
        "img": "/assets/images/soil_kit_5bd32ca3.jpg",
        "price": "Request"
    },
    {
        "id": 26,
        "name": "Grain Moisture Analyzer GM-900",
        "name_uz": "Don Namligi Analizatori GM-900",
        "name_ru": "ÐÐ½Ð°Ð»Ð¸Ð·Ð°Ñ‚Ð¾Ñ€ Ð’Ð»Ð°Ð¶Ð½Ð¾ÑÑ‚Ð¸ Ð—ÐµÑ€Ð½Ð° GM-900",
        "name_en": "Grain Moisture Analyzer GM-900",
        "category": "agriculture",
        "brand": "KETT",
        "img": "/assets/images/pipette_set_30455136.jpg",
        "price": "Request"
    },
    {
        "id": 27,
        "name": "Portable Nitrate Tester",
        "name_uz": "Ko'chma Nitrat Sinov Qurilmasi",
        "name_ru": "ÐŸÐ¾Ñ€Ñ‚Ð°Ñ‚Ð¸Ð²Ð½Ñ‹Ð¹ ÐÐ¸Ñ‚Ñ€Ð°Ñ‚-Ñ‚ÐµÑÑ‚ÐµÑ€",
        "name_en": "Portable Nitrate Tester",
        "category": "agriculture",
        "brand": "Hach",
        "img": "/assets/images/agilent_1260_5fded2ca.jpg",
        "price": "Request"
    },
    {
        "id": 14,
        "name": "Laboratory Fume Hood",
        "name_uz": "Laboratoriya Vityaj Shkaflari",
        "name_ru": "Ð›Ð°Ð±Ð¾Ñ€Ð°Ñ‚Ð¾Ñ€Ð½Ñ‹Ð¹ Ð’Ñ‹Ñ‚ÑÐ¶Ð½Ð¾Ð¹ Ð¨ÐºÐ°Ñ„",
        "name_en": "Laboratory Fume Hood",
        "category": "furniture",
        "brand": "Binder",
        "img": "/assets/images/fume_hood_01725376.jpg",
        "price": "Request"
    },
    {
        "id": 28,
        "name": "Lab Bench Workstation Pro",
        "name_uz": "Laboratoriya Ish Stoli Pro",
        "name_ru": "Ð›Ð°Ð±Ð¾Ñ€Ð°Ñ‚Ð¾Ñ€Ð½Ñ‹Ð¹ Ð Ð°Ð±Ð¾Ñ‡Ð¸Ð¹ Ð¡Ñ‚Ð¾Ð» Pro",
        "name_en": "Lab Bench Workstation Pro",
        "category": "furniture",
        "brand": "FYZEN",
        "img": "/assets/images/binder_kb53_0923396b.jpg",
        "price": "Request"
    },
    {
        "id": 29,
        "name": "Safety Cabinet Type II",
        "name_uz": "Xavfsizlik Shkafi II tur",
        "name_ru": "Ð—Ð°Ñ‰Ð¸Ñ‚Ð½Ñ‹Ð¹ Ð¨ÐºÐ°Ñ„ II Ñ‚Ð¸Ð¿Ð°",
        "name_en": "Safety Cabinet Type II",
        "category": "furniture",
        "brand": "Esco",
        "img": "/assets/images/matest_s205_b00d84f8.jpg",
        "price": "Request"
    },
    {
        "id": 15,
        "name": "Premium Pipette Set",
        "name_uz": "Premium Pipetka To'plami",
        "name_ru": "ÐŸÑ€ÐµÐ¼Ð¸ÑƒÐ¼ ÐÐ°Ð±Ð¾Ñ€ ÐŸÐ¸Ð¿ÐµÑ‚Ð¾Ðº",
        "name_en": "Premium Pipette Set",
        "category": "consumables",
        "brand": "Eppendorf",
        "img": "/assets/images/pipette_set_30455136.jpg",
        "price": "Request"
    },
    {
        "id": 30,
        "name": "Microcentrifuge Tubes 1.5ml",
        "name_uz": "Mikrosentrifuga Naylar 1.5ml",
        "name_ru": "ÐŸÑ€Ð¾Ð±Ð¸Ñ€ÐºÐ¸ Ð´Ð»Ñ ÐœÐ¸ÐºÑ€Ð¾Ñ†ÐµÐ½Ñ‚Ñ€Ð¸Ñ„ÑƒÐ³Ð¸ 1.5Ð¼Ð»",
        "name_en": "Microcentrifuge Tubes 1.5ml",
        "category": "consumables",
        "brand": "Eppendorf",
        "img": "/assets/images/soil_kit_5bd32ca3.jpg",
        "price": "Request"
    },
    {
        "id": 31,
        "name": "Disposable Petri Dishes (Pack 20)",
        "name_uz": "Bir Martalik Petri Idishlari (20 ta)",
        "name_ru": "ÐžÐ´Ð½Ð¾Ñ€Ð°Ð·Ð¾Ð²Ñ‹Ðµ Ð§Ð°ÑˆÐºÐ¸ ÐŸÐµÑ‚Ñ€Ð¸ (20 ÑˆÑ‚)",
        "name_en": "Disposable Petri Dishes (Pack 20)",
        "category": "consumables",
        "brand": "Corning",
        "img": "/assets/images/kern_obn_1c32962d.jpg",
        "price": "Request"
    },
    {
        "id": 32,
        "name": "Anton Paar SVM 3001",
        "name_uz": "Anton Paar SVM 3001 Qovushqoqlik Metr",
        "name_ru": "Anton Paar SVM 3001 Ð’Ð¸ÑÐºÐ¾Ð·Ð¸Ð¼ÐµÑ‚Ñ€",
        "name_en": "Anton Paar SVM 3001 Viscometer",
        "category": "petroleum",
        "brand": "Anton Paar",
        "img": "/assets/images/anton_paar_dma_fc700bcb.jpg",
        "price": "Request"
    },
    {
        "id": 33,
        "name": "Flash Point Tester FPT-800",
        "name_uz": "Alangalanish Nuqtasi Sinov Qurilmasi FPT-800",
        "name_ru": "Ð¢ÐµÑÑ‚ÐµÑ€ Ð¢ÐµÐ¼Ð¿ÐµÑ€Ð°Ñ‚ÑƒÑ€Ñ‹ Ð’ÑÐ¿Ñ‹ÑˆÐºÐ¸ FPT-800",
        "name_en": "Flash Point Tester FPT-800",
        "category": "petroleum",
        "brand": "Tanaka",
        "img": "/assets/images/shimadzu_gc2030_eb0a7e59.jpg",
        "price": "Request"
    },
    {
        "id": 34,
        "name": "Crude Oil Distillation Unit",
        "name_uz": "Xom Neft Haydash Qurilmasi",
        "name_ru": "Ð£ÑÑ‚Ð°Ð½Ð¾Ð²ÐºÐ° ÐŸÐµÑ€ÐµÐ³Ð¾Ð½ÐºÐ¸ Ð¡Ñ‹Ñ€Ð¾Ð¹ ÐÐµÑ„Ñ‚Ð¸",
        "name_en": "Crude Oil Distillation Unit",
        "category": "petroleum",
        "brand": "Koehler",
        "img": "/assets/images/siemens_somatom_f3144f82.jpg",
        "price": "Request"
    }
];

function getProducts() {
    // Auto-reset: if DB version changed (e.g. new local images), wipe stale localStorage
    const DB_VERSION = 'v7-empty-inventory';
    if (localStorage.getItem('fyzen_db_version') !== DB_VERSION) {
        localStorage.removeItem('fyzen_products');
        localStorage.setItem('fyzen_db_version', DB_VERSION);
    }

    // Check for manual "reset" flag
    if (localStorage.getItem('fyzen_reset_needed') === 'true') {
        localStorage.removeItem('fyzen_products');
        localStorage.removeItem('fyzen_reset_needed');
    }

    const local = localStorage.getItem('fyzen_products');
    let localProducts = [];
    try {
        localProducts = local ? JSON.parse(local) : [];
        
        // --- AUTO-SANITIZER FOR CORRUPTED CATEGORIES ---
        const validCategories = ["analytical", "medical", "chemistry", "physics", "biology", "environmental", "agriculture", "industrial", "petroleum", "educational", "furniture", "consumables"];
        localProducts = localProducts.map(lp => {
            if (!lp.category) lp.category = "medical";
            let cat = String(lp.category).toLowerCase().trim();
            if (cat === "lab" || cat === "Ð»Ð°Ð±Ð¾Ñ€Ð°Ñ‚Ð¾Ñ€Ð¸Ñ") cat = "analytical";
            else if (cat === "Ð´Ð¸Ð°Ð³Ð½Ð¾ÑÑ‚Ð¸ÐºÐ°") cat = "medical";
            else if (!validCategories.includes(cat)) cat = "medical"; // Fallback for any other corrupted data
            lp.category = cat;
            return lp;
        });
        
    } catch(e) {
        console.error("Corrupt local storage products", e);
        localProducts = [];
    }

    // Merge logic: ensure all DEFAULT_PRODUCTS are present and translated
    let finalProducts = [...DEFAULT_PRODUCTS];
    
    localProducts.forEach(lp => {
        const index = finalProducts.findIndex(dp => dp.id == lp.id);
        if (index !== -1) {
            const def = finalProducts[index];
            // Merge local overrides but always protect canonical fields from DEFAULT_PRODUCTS
            // so stale localStorage values never break images, translations, or categories
            finalProducts[index] = {
                ...def,
                ...lp,
                // Always use DEFAULT values for these protected fields:
                img: def.img,
                category: def.category,
                name_uz: def.name_uz || lp.name_uz,
                name_ru: def.name_ru || lp.name_ru,
                name_en: def.name_en || lp.name_en,
                // Only allow localStorage to override editable display fields:
                name: lp.name || def.name,
                brand: lp.brand || def.brand,
                stock: lp.stock !== undefined ? lp.stock : def.stock,
                desc: lp.desc || def.desc
            };
        } else {
            finalProducts.push(lp);
        }
    });

    // Merge server-approved products submitted through the Telegram admin bot.
    try {
        const published = JSON.parse(localStorage.getItem('fyzen_published_products') || '[]');
        if (Array.isArray(published)) {
            published.forEach(p => {
                if (!finalProducts.some(existing => String(existing.id) === String(p.id))) finalProducts.push(p);
            });
        }
    } catch (e) { console.warn('Published product cache unavailable', e); }

    // Ensure all products have an inventory stock initialized
    finalProducts = finalProducts.map(p => {
        if (p.stock === undefined || p.stock === null || p.stock === '') {
            p.stock = Math.floor(Math.random() * 15) + 5; // Initial stock 5-19
        } else {
            p.stock = parseInt(p.stock, 10) || 0;
        }
        return p;
    });

    return finalProducts;
}

// Use the global versions from lang.js

// ====================================================
// NOTIFICATIONS (TOASTS)
// ====================================================
function showToast(msg, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `fyz-toast ${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <div class="toast-icon">${type === 'success' ? 'âœ“' : (type === 'wish' ? 'â¤ï¸' : 'â„¹ï¸')}</div>
            <div class="toast-msg">${msg}</div>
        </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add('active'), 100);
    setTimeout(() => {
        toast.classList.remove('active');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

// ====================================================
// UI & NAVBAR
// ====================================================
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('fyzen_cart') || '[]');
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(badge => {
        if (badge) {
            badge.innerText = cart.length;
            badge.style.display = cart.length > 0 ? 'flex' : 'none';
        }
    });
}

function updateWishBadge() {
    const wish = JSON.parse(localStorage.getItem('fyzen_wishlist') || '[]');
    const badge = document.getElementById('wishBadge');
    if (badge) {
        badge.innerText = wish.length;
        badge.style.display = wish.length > 0 ? 'flex' : 'none';
    }
}

function updateNavbarIcons() {
    const navActions = document.querySelector('.nav-actions');
    const navInner = document.querySelector('.nav-inner');
    if (!navActions || !navInner) return;

    // Current Lang for Active State
    const currentLang = localStorage.getItem('fyzen_lang') || 'ru';

    // ICONS AND AUTH + LANG (Right Side)
    const oldIcons = navActions.querySelector('.fyz-premium-icons');
    if (oldIcons) oldIcons.remove();

    
    const iconGroup = document.createElement('div');
    iconGroup.className = 'nav-actions-inner'; 
    iconGroup.style.display = 'flex';
    iconGroup.style.alignItems = 'center';
    iconGroup.style.gap = '15px';

    iconGroup.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px;">
            <a href="wishlist.html" class="fyz-action-btn" title="Yoqtirilganlar" style="background:#f8fafc; border:1px solid #e2e8f0; width:44px; height:44px; border-radius:50%; display:flex; align-items:center; justify-content:center; transition:all 0.3s; text-decoration:none;" onmouseover="this.style.background='#f1f5f9'; this.style.borderColor='#cbd5e1';" onmouseout="this.style.background='#f8fafc'; this.style.borderColor='#e2e8f0';">
                <svg viewBox="0 0 24 24" style="width:20px; height:20px; stroke:#1e293b;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.78-8.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                <span class="fyz-badge" id="wishBadge" style="display:none; top:-4px; right:-4px; border:2px solid white;">0</span>
            </a>

            <div onclick="toggleCartSidebar(event)" class="fyz-action-btn" title="Savatcha" style="background:#f8fafc; border:1px solid #e2e8f0; width:44px; height:44px; border-radius:50%; display:flex; align-items:center; justify-content:center; transition:all 0.3s;" onmouseover="this.style.background='#f1f5f9'; this.style.borderColor='#cbd5e1';" onmouseout="this.style.background='#f8fafc'; this.style.borderColor='#e2e8f0';">
                <svg viewBox="0 0 24 24" style="width:20px; height:20px; stroke:#1e293b;"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                <span class="fyz-badge cart-badge" style="display:none; top:-4px; right:-4px; border:2px solid white;">0</span>
            </div>
        </div>

        <div class="dyn-lang-right" id="dynLangSwitcher" style="margin-left: 10px;">
            <button onclick="changeLanguage('uz')" class="${currentLang === 'uz' ? 'active active-lang' : ''}">UZ</button>
            <button onclick="changeLanguage('ru')" class="${currentLang === 'ru' ? 'active active-lang' : ''}">RU</button>
            <button onclick="changeLanguage('en')" class="${currentLang === 'en' ? 'active active-lang' : ''}">EN</button>
        </div>
    `;
    
    navActions.innerHTML = '';
    navActions.appendChild(iconGroup);


    updateWishBadge();
    updateCartBadge();
}

function toggleMegaMenu() {
    const menu = document.getElementById('megaMenuP');
    const btn = document.getElementById('katalogBtn');
    if (menu && btn) {
        menu.classList.toggle('active');
        btn.classList.toggle('active');
    }
}

// Close mega menu on outside click
document.addEventListener('click', (e) => {
    const menu = document.getElementById('megaMenuP');
    const btn = document.getElementById('katalogBtn');
    if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
        menu.classList.remove('active');
        btn.classList.remove('active');
    }
});

// ====================================================
// CART & WISHLIST LOGIC
// ====================================================
function addToCart(productOrId, requestedQuantity = 1) {
    let product;
    const quantity = Math.max(1, parseInt(requestedQuantity, 10) || 1);
    if (typeof productOrId === 'object' && productOrId !== null) product = productOrId;
    else { const allProducts = getProducts(); product = allProducts.find(p => p.id == productOrId); }
    if (!product) return;
    
    if (product.stock <= 0) {
        showToast(t('out_of_stock') || "Maxsulot sotuvda qolmagan!", 'error');
        return;
    }
    
    let cart = JSON.parse(localStorage.getItem('fyzen_cart') || '[]');
    const idx = cart.findIndex(i => i.id == product.id);
    
    if(idx > -1) {
        if (cart[idx].quantity + quantity > product.stock) {
            showToast(t('max_stock_reached') || `Omborda faqat ${product.stock} ta mavjud!`, 'error');
            return;
        }
        cart[idx].quantity += quantity;
    }
    else {
        if (quantity > product.stock) {
            showToast(t('max_stock_reached') || `Omborda faqat ${product.stock} ta mavjud!`, 'error');
            return;
        }
        cart.push({id:product.id, name:product.name, img:product.img, category:product.category, quantity});
    }
    
    localStorage.setItem('fyzen_cart', JSON.stringify(cart));
    updateCartBadge();
    showToast(t('add_to_cart_success') || 'Savatchaga qo\'shildi!');
    openCartSidebar();
}

function toggleWishlist(id, el) {
    let wishlist = JSON.parse(localStorage.getItem('fyzen_wishlist') || '[]');
    const idx = wishlist.findIndex(item => item.id == id);
    let added = false;
    
    if (idx > -1) { 
        wishlist.splice(idx, 1); 
        if(el) el.style.color = '#cbd5e1'; 
    } else { 
        const products = getProducts(); 
        const p = products.find(item => item.id == id); 
        if (p) { wishlist.push(p); if(el) el.style.color = '#ef4444'; added = true; } 
    }
    
    localStorage.setItem('fyzen_wishlist', JSON.stringify(wishlist));
    updateWishBadge();
    if (added) showToast(t('wishlist_added') || 'Yoqtirilganlarga qo\'shildi!', 'wish');
    else showToast(t('wishlist_removed') || 'Sevimlilardan olib tashlandi', 'info');
    if(el) { el.style.transform = 'scale(1.3)'; setTimeout(() => el.style.transform = 'scale(1)', 200); }
}

function initCartSidebar() {
    if(document.getElementById('cartSidebar')) return;
    const div = document.createElement('div');
    div.innerHTML = `
        <div class="cart-sidebar-overlay" id="cartSidebarOverlay" onclick="toggleCartSidebar()"></div>
        <div class="cart-sidebar" id="cartSidebar">
            <div class="cart-sidebar-header" style="display:flex; justify-content:space-between; align-items:center; padding:20px; border-bottom:1px solid #eee;">
                <h3 style="font-weight:900; color:var(--primary-dark); margin:0;">${t('cart')}</h3>
                <button onclick="toggleCartSidebar()" style="background:none; border:none; font-size:1.5rem; cursor:pointer; color:#94a3b8;">âœ•</button>
            </div>
            <div class="cart-sidebar-items" id="cartSidebarItems" style="padding:20px; flex:1; overflow-y:auto;"></div>
            <div class="cart-sidebar-footer" style="padding:20px; border-top:1px solid #eee;">
                <button class="btn btn-primary" onclick="location.href='checkout.html'" style="width:100%; padding:15px; border-radius:12px; font-weight:800;">${t('checkout')}</button>
            </div>
        </div>
    `;
    document.body.appendChild(div);
}

function toggleCartSidebar(e) {
    if(e) e.preventDefault();
    initCartSidebar();
    const s = document.getElementById('cartSidebar');
    const o = document.getElementById('cartSidebarOverlay');
    if(s && o) { s.classList.toggle('active'); o.classList.toggle('active'); document.body.classList.toggle('cart-open'); if(s.classList.contains('active')) renderCartSidebarItems(); }
}

function openCartSidebar() {
    initCartSidebar();
    const s = document.getElementById('cartSidebar');
    const o = document.getElementById('cartSidebarOverlay');
    if(s && o) { s.classList.add('active'); o.classList.add('active'); document.body.classList.add('cart-open'); renderCartSidebarItems(); }
}

function renderCartSidebarItems() {
    const cart = JSON.parse(localStorage.getItem('fyzen_cart') || '[]');
    const cont = document.getElementById('cartSidebarItems');
    const footer = document.querySelector('.cart-sidebar-footer');
    if(!cont) return;
    
    if(cart.length === 0) { 
        cont.innerHTML = `<div style="text-align:center; padding:60px 20px; color:#94a3b8;"><div style="font-size:3rem; margin-bottom:15px;">ðŸ›’</div><p style="font-weight:700;">${t('empty_cart')}</p></div>`; 
        if(footer) footer.style.display = 'none';
        return; 
    }
    
    if(footer) footer.style.display = 'block';
    cont.innerHTML = cart.map((item, i) => `
        <div class="cart-sidebar-item" style="display:flex; align-items:center; gap:15px; padding:15px; margin-bottom:15px; background:#f8fafc; border-radius:16px; border:1px solid #f1f5f9;">
            <img src="${item.img}" style="width:65px; height:65px; border-radius:12px; object-fit:cover; border:1px solid #eee; background:white;">
            <div style="flex:1;">
                <div style="font-weight:800; color:var(--primary-dark); font-size:0.9rem; line-height:1.2; margin-bottom:4px;">${item.name}</div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <button onclick="changeQty(${i}, -1)" style="width:24px; height:24px; border-radius:6px; border:1px solid #e2e8f0; background:white; cursor:pointer;">-</button>
                    <span style="font-weight:900; font-size:0.9rem; min-width:20px; text-align:center;">${item.quantity}</span>
                    <button onclick="changeQty(${i}, 1)" style="width:24px; height:24px; border-radius:6px; border:1px solid #e2e8f0; background:white; cursor:pointer;">+</button>
                </div>
            </div>
            <button onclick="removeCartItem(${i})" style="background:none; border:none; color:#cbd5e1; cursor:pointer; font-size:1.2rem;">âœ•</button>
        </div>
    `).join('');
}

function changeQty(i, delta) {
    let cart = JSON.parse(localStorage.getItem('fyzen_cart') || '[]');
    if(cart[i]) {
        if (delta > 0) {
            const allProducts = typeof getProducts === 'function' ? getProducts() : [];
            const product = allProducts.find(p => p.id == cart[i].id);
            if (product && cart[i].quantity >= product.stock) {
                showToast(t('max_stock_reached') || `Omborda faqat ${product.stock} ta mavjud!`, 'error');
                return;
            }
        }
        
        cart[i].quantity += delta;
        if(cart[i].quantity < 1) cart.splice(i, 1);
        localStorage.setItem('fyzen_cart', JSON.stringify(cart));
        renderCartSidebarItems();
        
        // Also update cart UI if on cart.html
        if (typeof renderCartUI === 'function') {
            renderCartUI();
        }
        
        updateCartBadge();
    }
}

function removeCartItem(i) {
    let cart = JSON.parse(localStorage.getItem('fyzen_cart') || '[]');
    cart.splice(i, 1);
    localStorage.setItem('fyzen_cart', JSON.stringify(cart));
    renderCartSidebarItems();
    updateCartBadge();
    showToast(t('removed_from_cart'), 'info');
}

// ====================================================
// AUTH & INITIALIZATION
// ====================================================
const ADMIN_EMAILS = ["amuso3712@gmail.com", "FirdavsM@gmail.com"];
function updateAuthUI() {
    const navIcons = document.querySelector('.nav-actions');
    if (!navIcons) return;
    const user = JSON.parse(localStorage.getItem('fyzen_user'));
    let html = '';
    let isAdmin = false;
    if (user) {
        const dynamicAdmins = JSON.parse(localStorage.getItem('fyzen_admins') || '[]');
        isAdmin = ADMIN_EMAILS.includes(user.email) || dynamicAdmins.includes(user.email) || user.role === 'admin' || user.role === 'owner';
        html = `
            <div class="nav-auth-container" style="display:flex; align-items:center; gap:12px; margin-left:15px; padding: 4px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
                ${isAdmin ? '<a href="admin.html" class="admin-badge-btn" style="background:linear-gradient(135deg, #ff416c, #ff4b2b); color:white; padding:6px 14px; border-radius:8px; font-size:0.75rem; font-weight:900; text-decoration:none; box-shadow:0 4px 10px rgba(255,75,43,0.25); border:none; letter-spacing:0.5px; display:flex; align-items:center; gap:6px;">ADMIN</a>' : ''}
                <button onclick="localStorage.removeItem('fyzen_user'); location.reload();" class="logout-icon-btn" style="background:transparent; border:none; cursor:pointer; color:#ef4444; padding:8px; border-radius:8px; display:flex; align-items:center; justify-content:center; transition: background 0.3s;" onmouseover="this.style.background='#fee2e2'" onmouseout="this.style.background='transparent'" title="Logout">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                </button>
            </div>
        `;
    }
    // Only update the auth section, don't touch lang-switcher or icons
    const wrap = document.createElement('div');
    wrap.id = 'nav-auth-section';
    wrap.innerHTML = html;
    const old = document.getElementById('nav-auth-section');
    if (old) old.remove();
    navIcons.append(wrap);

    // Populate mobile drawer auth
    const mobileAuth = document.getElementById('mobileAuth');
    if (mobileAuth) {
        if (user) {
            mobileAuth.innerHTML = `
                <div style="display:flex; flex-direction:column; gap:10px; width:100%;">
                    <div style="font-size:0.85rem; color:#64748b; font-weight:700; word-break:break-all;">${user.email}</div>
                    <div style="display:flex; gap:10px;">
                        ${isAdmin ? '<a href="admin.html" style="flex:1; text-align:center; background:linear-gradient(135deg, #ff416c, #ff4b2b); color:white; padding:8px; border-radius:8px; font-size:0.8rem; font-weight:900; text-decoration:none; box-shadow:0 4px 10px rgba(255,75,43,0.3); border:none; margin-bottom:0;">ADMIN</a>' : ''}
                        <button onclick="localStorage.removeItem('fyzen_user'); location.reload();" style="flex:1; background:rgba(239,68,68,0.1); border:none; cursor:pointer; color:#ef4444; padding:8px; border-radius:8px; font-size:0.8rem; font-weight:800; display:flex; align-items:center; justify-content:center; gap:5px;">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                            Logout
                        </button>
                    </div>
                </div>
            `;
        } else {
            mobileAuth.innerHTML = '';
        }
    }
    updateCartBadge();
}

function highlightActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

function initMobileNav() {
    if (document.getElementById('mobileNavOverlay')) return;
    
    const navbar = document.querySelector('.nav-inner');
    if (!navbar) return;

    // Create Hamburger Toggle
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'menu-toggle';
    toggle.style.display = 'none'; // Controlled by CSS media queries
    toggle.setAttribute('aria-label', 'Open navigation menu');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span></span><span></span><span></span>';
    toggle.onclick = toggleMobileMenu;
    navbar.appendChild(toggle);

    // Create Mobile Overlay
    const overlay = document.createElement('aside');
    overlay.id = 'mobileNavOverlay';
    overlay.className = 'mobile-nav';
    overlay.setAttribute('aria-label', 'Mobile navigation');
    overlay.setAttribute('aria-hidden', 'true');

    const backdrop = document.createElement('div');
    backdrop.id = 'mobileNavBackdrop';
    backdrop.className = 'mobile-nav-backdrop';
    backdrop.setAttribute('aria-hidden', 'true');
    backdrop.onclick = toggleMobileMenu;
    document.body.appendChild(backdrop);
    
    // Copy links from desktop nav - select top-level links and use textContent (innerText is empty if hidden)
    const desktopLinks = document.querySelectorAll('.nav-links > li > a');
    let linksHtml = '';
    let linkIndex = 0;
    const totalLinks = desktopLinks.length;
    
    desktopLinks.forEach(link => {
        const parentLi = link.closest('li');
        const textSpan = link.querySelector('[data-i18n]') || link;
        const i18nKey = textSpan.getAttribute('data-i18n') || link.getAttribute('data-i18n');
        const text = textSpan.textContent.trim().replace(/[â–¾â–¼]/g, '');
        const icon = mobileNavIconMap[i18nKey] || defaultNavIcon;
        
        const dropdownMenu = parentLi ? parentLi.querySelector('.nav-dropdown-menu') : null;
        if (dropdownMenu) {
            // Build sub-menu with category icons
            const subLinks = dropdownMenu.querySelectorAll('a');
            let subHtml = '';
            subLinks.forEach(sub => {
                const subKey = sub.getAttribute('data-i18n') || '';
                const subIcon = mobileCatIconMap[subKey] || defaultNavIcon;
                const subText = sub.textContent.trim();
                const subHref = sub.getAttribute('href') || '#';
                subHtml += `<a href="${subHref}" class="mobile-sub-link" onclick="toggleMobileMenu()"><span class="mobile-cat-icon">${subIcon}</span><span data-i18n="${subKey}">${subText}</span></a>`;
            });
            
            linksHtml += `
                <div class="mobile-nav-dropdown">
                    <div class="mobile-nav-dropdown-toggle" onclick="toggleMobileSubMenu(event, this)">
                        <span class="mobile-nav-icon">${icon}</span>
                        <a href="${link.getAttribute('href')}" data-i18n="${i18nKey || ''}">${text}</a>
                        <span class="mobile-nav-arrow">&#9662;</span>
                    </div>
                    <div class="mobile-nav-dropdown-menu">
                        ${subHtml}
                    </div>
                </div>
            `;
        } else {
            linksHtml += `<a href="${link.getAttribute('href')}" onclick="toggleMobileMenu()"><span class="mobile-nav-icon">${icon}</span><span data-i18n="${i18nKey || ''}">${text}</span></a>`;
        }
        
        linkIndex++;
        if (linkIndex < totalLinks) {
            linksHtml += '<div class="mobile-nav-separator"></div>';
        }
    });
    
    const currentLang = localStorage.getItem('fyzen_lang') || 'ru';
    
    overlay.innerHTML = `
        <div class="mobile-nav-header">
            <div class="mobile-nav-brand">
                <span class="mobile-nav-brand-mark"><img src="/assets/images/fyzen-cube-final_9ae90e1b.png" alt="FYZEN-LAB"></span>
                <span class="mobile-nav-brand-copy">
                    <span class="mobile-nav-brand-name">FYZEN-LAB</span>
                    <span class="mobile-nav-brand-slogan">SCIENCE WITHOUT LIMITS</span>
                </span>
            </div>
            <button type="button" class="mobile-nav-close" onclick="toggleMobileMenu()" aria-label="Close navigation menu">
                <svg viewBox="0 0 24 24" width="21" height="21" stroke="currentColor" fill="none" stroke-width="2.4" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
        </div>
        ${linksHtml}
        <div class="mobile-lang-switcher lang-switcher" style="margin-top:20px; display:flex; gap:10px; justify-content:center; border: 1px solid rgba(0, 168, 225, 0.15); border-radius: 8px; padding: 4px; background: rgba(255, 255, 255, 0.5);">
            <button type="button" data-lang="uz" onclick="changeLanguage('uz')" class="lang-btn ${currentLang === 'uz' ? 'active-lang' : ''}" style="flex:1; background:transparent; border:none; padding:8px; font-weight:800; font-size:0.85rem; color:#64748b; cursor:pointer; transition:all 0.3s; border-radius:6px;">UZ</button>
            <button type="button" data-lang="ru" onclick="changeLanguage('ru')" class="lang-btn ${currentLang === 'ru' ? 'active-lang' : ''}" style="flex:1; background:transparent; border:none; padding:8px; font-weight:800; font-size:0.85rem; color:#64748b; cursor:pointer; transition:all 0.3s; border-radius:6px;">RU</button>
            <button type="button" data-lang="en" onclick="changeLanguage('en')" class="lang-btn ${currentLang === 'en' ? 'active-lang' : ''}" style="flex:1; background:transparent; border:none; padding:8px; font-weight:800; font-size:0.85rem; color:#64748b; cursor:pointer; transition:all 0.3s; border-radius:6px;">EN</button>
        </div>
        <div style="margin-top:15px; display:flex; gap:15px; padding: 0 10px;" id="mobileAuth"></div>
    `;
    document.body.appendChild(overlay);
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && overlay.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
}

// SVG icons mapped by data-i18n key for top-level nav items
const mobileNavIconMap = {
    'nav_catalog': '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
    'nav_products': '<svg viewBox="0 0 24 24"><path d="M9 3L5 8h14l-4-5H9z"/><rect x="5" y="8" width="14" height="13" rx="1"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>',
    'nav_brands': '<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
    'nav_about': '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg>',
    'nav_news': '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="7" y1="16" x2="13" y2="16"/></svg>',
    'nav_contact': '<svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>'
};

// SVG icons for product sub-categories mapped by data-i18n or URL param
const mobileCatIconMap = {
    'cat_analytical': '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
    'cat_medical': '<svg viewBox="0 0 24 24"><path d="M12 2v8m-4-4h8"/><rect x="5" y="10" width="14" height="12" rx="2"/></svg>',
    'cat_chemistry': '<svg viewBox="0 0 24 24"><path d="M9 3h6v6l4 8H5l4-8V3z"/><line x1="9" y1="3" x2="15" y2="3"/></svg>',
    'cat_physics': '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/></svg>',
    'cat_biology': '<svg viewBox="0 0 24 24"><path d="M12 22c-4-3-8-6-8-11a8 8 0 0 1 16 0c0 5-4 8-8 11z"/><circle cx="12" cy="11" r="3"/></svg>',
    'cat_environmental': '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10A15 15 0 0 1 8 12 15 15 0 0 1 12 2z"/><line x1="2" y1="12" x2="22" y2="12"/></svg>',
    'cat_agriculture': '<svg viewBox="0 0 24 24"><path d="M12 22V10"/><path d="M7 12c0-3 2-5 5-8 3 3 5 5 5 8a5 5 0 0 1-10 0z"/></svg>',
    'cat_industrial': '<svg viewBox="0 0 24 24"><path d="M2 20h20"/><path d="M5 20V8l5 4V8l5 4V4h3v16"/></svg>',
    'cat_petroleum': '<svg viewBox="0 0 24 24"><path d="M12 2C8 6 4 10 4 14a8 8 0 0 0 16 0c0-4-4-8-8-12z"/></svg>',
    'cat_educational': '<svg viewBox="0 0 24 24"><path d="M2 7l10-4 10 4-10 4z"/><path d="M6 9v6c0 2 3 4 6 4s6-2 6-4V9"/></svg>',
    'cat_furniture': '<svg viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="4" rx="1"/><line x1="5" y1="12" x2="5" y2="20"/><line x1="19" y1="12" x2="19" y2="20"/><line x1="3" y1="8" x2="3" y2="5"/><line x1="21" y1="8" x2="21" y2="5"/></svg>',
    'cat_consumables': '<svg viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>'
};

// Fallback generic icon
const defaultNavIcon = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="12" cy="19" r="2"/></svg>';

function addMobileNavIcons() {
    const nav = document.getElementById('mobileNavOverlay');
    if (!nav) return;

    // Add icons to top-level direct links (ÐšÐÐ¢ÐÐ›ÐžÐ“, Ð‘Ð Ð•ÐÐ”Ð«, Ðž ÐÐÐ¡, etc.)
    document.querySelectorAll('#mobileNavOverlay > a').forEach(link => {
        const key = link.getAttribute('data-i18n') || '';
        const svgHtml = mobileNavIconMap[key] || defaultNavIcon;
        const iconSpan = document.createElement('span');
        iconSpan.className = 'mobile-nav-icon';
        iconSpan.innerHTML = svgHtml;
        link.insertBefore(iconSpan, link.firstChild);
    });

    // Add icons to dropdown toggle links (ÐŸÐ ÐžÐ”Ð£ÐšÐ¢Ð«)
    document.querySelectorAll('#mobileNavOverlay .mobile-nav-dropdown-toggle').forEach(toggle => {
        const link = toggle.querySelector('a');
        if (!link) return;
        const key = link.getAttribute('data-i18n') || '';
        const svgHtml = mobileNavIconMap[key] || defaultNavIcon;
        const iconSpan = document.createElement('span');
        iconSpan.className = 'mobile-nav-icon';
        iconSpan.innerHTML = svgHtml;
        toggle.insertBefore(iconSpan, toggle.firstChild);
    });

    // Add category-specific icons to sub-links inside dropdown menus
    document.querySelectorAll('#mobileNavOverlay .mobile-nav-dropdown-menu a').forEach(link => {
        const key = link.getAttribute('data-i18n') || '';
        const svgHtml = mobileCatIconMap[key] || defaultNavIcon;
        const iconSpan = document.createElement('span');
        iconSpan.className = 'mobile-cat-icon';
        iconSpan.innerHTML = svgHtml;
        link.insertBefore(iconSpan, link.firstChild);
    });

    // Add separators between top-level items
    const topItems = document.querySelectorAll('#mobileNavOverlay > a, #mobileNavOverlay > .mobile-nav-dropdown');
    topItems.forEach((item, i) => {
        if (i < topItems.length - 1) {
            const sep = document.createElement('div');
            sep.className = 'mobile-nav-separator';
            item.after(sep);
        }
    });
}

// Toggle mobile sub-menu accordion
function toggleMobileSubMenu(e, element) {
    if (e.target.tagName === 'A') {
        toggleMobileMenu();
        return;
    }
    e.preventDefault();
    e.stopPropagation();
    const dropdown = element.closest('.mobile-nav-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('open');
    }
}

function toggleMobileMenu() {
    const overlay = document.getElementById('mobileNavOverlay');
    const backdrop = document.getElementById('mobileNavBackdrop');
    const toggle = document.querySelector('.menu-toggle');
    const body = document.body;
    if (!overlay) return;
    const isOpen = overlay.classList.toggle('active');
    if (backdrop) backdrop.classList.toggle('active', isOpen);
    if (toggle) {
        toggle.classList.toggle('open', isOpen);
        toggle.setAttribute('aria-expanded', String(isOpen));
        toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    }
    overlay.setAttribute('aria-hidden', String(!isOpen));
    body.style.overflow = isOpen ? 'hidden' : '';
    if (isOpen) {
        overlay.querySelector('.mobile-nav-close')?.focus();
    } else {
        toggle?.focus();
    }
}

async function syncPublishedProducts() {
    try {
        const response = await fetch(getApiUrl('/api/products/published'), { headers: { Accept: 'application/json' } });
        if (!response.ok) return;
        const payload = await response.json();
        if (!Array.isArray(payload.products)) return;
        localStorage.setItem('fyzen_published_products', JSON.stringify(payload.products));
        window.dispatchEvent(new CustomEvent('fyzen:products-updated'));
    } catch (error) { console.warn('Published products sync skipped', error); }
}

window.addEventListener('fyzen:products-updated', () => {
    if (typeof renderDynamicProducts === 'function') renderDynamicProducts();
    if (typeof renderCatalogProducts === 'function') renderCatalogProducts();
});

document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    updateNavbarIcons();
    updateAuthUI();
    initCartSidebar();
    highlightActiveNavLink();
    // Re-apply active lang button after auth UI is injected
    if (typeof updateI18n === 'function') updateI18n();
    void syncPublishedProducts();
});

