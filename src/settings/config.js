const define = {
    menu: {
        order: ["Main Menu", "Proxy", "Tools", "Artificial Intelligence", "Other AI", "Image Gen AI", "Panel", "Info"]
    },

    options: {
        owner: ["6285786153616", "6285797442902", "6283824196477"],
        sessionName: "sessions",
        prefix: /^[!?@#.]/i,
        prefixExample: ".", // Jangan diganti, ini hanya untuk contoh prefix saja ( gak ngaruh ke system prefix asli )
        pairingNumber: "6285220188676",
        // pairingNumber: "6285643797514",
        botName: "Shiroko Bot",
        botMode: "PUBLIC",
        ownerName: "X - Dev",
        thumbnail: "https://raw.githubusercontent.com/Fahmi-XD/Fahmi-XD/refs/heads/main/database/aroo.jpg",  // Ubah jadi foto botmu atau foto apa aja
        thumbnailDocument: "https://raw.githubusercontent.com/Fahmi-XD/Fahmi-XD/refs/heads/main/database/arona-low.png",  // Ini untuk dokumen yang memakai foto seperti tampilan menu, dan harus menggunakan foto yang 1:1 dan memiliki size kecil. contoh : 320px x 320px
        newsletterJid: "120363361999470509@newsletter",
        newsletterName: "🔥 Shiroko bot - X DEV",
        ownerLink: "https://github.com/hyung27",
        systemLimit: true, // Mengaktifkan system limit
        limit: 100, // Jumlah limit untuk setiap user
        menuType: 2, // ( Belum work ) 1, 2 - 1 Untuk Full Button, 2 Untuk anti button. Antisipasi mark murka kalau button di fix lagi
        panel: [  // Kumpulan panel. isi sesuai dengan panelmu dan tambahkan jika dirasa kurang banyak
            { // Tambahkan dari sini jika kurang
                domain: '', // isi dengan domain panel lu
                apikey: '', // Isi Apikey Plta Lu
                capikey: '', // Isi Apikey Pltc Lu
                eggsnya: '15', // id eggs yang dipakai
                location: '1' // id location
            }, // Sampai sini
        ],
    },

    message: {
        forwarded: true, // Forward Message
    },

    exif: {
        packId: "https://github.com/hyung27",
        packName: "Made By",
        packPublish: "Shiroko - Bot",
        packEmail: "admin123@gmail.com",
        packWebsite: "https://github.com/hyung27",
        androidApp: "https://play.google.com/store/apps/details?id=com.bitsmedia.android.muslimpro",
        iOSApp: "https://apps.apple.com/id/app/muslim-pro-al-quran-adzan/id388389451?|=id",
        emojis: [],
        isAvatar: 0,
    },

    default: {
        newsletterJid: "120363361999470509@newsletter",
        defaultUser: {
            name: "Unknown",
            premium: false,
            owner: false,
            banned: false,
            limit: 0,
            chat: 0,
        }
    }
};

define.default.defaultUser.limit = define.options.limit;

export default define;