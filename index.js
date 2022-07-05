const puppeteer = require("puppeteer");
const express = require("express");

const app = express();


async function generateCode() {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    await page.goto("https://discord.com/login");
    await new Promise(_=>setTimeout(_, 500)); //Wait .5 seconds before getting code

    const el = await page.$(".qrCode-2R7t9S");
    const data = await el.getProperty("title");
    
    const code = await data.jsonValue();
    browser.close();
    return code;
}

async function start() {
    
    app.get("/", async (req, res) => {
        let data = `
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${await generateCode()}">
        `
        res.status(200).send(data);
    })
    
    app.listen(80);
}

start();