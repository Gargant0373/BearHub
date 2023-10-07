import { PersonData, hashPassword } from "./person";

const fs = require("fs");

const filePath = "../data/stat.json";

let CustomizeData = {
    prices: {
        small: 5,
        big: 8,
        jerky: 15,
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

    let small: number = req.query.small;
    let big: number = req.query.big;
    let jerky: number = req.query.jerky;

    if(!small || !big || !jerky) {
        res.json({ small_beers: -1, big_beers: -1, beef_jerky: -1 });
        return;
    }

    CustomizeData.prices.small = small;
    CustomizeData.prices.big = big;
    CustomizeData.prices.jerky = jerky;
    res.json(CustomizeData.prices);
    return;
}

export {getPrices, setPrices, loadStatData, CustomizeData};