import { Beer } from "../data_types";

const fs = require("fs");

const filePath = "../data/beer.json";
let BeerData: Record<string, Beer> = {};

let loadBeerData = () => {
  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // File exists, so read its data
    fs.readFile(filePath, "utf8", (err: any, data: any) => {
      if (err) {
        console.log(`Error reading beer.json from file: ${err}`);
      } else {
        // Parse the JSON data
        const parsedData: Record<string, Beer> = JSON.parse(data);

        // Assign the parsed data to the StatData object
        BeerData = parsedData;
        console.log(`Loaded BeerData from file.`);
      }
    });
  } else {
    // File doesn't exist, create an empty one
    const emptyData: Record<string, Beer> = {};
    fs.writeFileSync(filePath, JSON.stringify(emptyData), "utf8");
    console.log(`Created an empty beer.json file.`);
  }
};

let getBeers = (req: any, res: any) => {
  res.status(200).json(BeerData);
}

let getBeer = (req: any, res: any) => {
  let name = req.params.name;

  if (!BeerData[name]) {
    let zeroData: Beer = {
      small_beers: 0,
      big_beers: 0,
      beef_jerky: 0,
      to_pay: 0,
    };
    res.json(zeroData);
    return;
  }

  res.json(BeerData[name]);
  return;
};

let payBeer = (req: any, res: any) => {
  let name = req.params.name;

  if (!BeerData[name]) {
    res.status(404).send("Person not found");
    return;
  }

  BeerData[name].to_pay = 0;

  res.status(200).send("Payment successful");
  return;
}

let deleteBeer = (req: any, res: any) => {
  let name = req.params.name;

  if (!BeerData[name]) {
    res.status(404).send("Person not found");
    return;
  }

  delete BeerData[name];

  res.status(200).send("Person deleted");
  return;
}

let verifyConsumer = (name: string) => {
  if (!BeerData[name]) {
    let zeroData: Beer = {
      small_beers: 0,
      big_beers: 0,
      beef_jerky: 0,
      to_pay: 0,
    };

    BeerData[name] = zeroData;
  }
};

// Increment the number of small beers consumed by a specific consumer
let increaseSmallBeer = (name: string) => {
  verifyConsumer(name);

  BeerData[name].small_beers++;

  saveBeer();
};

// Increment the number of big beers consumed by a specific consumer
let increaseBigBeer = (name: string) => {
  verifyConsumer(name);

  BeerData[name].big_beers++;

  saveBeer();
};

// Increment the number of beef jerky consumed by a specific consumer
let increaseBeefJerky = (name: string) => {
  verifyConsumer(name);

  BeerData[name].beef_jerky++;

  saveBeer();
};

// Increment the number of small beers consumed by a specific consumer
let increaseToPay = (name: string, amount: number) => {
  verifyConsumer(name);

  BeerData[name].to_pay += amount;

  saveBeer();
};

// Save beer data
let saveBeer = () => {
  let jsonData = JSON.stringify(BeerData, null, 2); // Indent with 2 spaces for readability

  fs.writeFile(
    filePath,
    jsonData,
    "utf8",
    (err: NodeJS.ErrnoException | null) => {
      if (err) {
        console.error(`Error saving beer data to file: ${err.message}`);
      } else {
        console.log("Beer data saved to file.");
      }
    }
  );
};

export {
  loadBeerData,
  getBeers,
  getBeer,
  payBeer,
  deleteBeer,
  increaseSmallBeer,
  increaseBigBeer,
  increaseBeefJerky,
  increaseToPay,
};
