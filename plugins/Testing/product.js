import config from "../../src/settings/config.js";
import axios from "axios";
import * as cheerio from "cheerio";

async function detailMemberJkt48() {
  try {
    const { data } = await axios.get('https://jkt48.com/member/detail/id/260?lang=id');
    const $ = cheerio.load(data);

    const result = {
      name: $('.entry-mypage_item').eq(0).find('.entry-mypage_item--content').text().trim(),
      birthdate: $('.entry-mypage_item').eq(1).find('.entry-mypage_item--content').text().trim(),
      bloodType: $('.entry-mypage_item').eq(2).find('.entry-mypage_item--content').text().trim(),
      horoscope: $('.entry-mypage_item').eq(3).find('.entry-mypage_item--content').text().trim(),
      height: $('.entry-mypage_item').eq(4).find('.entry-mypage_item--content').text().trim(),
      nickname: $('.entry-mypage_item').eq(5).find('.entry-mypage_item--content').text().trim(),
      twitter: $('#twitterprofile').find('a').attr('href'),
      instagram: $('.entry-mypage__history').eq(1).find('a').attr('href'),
      tiktok: $('.entry-mypage__history').eq(2).find('a').attr('href')
    };

    return result
  } catch (error) {
    return error.message;
  }
}

export default (handler) => {
  handler.add({
    cmd: ["tes"],
    owner: true,
    typing: true,

    run: async ({ sock, sys }) => {
      const gt = await detailMemberJkt48();
      console.log(gt)
    }
  })

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