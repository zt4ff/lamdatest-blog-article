const assert = require("assert")
const webdriver = require("selenium-webdriver")

const {capabilities: caps, LT_ACCESS_KEY, LT_USERNAME} = require("../conf/single.conf")

const buildDriver = function (caps) {
  return new webdriver.Builder()
    .usingServer(`https://${LT_USERNAME}:${LT_ACCESS_KEY}@hub.lambdatest.com/wd/hub`)
    .withCapabilities(caps)
    .build();
};

const demoUser = {
  firstname: "Demo",
  lastname: "User",
  email: "demouser14889@demo.com",
  telephone: "12345566",
  password: "demouser1234",
  confirm: "demouser1234",
};

describe("Make Order " + caps.browserName, function () {
  let driver;
  this.timeout(0);

  beforeEach(function (done) {
    caps.name = this.currentTest.title;
    driver = buildDriver(caps);
    done();
  });

  it("can add to shopping cart", async function () {
    await driver.get("https://ecommerce-playground.lambdatest.io");
    await driver.findElement(webdriver.By.css('[title="MacBook Pro"]')).click();
    await driver.findElement(webdriver.By.css("#entry_216842 > button")).click();
    const cartIcon = await driver.findElement(webdriver.By.css(".cart-icon"));
    const cartIconProductCount = await cartIcon.getText();

    assert.equal(cartIconProductCount.trim(), "1");
  });

  it("should register a new user", async function () {
    await driver.get("https://ecommerce-playground.lambdatest.io/index.php?route=account/login");
    await driver.findElement(webdriver.By.css("#column-right a:nth-child(2)")).click();

    Object.keys(demoUser).forEach(async function (key) {
      await driver.findElement(webdriver.By.name(key)).sendKeys(demoUser[key]);
    });
    await driver.findElement(webdriver.By.css('label[for="input-agree"]')).click();
    await driver.findElement(webdriver.By.css('input[value="Continue"]')).click();
    const successMessageElement = await driver.findElement(webdriver.By.css("#content > h1"));
    const successMessageElementTextContent = await successMessageElement.getText();

    assert.equal(successMessageElementTextContent.trim(), "Your Account Has Been Created!");
  });

  afterEach(function (done) {
    if (this.currentTest.isPassed()) {
      driver.executeScript("lambda-status=passed");
    } else {
      driver.executeScript("lambda-status=failed");
    }
    driver.quit().then(function () {
      done();
    });
  });
});
