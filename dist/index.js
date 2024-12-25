/**
 * Name: Shiroko Bot
 * Created By: X-Dev
 * Copyright 2024 MIT License
*/

import cfonts from "cfonts";
import connectToWhatsApp from "./libs/connection.js";

cfonts.say("SHIROKO", {
    font: "shade",
    align: "center",
    color: ["cyan"],
});

async function start() {
    connectToWhatsApp();
}

start();
