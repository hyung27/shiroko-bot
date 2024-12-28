import Axios from "axios"

export default (handler) => {
  handler.add({
    cmd: [
      "animdiffv2",
      "fluxdev"
    ],
    cats: ["Image Gen AI"],
    premium: true,
    typing: true,

    run: async ({ sys, exp }) => {
      try {
        const modelAlias = {
          "animdiffv2": "Animagine XL",
          "fluxdev": "Flux Dev"
        }
        let prov = "";

        if (["animdiffv2"].includes(sys.cmd)) {
          prov = "cagliostrolab"
        } else if (["fluxdev"].includes(sys.cmd)) {
          prov = "black-forest-labs"
        }
        const model = "";
        const prompt = sys.nbody;
  
        sys.text("> Proses ini akan memakan waktu yang lama mohon bersabar...")
        const result = await exp.ai(prov, model, prompt);
        const output = typeof result === 'object' ? JSON.stringify(result, null, 2) : result;
        sys.image(`> ${modelAlias[sys.cmd]}

> *Prompt:* ${prompt}`, output);
      } catch (error) {
        console.error("Error:", error.message);
        sys.text("> Terjadi kesalahan dalam mendapatkan respons.");
      }
    }
  })

  handler.func(async ({ exp }) => {
    class API {
      constructor() {
        this.hashToken = "";
        this.zeroGpuToken = "";
        this.verifyToken = "";
        this.challengeToken = {};
        this.api = "";
        this.apiEvent = "";
        this.finalApi = "";
        this.challengeApi = ""
        this.verifyApi = ""
        this.jwtApi = "";
        this.dataSubmit = {};
    
        this.provider = {
          "cagliostrolab": {
            api: "https://huggingface.co/spaces/cagliostrolab/animagine-xl-3.1",
            apiEvent: "https://cagliostrolab-animagine-xl-3-1.hf.space/queue/join?__theme=light",
            finalApi: "https://cagliostrolab-animagine-xl-3-1.hf.space/queue/data",
            challengeApi: "https://de5282c3ca0c.de3fbe28.ap-southeast-1.token.awswaf.com/de5282c3ca0c/526cf06acb0d/inputs",
            verifyApi: "https://de5282c3ca0c.de3fbe28.ap-southeast-1.token.awswaf.com/de5282c3ca0c/526cf06acb0d/verify",
            jwtApi: "https://huggingface.co/api/spaces/cagliostrolab/animagine-xl-3.1/jwt",
            data: (prompt, model, session) => {
              return {
                "data": [
                prompt,
                "(deformed iris, deformed pupils, semi-realistic, cgi, 3d, render, sketch, cartoon, drawing, anime:1.4), text, close up, cropped, out of frame, worst quality, low quality, jpeg artifacts, ugly, duplicate, morbid, mutilated, extra fingers, mutated hands, poorly drawn hands, poorly drawn face, mutation, deformed, blurry, dehydrated, bad anatomy, bad proportions, extra limbs, cloned face, disfigured, gross proportions, malformed limbs, missing arms, missing legs, extra arms, extra legs, fused fingers, too many fingers, long neck",
                Math.floor(Math.random() * 2147483647),
                1024,
                1024,
                7,
                28,
                "DPM++ 2M SDE Karras",
                "896 x 1152",
                "(None)",
                "Standard v3.1",
                true,
                0.55,
                1.5,
                true
              ],
              "event_data": null,
              "fn_index": 5,
              "trigger_id": 49,
              "session_hash": session
              }
            },
          },
          "black-forest-labs": {
            api: "https://huggingface.co/spaces/black-forest-labs/FLUX.1-dev",
            apiEvent: "https://black-forest-labs-flux-1-dev.hf.space/gradio_api/queue/join?__theme=light",
            finalApi: "https://black-forest-labs-flux-1-dev.hf.space/gradio_api/queue/data",
            challengeApi: "https://de5282c3ca0c.de3fbe28.ap-southeast-1.token.awswaf.com/de5282c3ca0c/526cf06acb0d/inputs",
            verifyApi: "https://de5282c3ca0c.de3fbe28.ap-southeast-1.token.awswaf.com/de5282c3ca0c/526cf06acb0d/verify",
            jwtApi: "https://huggingface.co/api/spaces/black-forest-labs/FLUX.1-dev/jwt",
            data: (prompt, model, session) => {
              return {
                "data": [
                  prompt,
                  0,
                  true, 
                  1024, 
                  1024, 
                  3.5, 
                  28
                ], 
                "event_data": null, 
                "fn_index": 2, 
                "trigger_id": 5, 
                "session_hash": session
              }
            },
          },
          "lora": {
            api: "https://huggingface.co/spaces/black-forest-labs/FLUX.1-dev",
            apiEvent: "https://black-forest-labs-flux-1-dev.hf.space/gradio_api/queue/join?__theme=light",
            finalApi: "https://black-forest-labs-flux-1-dev.hf.space/gradio_api/queue/data",
            challengeApi: "https://de5282c3ca0c.de3fbe28.ap-southeast-1.token.awswaf.com/de5282c3ca0c/526cf06acb0d/inputs",
            verifyApi: "https://de5282c3ca0c.de3fbe28.ap-southeast-1.token.awswaf.com/de5282c3ca0c/526cf06acb0d/verify",
            jwtApi: "https://huggingface.co/api/spaces/black-forest-labs/FLUX.1-dev/jwt",
            data: (prompt, model, session) => {
              return {
                "data": [
                  "1girl, (ulzzang-6500:0.7), kpop idol, yae miko, detached sleeves, bare shoulders, pink hair, long hair, japanese clothes, best quality, (painting:1.5), (hair ornament:1.35), jewelry, purple eyes, earrings, breasts, torii, cherry blossoms, lantern light, depth of field, detailed face, face focus, ribbon_trim, (looking at viewer:1.25), nontraditional miko, shiny skin, long sleeves, smile, thick lips, game cg, hands on lips, east asian architecture, (blurry background:1.2), sitting, upper body, <lora:YaeMiko_Test:1.00>, ", 
                  "bright lantern, brightness, (nipples:1.2), pussy, EasyNegative, (worst quality:2), (low quality:2), (normal quality:2), lowres, normal quality, ((monochrome)), ((grayscale)), skin spots, acnes, skin blemishes, age spot, glans,extra fingers, fewer fingers, strange fingers, bad hand, bare thighs", 
                  1, 
                  28, 
                  7, 
                  false, 
                  -1, 
                  "loras/YaeMiko_Test.safetensors", 
                  1, 
                  "", 
                  1, 
                  "", 
                  1, 
                  "", 
                  1, 
                  "", 
                  1, 
                  "DPM++ SDE", 
                  "Automatic", 
                  "Automatic", 
                  1152, 896, 
                  "votepurchase/ChilloutMix", 
                  "None", 
                  "txt2img", 
                  null, 
                  null, 
                  512, 
                  1024, 
                  null, 
                  null, 
                  null, 
                  0.55, 
                  100, 
                  200, 
                  0.1, 
                  0.1, 
                  1, 
                  0, 
                  1, 
                  false, 
                  "Classic", 
                  null, 
                  1, 
                  100, 
                  10, 
                  30, 
                  0.55, 
                  "Use same sampler", 
                  "", 
                  "", 
                  false, 
                  true, 
                  1, 
                  true, 
                  false, 
                  true, 
                  false, 
                  false, 
                  "model,seed", 
                  "./images", 
                  false, 
                  false, 
                  false, 
                  true, 
                  1, 
                  0.55, 
                  false, 
                  false, 
                  false, 
                  true, 
                  false, 
                  "Use same sampler",
                   false, 
                  "", 
                  "", 
                  0.35, 
                  false, 
                  true, 
                  false, 
                  4, 
                  4, 
                  32, 
                  false, 
                  "", 
                  "", 
                  0.35, 
                  false, 
                  true, 
                  false, 
                  4, 
                  4, 
                  32, 
                  true, 
                  null, 
                  null, 
                  "plus_face", 
                  "original", 
                  0.7, 
                  null, 
                  null, 
                  "base", 
                  "style", 
                  0.7, 
                  0, 
                  false, 
                  false, 
                  59
                ], 
                "event_data": null, 
                "fn_index": 50, 
                "trigger_id": 74, 
                "session_hash": session
              }
            },
          },
        }
      }
    
      getProvider(prov) {
        return this.provider[prov]
      }
    
      generateToken(length = 10) {
        return Math.random().toString(36).substring(2);
      }
    
      async getChallenge() {
        const getToken = await Axios({
          method: "GET",
          url: this.challengeApi,
          responseType: "json",
          params: {
            client: "browser",
          },
          maxBodyLength: Infinity,
          headers: {
            authority: this.challengeApi.match(/https:\/\/([\S\s]+\.com)/i)[1],
            accept: "*/*",
            "accept-encoding": "gzip, deflate, br, zstd",
            "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7,ru;q=0.6",
            origin: "https://huggingface.co",
            priority: "u=1, i",
            referer: "https://huggingface.co/",
            "sec-ch-ua":
              '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "user-agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
          },
        });
    
        return getToken.data.challenge;
      }
    
      async getVerify() {
        const getToken = await Axios({
          method: "POST",
          url: this.verifyApi,
          responseType: "json",
          data: {
            challenge: this.challengeToken,
            solution: "0",
            signals: [
              {
                name: "KramerAndRio",
                value: {
                  Present:
                    "pFPaHmSlpmUWA7mp::efa7cfc5b9e96df338acd4aee702fcdf::797a6ea6672aa7abcb63d49dbee1bebe98e0eafd649c040310783a6831f407e9be4195f02fca1604f376a96563d14f2425fe4e4f81f480c6192dd4751367b8677546e41e5edd51ac9d6770f55f81d3f4805ac10cd8a52c588a1666c14d8fabebea5928614f788cac951d38cad07d873e2640bb28c8bb2dd4df6971d242a577b82d334e38bcba8c4ca0e872c99e32abb916e6923f7c287c2dd41f59cc5feb8b510d40295099a3af2b7e2eddb4c15b0d9222bd9b412c22c03eb38315c9c89a5ee2e0e3a8f0a4db33980b5a8a57b37647ba935f77a1e8da498d023e0a65d051d65ba311bceae556c7cd4da47ef73bb411834997b55e3434418fc8da424edee49075c8198fac3359daf2b204ae68a34ae4a55d396eb634c6a2c32ecbb0d023c53fba7c8376c6344cad9c6cf20d1a9d3e5ea682e37d2cd4868c8944587c377881906fc8931b58a9e02972d0fde00f99121ee0dcadbaf9c889cd189babbf15bfdd50a59c36c7d83774a2e8f24cc402820d78775e4a70ac968683b8280ec8f527b9d43245dd9a2b9b11f348f0febca12f7e0b83328079465b204c2e38f82fbb7bddfab89b9ef9d27427d5e31ba10ce06ef591b04c686df61d4edfab5b81e7616470ffd66c862113f67c7c94b86be935163830d5f02f81d29d1da2056ca7338813667c3df18121aee1953358aad5b40112a4534c89f28e011e31077d2daf324d004489de49f7e83a5f9972f400319a7382eaa786bfb6bba9485c060be6322fe6021f77748fa1f4e3a2ff8cd0023937e01f551bf78c2ec9fcee7924a196addd41ce395c835979d03516931017c2dd9ce0381dbfdc14841949d6499ea30e09da91f396c5dc3e7bdec062d616584c656ede4cec92d3fdc9e409b51a044860796f7b0d7873fb080bd7a5ee6480f896198bd130ad74a6a5e7f3a4b1e944bd9f42583e247b8ff21ed4add1644ce4d818af0cb2637649cecad2997a24c049bcaaa97abb7c3339b0e5d5ff802376550a5a7d15d457a01bf01eb5514951773ae2899f0627912e8f3126acfe586dff1c55da38c32233730f8d3b480c0890abbd0bd2a5a2d1e7ad718bf88be07d93a8cf68277a06a1263385b294a74d0ad21568815e0ef97e4275b42de6bd78ff77adac1e48a8c750c6e426c5455f005f649d4668747674c55e88132ccfd52270c1197b1d50d0b3bfef9490cbe037149486b0e2824c0bb5af688c583d004c74d61ccd5547fba2b7d1a1fdf03837263da3467a6597017780c9fad2da3c9c77753e63422e2fe2326c2b4928767e1865f7fcff6247065d2e50bfb386e7adb031420f99ab6bc80a9731d59c990abbdff8e91fbb301730cc883e7dc7a4d4191c3c43a17d2c3d9874db3f0c206e62efb66a6c7637c28d31beb3167d6930aa308701a1ae7c677e7871441f5ef932300c21d850fe4bbf233fa2b293f448e332d15556ce7970441efd5e7426b24e3edf62870184ed496ad76e682127f1c74761534d3a761c5c551c76fca46c108912adbaa61cb574cfd3e28024e3ed91d2095a9a6826609e0a66ce1e14a3d146fa5ff87d1fcc1223592ea17807be04b57cd9484680841ac50b74a5241c9b8430fbdef2442f630d3cc0724412c3b1a7bb64c0bbc354e4700a62c84adbbd12f0ac9ed172e8cd02022c5b63d2134eb7541b578112629597aead6f75f4d3317d99ecd6157270c7042973fcdeb320ba2e833a5f493d2fe682e6c1a60eee105afca03548753d40108c065c1bb69fa6d7eb0b3271d1c6f47dd63d9cf7bfdfb83c900fb119f81c6ff67ccf07721fb97a005c03b0cac764d972c9e3a053c95766949a1888cf2fcc5cb5f821fd0f46292a987dcc58d5dd892a95fe2abbb18cbc9911833d4a06ed7374f20020b2f5551a6fa9726cb261f6f7c93894377da597f201e8d178eec5f62bae4406aa321a0dc778ca6d26f3d18dfe8d388b1de9aecabcb2d21670775d1285938a201cb1fae16eedca5d3c13212b480eb8dd749a43d2e3d21f488c35a173578ebaf70a62d537b4ca9b745bfdb86d09450573aad7b39f83701f5053fd21cde3609c182f3068aab471b207b21fdf8c90de0862f75c7ffc72e31ae946c98db8f9fb6275d5684a0beb70f1839584268869ed829d3017a6c61a959a90da5316232455f93af64ba0c14eecef3ddfcf1b54fd4301c2c2dc36f0af848cf190a83034a042788f8430793e6e6cd1adc8c82b235fe33982608d9a2d6c3437686723d54c88d98092194e7ce6fc838ea8e195711f6f51dab2d304d681aaf8a3e65624da74ffb42fcc4ab509810cd121cde47413d1c5ee793fa18a59c08d64bb7e62278fa46f49214227eb0406bd6ae28cd8ef039731c14f624423922ae0eeb06cd8defc2124ac63fde5722741dcdc05230fb876a8d579025224850b3ff3a64d91588cbe2258de59b56a2f4ebd880e1a13c1138013fdc234f8a95aa169fe7829f85d48027a53da3e04c0d035cf07f5a06f4f3f573444ad70ef56e7286a3eb83a56f80bc937122ad7c92af63404f64b701278b11fd0b1d07bcb8559c4226b3d522a27a58dbca822123e34fcb2924922fdb584e33ee42e5aef160565c092c9b9926ced94083ba14265766f8b8a9bf0e326c094435a2b1095012633b12d7876c9c65622bff6c7b81572a38cfa8d766919350046aa040c22b48e43efc6155b275957a4a94bdca461ecfd5bdba7bc7848863ae10e2d8be0bc8c849b7f1be14afe1e0977ad906ac491681d1d320ce6b95683f04c0795ff97f6d8318722df3896d15eb1954b359077bb875551906b5e155a9bbaa718bef6cc7543c4810c13be13efbf2dd090cc204f09c84c8df2c311b2386d7bde9af73f799e413e4fe6031adf7fb77e506ded917222476e4c3d2b9a8e25b28d5e50313cba7b54735db1593b9d8f6a138edccbfa3b3e7a335c33723acd1e041e9ddbe71a781353d42730f75d59aae1c64e667f4dc229dbf2a8b4e3ee51e2b7849863301fe7a961c5b242174a08b1362d1ae16a6a12bba430bebd058f3719c59ed1da52ffd92557210b725e753e191607c63cfd01763469e147bab8a740b06976baa6e45624fe8a03812429d44d6851871b854f74395a2543594797253deea8a5062b1066cfc6ee72e12f58e24bb49d3f5bfee5b208bcaa51dceac0855a5b843999035440c1feaefb417f4db6ec5e9da964341e68bf277283719e572dd7c0567ca4fb9b7da92f6820cf4f25bf931638cc9d5dc3d2adb717ed5c8e9b9bd1faff05adb221eb03214cf110a83fa10652bf33fb482e5c99128106cb817531a4cf0214721708baf7dee130a44c7316c5cf04f8ae9412bef0a10e143a3fb6107baaced56068d6b90f5109ff48756b880af0a1f34c07dc7a55cf66f19686fae020dbfbc2bcc2e4a3764ac94d1bc1b9bc94b1e4ce76b863cfdb394eb46a9212009ed6f11fabd1ac03c314718089a97af11a4103607f1ab8d85e26e1f21b782b50ba591f4617b4ff97f185a205b5a01cf27becb8e638fa48522e28b8ea0e96e60f151ef6e817da10ccf1787a202a54d80a8fc039b2d9a7806445d515ae30782399823339d5f6a71be1617f207f35f681a5d1512911f234119b09548795b34e0858a1bc52448559ed545aaefe9311e7d76c72180775d2ae67e3cb0c7b5ee4b3668835863b2a58548029aa5c0b23f752cd4e80399a3feeb1114bd1228d3563ab113952214fc7eaf537b9ce88ae698e5233283ea09ad739cd27ac6dbef31f036cced21bee589f9a9501530e5654477bf8a1354f3a10517ef32e1b6fcaff6310db3268bc8050d06426d5838f56431196c7807c1a787ea9b6c99a78b17b3476209c5eb57ad7df731d16e40b5622ca39cc22e7fd8006f1d90b50af290fffd0d1f89695b03a1107de403ec8b1e814e039337984733c39dd5d783f705162c329b74ed6846975bb2f36dd79b6d794a4be9587922369b0f1404206a49103a6ece8da5d91845234d40cc7f8dae989f6136fa5d236fb5a40276ba4ca38204e2da027feac4e6675fcd61382a90be1506fa2bc316124cc60c0bec1222d93b49cd01ff37dd50eded0123f2a26c5b08776ef7cc1435677b5aa56609261cf1174e2d657b2cb1bb5f643866dcabd1d88c3a303f6da7af8e0fb79bc9bb7588461b347233982d86ad622e17b0b2f0ec3be0d41130d25b6fabe2f853f0d88e16cb79f40ca785dca2fcba91027130e75a6fef39616e3c10a176acc0efc06d717343e2274d18ed96266f97991d43f3cc682739eaa89b22cc1f91858b3c369e5f10bf333ecd349a3a342109988e5673983d2062269117f303b36e21ee772b6785e66c9d6fd12c03cb685b25883d2e8f55bdc2f9d070e61a8d80dffcc768a43a15a2f9378b67146a767f8303d69d36e48810c666e7991614020c77dada116b6c044b3177a53667016c0e1979d92bf29b7be0dce3fae81bc3cbf4fed311428ef164eee9f3b745e93ba987dfbe6b20cee3f361a40173a0774de9aaa3db3f42d0d6cf1cd4d924041b7e24b00789da5b71ee7082443899d00eedb354b331943f5454d2d710390586a56c571ccbc822a5e03aa8e12ca7c6fd50589af053b45f0b8d09f0935f2a064026437c627f54c6888a1ec6fdbd9b46849205a28bfe5a9192cfc22b129a8fd87cca39e490e9ebf1f36401172841b861520892fdd8c3ecbb8b4e89f79f1a1f8a78d285a7a004a9f1786fdac162968ac809bba704051df8874805ff04a894060ee6e6698df7830b0b7d53a2073586058402b22499968ee42942ff68b9306f3471d1eb09b6cc15b6226ff4febf31b09c77c1c4754482f1e2ac6672d73c966cba9f25e37f88ed651ff79c2177fa29cc356cc61c8086be650cd381a4c456d726293c9c0882fd449d76a903f7d343d64ebcaf729996c6d3df588bf8eda589e1dd5e1be389b03eaaa55ed269a2071155605dd406ee32f0465417b3b4c5cdad6d08dd03fb5d585873f444d18bb1654a6afc9c8346dbc71f49ab3c5cf7fe9676104f02fed071dbf6ef7f0a14436bf7fd47b8691fc7fbec101095a8a56db4e5523980bc9617dc9433ac603b732a98bd7a14981e0f2b6c2a74f295b2632f0901f6fcb0b702ad7ad10e38be8f0390d2046bc15b00978c02d5ca3d429a2369c84772df3d8165651de0a27cbb195c050b32023bd2e23c8fbf7d70d16927e83b0ad09f069b8320da16a4dbf79561903ea45c767899ec8aea2a1d3eb85547efbeccc7d8b1dea32e777988605f89c28976512578b234b95e05c386901d456efb1c3c472316925d3bf99a3a8783020f8cd311bf81572d7dc0cddafd9916097a1520fc9fd4f311886706aa82aa51559782e040a9d2ee6782fcb7a63720570573f66c76c87c2b3e0e43fbfec6c5d7868d372e56240c515c9a394d48f98fc9d5a8c326378b58508bde7bf65721d889ac3833f",
                },
              },
            ],
            checksum: "A07615B7",
            existing_token:
              "bba51a9b-3d9b-4cc4-8b03-45c92d83647d:BgoAbO0+sGA2AAAA:0hvTeml7asVanQE3ZvDkJ9ZevQ57ECapX3UMoW2Y+lfXc8DxDKC9yPdXdgrNlulTCWMUCXYcRnMJxQWOYO1GjvInz2F9+GflW9IkQqTpKBjz8TRMBrtGgid8kl0lL+vtEXKZGAhZWYuFCqU8TjckAd+CMrM2ME4WR/BTXvBgVqIGMglDELQA1c0vrmAN7kR2nHsvVVtWjhRSynFqvn5RlkVeQFZuFcchrNn+fM/j1P8zx9QIxWkr6tydMf+D6nBLWN4pXdI=",
            client: "Browser",
            domain: "huggingface.co",
            metrics: [
              { name: "2", value: 0.800000011920929, unit: "2" },
              { name: "100", value: 3, unit: "2" },
              { name: "101", value: 1, unit: "2" },
              { name: "102", value: 1, unit: "2" },
              { name: "103", value: 12, unit: "2" },
              { name: "104", value: 0, unit: "2" },
              { name: "105", value: 0, unit: "2" },
              { name: "106", value: 0, unit: "2" },
              { name: "107", value: 0, unit: "2" },
              { name: "108", value: 0, unit: "2" },
              { name: "undefined", value: 1, unit: "2" },
              { name: "110", value: 0, unit: "2" },
              { name: "111", value: 27, unit: "2" },
              { name: "112", value: 2, unit: "2" },
              { name: "undefined", value: 1, unit: "2" },
              { name: "3", value: 9.200000017881393, unit: "2" },
              { name: "7", value: 1, unit: "4" },
              { name: "1", value: 68.90000000596046, unit: "2" },
              { name: "4", value: 18.200000017881393, unit: "2" },
              { name: "5", value: 0, unit: "2" },
              { name: "6", value: 87.10000002384186, unit: "2" },
              { name: "0", value: 2575.0999999940395, unit: "2" },
              { name: "8", value: 1, unit: "4" },
            ],
          },
          maxBodyLength: Infinity,
          headers: {
            authority: this.verifyApi.match(/https:\/\/([\S\s]+\.com)/i)[1],
            accept: "*/*",
            "accept-encoding": "gzip, deflate, br, zstd",
            "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7,ru;q=0.6",
            origin: "https://huggingface.co",
            priority: "u=1, i",
            referer: "https://huggingface.co/",
            "sec-ch-ua":
              '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "user-agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
          },
        });
    
        return getToken.data.token;
      }
    
      async getZeroGpuToken() {
        const now = new Date();
        const expirationTime = new Date(now.getTime() + 3600000);
        const formattedTime = encodeURIComponent(
          expirationTime.toISOString()
        );
    
        const getToken = await Axios({
          method: "GET",
          url: this.jwtApi + `?expiration=${formattedTime}&include_pro_status=true`,
          responseType: "json",
          maxBodyLength: Infinity,
          headers: {
            authority: "huggingface.co",
            accept: "*/*",
            "accept-encoding": "gzip, deflate, br, zstd",
            "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7,ru;q=0.6",
            cookie: `__stripe_mid=88d13bae-1228-4ecc-84f6-fbf7302e20436d8814; token=YApSmOjCunEczpScMydxGbdxDllIwmJihcZduqjgDRFOLNZwXOnisXGSGTkOvELAaMVlNRctOvKvLqUEhSweqgLdinjhMdXFiurCKNiiSmWFkqmbWHCCVvqGTqrOoctB; aws-waf-token=${this.verifyToken}`,
            priority: "u=1, i",
            referer: this.api,
            "sec-ch-ua":
              '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "user-agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
          },
        });
    
        // const html = await Axios.get(this.api)
        // const $ = await cheerio.load(html.data);
        // const divToken = $("div.SVELTE_HYDRATER.contents").attr("data-props")
        // const jh = await JSON.parse(divToken as string)
    
        return getToken.data.token;
      }
    }
    
    class TextToImage extends API {
      constructor() {
        super();
      }
    
      async HuggingFaceGen(prov, model, prompt) {
        let result = "";
        const useProvider = this.getProvider(prov);
    
        this.api = useProvider.api;
        this.apiEvent = useProvider.apiEvent;
        this.finalApi = useProvider.finalApi;
        this.challengeApi = useProvider.challengeApi;
        this.verifyApi = useProvider.verifyApi;
        this.jwtApi = useProvider.jwtApi;
        
        this.challengeToken = await this.getChallenge();
        this.verifyToken = await this.getVerify();
        this.hashToken = this.generateToken();
        this.zeroGpuToken = await this.getZeroGpuToken();
        this.dataSubmit = useProvider.data(prompt, model, this.hashToken);
    
        console.log(this.challengeToken);
        console.log(this.verifyToken);
        console.log(this.zeroGpuToken);
        console.log(this.hashToken);
    
        return new Promise(async (resolve, reject) => {
          await Axios({
            method: "POST",
            url: this.apiEvent,
            data: this.dataSubmit,
            responseType: "json",
            maxBodyLength: Infinity,
            headers: {
              authority: this.apiEvent.match(/https:\/\/([\S\s]+\.space)/i)[1],
              accept: "*/*",
              "accept-encoding": "gzip, deflate, br, zstd",
              "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7,ru;q=0.6",
              "content-type": "application/json",
              origin: this.apiEvent.match(/(https:\/\/[\S\s]+\.space)/i)[1],
              priority: "u=1, i",
              referer: this.apiEvent.match(/(https:\/\/[\S\s]+\.space)/i)[1] + "/?__theme=light",
              "sec-ch-ua":
                '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": '"Windows"',
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin",
              "user-agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
              "x-zerogpu-token": this.zeroGpuToken,
            },
          });
          // console.log(getEventId.data);
    
          const getFinish = await Axios({
            method: "GET",
            url: this.finalApi,
            params: {
              session_hash: this.hashToken,
            },
            responseType: "stream",
            maxBodyLength: Infinity,
            headers: {
              authority: this.finalApi.match(/https:\/\/([\S\s]+\.space)/i)[1],
              accept: "text/event-stream",
              "accept-encoding": "gzip, deflate, br, zstd",
              "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7,ru;q=0.6",
              "content-type": "application/json",
              priority: "u=1, i",
              referer: this.apiEvent.match(/(https:\/\/[\S\s]+\.space)/i)[1] + "/?__theme=light",
              "sec-ch-ua":
                '"Chromium";v="130", "Google Chrome";v="130", "Not?A_Brand";v="99"',
              "sec-ch-ua-mobile": "?0",
              "sec-ch-ua-platform": '"Windows"',
              "sec-fetch-dest": "empty",
              "sec-fetch-mode": "cors",
              "sec-fetch-site": "same-origin",
              "user-agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
            },
          });
    
          await getFinish.data.on("data", async (chunk) => {
            console.log(chunk.toString());
            const data = await chunk
              .toString()
              .split(/\r?\n/)
              .map((v) => {
                try {
                  return JSON.parse(v.slice(6).trim());
                } catch {
                  return null;
                }
              })
              .filter(Boolean);
            data.forEach((v) => {
              // console.log(v);
              if (v.msg == "process_completed") {
                result = v.output.data ? v.output.data : null;
              }
            });
          });
    
          await getFinish.data.on("end", () => {
            resolve(result);
          });
        });
      }
    }

    exp.ai = async function ai(prov, model, prompt) {
      try {
        let url = "";

        const imgGen = new TextToImage();
        const result = await imgGen.HuggingFaceGen(prov, model, prompt)
        
        switch (prov) {
          case "cagliostrolab":
            url = result[0][0].image.url;
            break
          case "black-forest-labs":
            url = result[0].url;
            break
        }
        console.log(url)
        return url
      } catch (error) {
          console.error("Terjadi kesalahan:", error.message);
          // return "Gagal mendapatkan respons dari AI.";
      }
    }
  })
}