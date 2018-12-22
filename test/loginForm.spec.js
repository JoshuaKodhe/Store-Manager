/*jshint esversion: 6 */

import faker from "faker";
import puppeteer from "puppeteer";

const APP = "http://127.0.0.1:5500/UI/index.html";

const lead = {
	email: faker.internet.email(),
	password: faker.internet.password(),
};

let page;
let browser;
const width = 1920;
const height = 1080;
let userEmail = "#email";
let userPassword = "#password";


beforeAll(async () => {
	browser = await puppeteer.launch({
		headless: false,
		slowMo: 80,
		args: [`--window-size=${width},${height}`]
	});
	page = await browser.newPage();
	await page.setViewport({
		width,
		height
	});
});

afterAll(() => {
	browser.close();
});



describe("Login form", () => {
	test("lead can submit login credentials", async () => {
		await page.goto(APP);
		await page.waitForSelector("form");
		await page.type(userEmail, lead.email);
		await page.type(userPassword, lead.password);
		await page.click("input[type=submit]");
	}, 1600000);
});