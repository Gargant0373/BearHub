import { Beer } from "../data_types";
import { log } from "./log";
import { incrementMeter } from "./meter";
import { PersonData, createPerson } from "./person";

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
  let handler = req.query.handler;

  if (!BeerData[name]) {
    res.status(404).send("Person not found");
    log({ name: name, action: "pay", success: false, handler: handler });
    return;
  }

  if (!PersonData[handler] && PersonData[handler].admin !== true) {
    res.status(401).send("Unauthorized");
    log({ name: name, action: "pay", success: false, handler: handler });
    return;
  }

  BeerData[name].to_pay = 0;

  log({ name: name, action: "pay", extra: null, handler: handler });

  res.status(200).send("Payment successful");
  return;
}

let deleteBeer = (req: any, res: any) => {
  let name = req.params.name;
  let handler = req.query.handler;

  if (!BeerData[name]) {
    res.status(404).send("Person not found");
    log({ name: name, action: "delete", success: false, handler: handler });
    return;
  }

  if (!PersonData[handler] && PersonData[handler].admin !== true) {
    res.status(401).send("Unauthorized");
    log({ name: name, action: "delete", success: false, handler: handler });
    return;
  }

  delete BeerData[name];

  log({ name: name, action: "delete", success: true, handler: handler });

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

  incrementMeter(0.33);
  BeerData[name].small_beers++;
  log({ name: name, action: "increment", extra: "small" });

  saveBeer();
};

// Increment the number of big beers consumed by a specific consumer
let increaseBigBeer = (name: string) => {
  verifyConsumer(name);

  incrementMeter(0.5);
  BeerData[name].big_beers++;
  log({ name: name, action: "increment", extra: "big" });

  saveBeer();
};

// Increment the number of beef jerky consumed by a specific consumer
let increaseBeefJerky = (name: string) => {
  verifyConsumer(name);

  BeerData[name].beef_jerky++;
  log({ name: name, action: "increment", extra: "jerky" });

  saveBeer();
};

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
