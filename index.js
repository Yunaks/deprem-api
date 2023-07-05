const axios = require("axios");
const express = require("express");
const cheerio = require("cheerio");

const app = express();
const port = 3000;

async function depremget() {
  let response = await axios.get("https://deprem.afad.gov.tr/last-earthquakes.html");
  let data = response.data;
  const $ = cheerio.load(data);

  const trList = $('body > div.mainContainer > table > tbody > tr');
  let earthquakeData = [];

  trList.each(function() {
    let earthquake = {
      tarih: $(this).find('td:nth-child(1)').text().trim(),
      enlem: $(this).find('td:nth-child(2)').text().trim(),
      boylam: $(this).find('td:nth-child(3)').text().trim(),
      derinlik: $(this).find('td:nth-child(4)').text().trim(),
      tip: $(this).find('td:nth-child(5)').text().trim(),
      büyüklük: $(this).find('td:nth-child(6)').text().trim(),
      yer: $(this).find('td:nth-child(7)').text().trim(),
    };
    earthquakeData.push(earthquake);
  });

  return earthquakeData;
}

app.get("/depremlist", async (req, res) => {
  try {
    let data = await depremget();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching earthquake data." });
  }
});

app.listen(port, () => {
  console.log(`Started http://localhost:${port}`);
});
/// developed by yunak