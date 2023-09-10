import { Stat } from "../data_types";

const fs = require("fs");

const filePath = "../data/stat.json";
let StatData: Record<number, Stat> = {};

let loadStatData = () => {
  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // File exists, so read its data
    fs.readFile(filePath, "utf8", (err: any, data: any) => {
      if (err) {
        console.log(`Error reading stat.json from file: ${err}`);
      } else {
        // Parse the JSON data
        const parsedData: Record<number, Stat> = JSON.parse(data);

        // Assign the parsed data to the StatData object
        StatData = parsedData;
        console.log(`Loaded StatData from file.`);
      }
    });
  } else {
    // File doesn't exist, create an empty one
    const emptyData: Record<number, Stat> = {};
    fs.writeFileSync(filePath, JSON.stringify(emptyData), "utf8");
    console.log(`Created an empty stat.json file.`);
  }
};

let getStats = (req: any, res: any) => {
  let key = req.params.key;

  if (!StatData[key]) {
    let zeroData: Stat = {
      small_beers: 0,
      big_beers: 0,
      beef_jerky: 0,
    };
    res.json(zeroData);
    return;
  }

  res.json(StatData[key]);
  return;
};

// Get the key for the data that has format yyyymm
let getKey = () => {
  let currentDate = new Date();

  // Get the year and month as numbers
  let currentYear = currentDate.getFullYear();
  let currentMonth = currentDate.getMonth() + 1;

  return currentYear * 100 + currentMonth;
};

let verifyDate = (key: number) => {
  if (!StatData[key]) {
    let zeroData: Stat = {
      small_beers: 0,
      big_beers: 0,
      beef_jerky: 0,
    };

    StatData[key] = zeroData;
  }
};

// Increment the number of small beers that were consumed during current month
let incrementSmallBeer = () => {
  let key: number = getKey();
  verifyDate(key);

  StatData[key].small_beers++;

  saveStat();
};

// Increment the number of big beers that were consumed during current month
let incrementBigBeer = () => {
  let key: number = getKey();
  verifyDate(key);

  StatData[key].big_beers++;

  saveStat();
};

// Increment the number of beef jerky that were consumed during current month
let incrementBeefJerky = () => {
  let key: number = getKey();
  verifyDate(key);

  StatData[key].beef_jerky++;

  saveStat();
};

// Save stat data
let saveStat = () => {
  let jsonData = JSON.stringify(StatData, null, 2); // Indent with 2 spaces for readability

  fs.writeFile(
    filePath,
    jsonData,
    "utf8",
    (err: NodeJS.ErrnoException | null) => {
      if (err) {
        console.error(`Error saving person data to file: ${err.message}`);
      } else {
        console.log("Stat data saved to file.");
      }
    }
  );
};

export { loadStatData, getStats, incrementBeefJerky, incrementBigBeer, incrementSmallBeer };
