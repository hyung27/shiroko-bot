const def = {
    options: {
        owner: ["6285786153616", "6285797442902", "6283824196477"],
        sessionName: "sessions",
        prefix: /^[!?@#.]/i,
        pairingNumber: "6285220188676",
        botName: "Shiroko Bot",
        ownerName: "X - Dev",
        thumbnail: "https://raw.githubusercontent.com/Fahmi-XD/Fahmi-XD/refs/heads/main/database/aroo.jpg",  // Ubah jadi foto botmu atau foto apa aja
        thumbnailDocument: "https://raw.githubusercontent.com/Fahmi-XD/Fahmi-XD/refs/heads/main/database/arona-low.png",  // Ini untuk dokumen yang memakai foto seperti tampilan menu, dan harus menggunakan foto yang 1:1 dan memiliki size kecil. contoh : 320px x 320px
        newsletterJid: "120363361999470509@newsletter",
        newsletterName: "🔥 Lighweight Whatsapp bot",
        ownerLink: "https://github.com/hyung27",
        systemLimit: true, // Mengaktifkan system limit
        limit: 100, // Jumlah limit untuk setiap user
        menuType: 2, // 1, 2

        // pairingNumber: "6285643797514",
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

    message: {
        forwarded: true,
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

def.default.defaultUser.limit = def.options.limit;

export default def;