# shiroko-bot


### Shiroko ESM WhatsApp Bot

> **Kalau ada yang error harap hubungi owner sc**

# Plugin handler

Contoh:

```Javascript
export default (handler) => {
  handler.add({P
    cmd: ["cmd"],
    cats: ["Category"],
    typing: true,
    
    run: async ({ sys, m, ...etc }) => {
      // Kode
    }
  })
}
```

## Variabel
```Javascript
let extendPluginsDefault = {
    /** Function lokal yang hanya bisa diginakan di file plugins yang sama */
    func: [],

    /** Function yang akan di inisialisasi atau dijalankan pertama kali ketika ada perintah seperti .menu */
    funcInit: [],

    /** Function utama */
    run: async () => { },

    /** Function khusus untuk public atau user ( Jika ingin membuat function khsus untuk user / public yang berbeda dengan owner ) */
    publicRun: async () => { },
    
    /** Command */
    cmd: [],
    
    /** Kategory untuk command */
    cats: [],
    
    /** isOwner? true berarti hanya owner yang bisa menggunakan perintah tertentu */
    owner: false,
    
    /** isPremium ? true berarti hanya user premium yang bisa menggunakan */
    premium: false,
    
    /** true = command setidaknya harus memasukan 1 argument pada commandnya */
    args: false,
    
    /** true = Pesan apapun akan langsung mengtrigger function utama */
    pass: false,
    
    /** false = Menonaktifkan command / plugin */
    active: true,
    
    /** true = Tampilkan `Sedang mengetik ...` untuk command ini */
    typing: false,
    
    /** type spesifik untuk command ["ALL"] = semua media / pesan ["IMAGE", "VIDEO", "STICKER", "ALL", "AUDIO"] */
    type: ["ALL"],
    
    /** Setting limit untuk pemakaian command, limit: true berarti akan mengurangi 1 limit setiap user menjalankan fitur, limit: 5 berarti mengurangi 5 limit */
    limit: true,
}
```

# sys
## reply
  Mengirim pesan teks
  ```Typescript
  sys.text(text: string, ephe?: boolean, jid?: string)
  ```
  - text: Pesan yang ingin dikirim
  - ephe: Setting `true` akan mengaktifkan pesan sementara ( opsional )
  - jid: Jid pengirim ( opsional )
   
## sticker
  Mengirim pesan stiker
  ```Typescript
  sys.sticker(buffer: Buffer | string, ephe: boolean, jid?: string)
  ```
  - buffer: media berbentuk `buffer`
  - ephe: Setting `true` akan mengaktifkan pesan sementara ( opsional )
  - jid: Jid pengirim ( opsional )

## Penjelasan:
 - handler.add : Menambahkan command atau plugin baru.
 - handler.func : ( Opsional ) Memisahkan kode utama ( run ) sehingga lebih rapih dan mudah dibaca.<br><br>
 Contoh:
 ```Javascript
export default (handler) => {
  handler.add({
    cmd: [["cmd", "aliasCmd"]],
    cats: ["Category"],
    typing: true,
    
    run: async ({ sys, m, exp }) => { // Sertakan exp
      sys.reply(exp.helloWorld());
    }
  });

  handler.func(({ exp }) => { // Sertakan exp
    exp.helloWorld = () => {
      return "Hello World";
    }
  });
}
 ```

 > **Penting: Semua fungsi yang dideklarasi di dalam handler.func() hanya bisa di akses di dalam file itu sendiri, jadi tidak bisa diakses oleh file plugin lain**

 - cmd : Format `cmd` harus berbentuk `Array`, jika ingin menambahkan alias untuk cmd kamu tinggal tambah Array baru di didalamnya ( Array 2D ), sehingga akan ditampilkan sebagai command alias.
```Javascript
 cmd: [["chatgpt", "gpt"]]
 ```
> **Tampilan menu: .chatgpt | gpt**