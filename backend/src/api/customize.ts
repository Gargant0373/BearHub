import { PersonData, hashPassword } from "./person";

const fs = require("fs");

const filePath = "../data/stat.json";

let CustomizeData = {
  prices: {
      small_beer: 5,
      big_beer: 8,
      beef_jerky: 15,
  },
}

let loadStatData = () => {
    // Check if the file exists
    if (fs.existsSync(filePath)) {
      // File exists, so read its data
      fs.readFile(filePath, "utf8", (err: any, data: any) => {
        if (err) {
          console.log(`Error reading stat.json from file: ${err}`);
        } else {
          // Parse the JSON data
          const parsedData = JSON.parse(data);
  
          // Assign the parsed data to the StatData object
          CustomizeData = parsedData;
        }
      });
    } else {
      // File doesn't exist, create an empty one
      const emptyData = CustomizeData;
      fs.writeFileSync(filePath, JSON.stringify(emptyData), "utf8");
      console.log(`Created an empty stat.json file.`);
    }
  };

let getPrices = (req: any, res: any) => {
    res.json(CustomizeData.prices);
    return;
}

let setPrices = (req: any, res: any) => {
    let handler = req.query.handler;
    let password = req.query.password;

    if (!PersonData[handler] || !PersonData[handler].admin || !PersonData[handler].password || PersonData[handler].password !== hashPassword(password)) {
        res.json({ small_beers: -1, big_beers: -1, beef_jerky: -1 });
        return;
    }

    let small_beer: number = req.query.small_beer;
    let big_beer: number = req.query.big_beer;
    let beef_jerky: number = req.query.beef_jerky;

    if(!small_beer || !big_beer || !beef_jerky) {
        res.json({ small_beers: -1, big_beers: -1, beef_jerky: -1 });
        return;
    }

    CustomizeData.prices.small_beer = small_beer;
    CustomizeData.prices.big_beer = big_beer;
    CustomizeData.prices.beef_jerky = beef_jerky;
    res.json(CustomizeData.prices);
    return;
}

export {getPrices, setPrices, loadStatData, CustomizeData};