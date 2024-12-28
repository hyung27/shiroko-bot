export default (handler) => {
  handler.add({
    cmd: ["f"],
    owner: true,
    typing: true,

    run: async ({ sock, sys }) => {
      const btn = sys.m;
      console.log("#### MAIN #####")
      console.log(JSON.stringify(btn, null, 2));
      console.log("#### QUOTED MESSAGE #####")
      console.log(JSON.stringify(btn?.quoted, null, 2));
      sys.text(JSON.stringify(btn, null, 2))
    },
  });
}