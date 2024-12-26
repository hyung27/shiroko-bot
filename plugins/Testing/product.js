import config from "../../src/settings/config.js";

export default (handler) => {
  handler.add({
    cmd: ["product"],
    owner: true,
    typing: true,

    run: async ({ sock, sys }) => {
      console.log("Kanibal")
      sock.sendMessage(sys.from, {
        body: "Body",
        businessOwnerJid: sys.from,
        footer: "Footer",
        product: {
          currencyCode: "Rp",
          description: "Description",
          productId: "343056591714248",
          productImageCount: 1,
          priceAmount1000: 99999,
          salePriceAmount1000: 99999,
          title: "Title",
          url: config.options.thumbnail,
          productImage: {
            url: config.options.thumbnail
          }
        }
      })
    }
  })
}