import { Person } from "../data_types";
import * as crypto from "crypto";
import {
  incrementBeefJerky,
  incrementBigBeer,
  incrementSmallBeer,
} from "./stat";
import {
  increaseSmallBeer,
  increaseBigBeer,
  increaseBeefJerky,
  increaseToPay,
} from "./beer";
import { log } from "console";
import { CustomizeData } from "./customize";

const fs = require("fs");

const filePath = "../data/person.json";
let PersonData: Record<string, Person> = {};

let loadPersonData = () => {
  // Check if the file exists
  if (fs.existsSync(filePath)) {
    // File exists, so read its data
    fs.readFile(filePath, "utf8", (err: any, data: any) => {
      if (err) {
        console.log(`Error reading person.json from file: ${err}`);
      } else {
        // Parse the JSON data
        const parsedData: Record<string, Person> = JSON.parse(data);

        // Assign the parsed data to the PersonData object
        PersonData = parsedData;
      }
    });
  } else {
    // File doesn't exist, create an empty one
    const emptyData: Record<string, Person> = {};
    fs.writeFileSync(filePath, JSON.stringify(emptyData), "utf8");
    console.log(`Created an empty person.json file.`);
  }
};

let hashPassword = (password: string): string => {
  const sha256 = crypto.createHash("sha256");
  sha256.update(password, "utf8");
  return sha256.digest("hex");
};

let createPerson = (req: any, res: any) => {
  const name = req.params.name;

  if (name in PersonData) {
    res.status(409).send("Person already exists");
    return;
  }

  log({ name: name, action: "create", success: true });

  let newPerson: Person = {
    small_beers: 0,
    big_beers: 0,
    beef_jerky: 0,
  };

  PersonData[name] = newPerson;
  savePeople();
  res.status(201).send("Person created");
};

let getPerson = (req: any, res: any) => {
  const name = req.params.name;
  if (!(name in PersonData)) {
    res.status(404).send("Person not found");
    return;
  }
  res.json(PersonData[name]);
};

let getAllPeople = (req: any, res: any) => {
  let handler = req.query.handler;
  let password = req.query.password;

  if (!PersonData[handler]) {
    res.json({});
    return;
  }

  if (password === null || password === undefined) {
    let SoloPerson: Record<string, Person> = {};
    SoloPerson[handler] = PersonData[handler];
    res.json(SoloPerson);
    return;
  }

  if (PersonData[handler].password !== hashPassword(password)) {
    let SoloPerson: Record<string, Person> = {};
    SoloPerson[handler] = PersonData[handler];
    res.json(SoloPerson);
    return;
  }

  res.json(PersonData);
};

let checkPassword = (req: any, res: any) => {
  let name = req.params.name;

  // Check if person exists
  if (!(name in PersonData)) {
    res.status(404).json(false);
    return;
  }

  // Check if password is null
  if (
    PersonData[name].password === null ||
    PersonData[name].password === undefined
  ) {
    res.status(403).json(false);
    return;
  }

  let password = req.query.password;

  // Check if password is not provided
  if (password === null || password === undefined) {
    res.status(400).json(false);
    return;
  }

  let hashedPassword = hashPassword(password);

  // Check if password matches
  if (PersonData[name].password !== hashedPassword) {
    res.json(false);
    return;
  }

  res.status(200).json(true);
};

let setPassword = (req: any, res: any) => {
  let name = req.params.name;

  // Check if person exists
  if (!(name in PersonData)) {
    res.status(404).send("Person not found");
    return;
  }

  let password = req.query.password;

  // Check if password is not provided
  if (password === null || password === undefined) {
    res.status(400).send("Password not provided");
    return;
  }

  let hashedPassword = hashPassword(password);

  // Check if password is null
  if (
    PersonData[name].password === null ||
    PersonData[name].password === undefined
  ) {
    PersonData[name].password = hashedPassword;
    res.status(200).send("Password set");
    log({ name: name, action: "set_password", success: true });
    savePeople();
    return;
  }

  let passwordOld = req.query.passwordOld;
  let hashedPasswordOld = hashPassword(passwordOld);

  // Check if password matches
  if (PersonData[name].password !== hashedPasswordOld) {
    res.status(403).send("Incorrect password");
    log({ name: name, action: "set_password", success: false, extra: "incorrect" });
    return;
  }

  PersonData[name].password = hashedPassword;
  log({ name: name, action: "set_password", success: true, extra: "changed" });
  savePeople();
  res.status(200).send("Password set");
};

let increment = (req: any, res: any) => {
  let name = req.params.name;
  let type = req.query.type;

  if (!PersonData[name]) {
    PersonData[name] = {
      small_beers: 0,
      big_beers: 0,
      beef_jerky: 0,
    }
  }

  switch (type) {
    case "small":
      PersonData[name].small_beers++;
      increaseToPay(name, CustomizeData.prices.small);
      incrementSmallBeer();
      increaseSmallBeer(name);
      break;
    case "big":
      PersonData[name].big_beers++;
      increaseToPay(name, CustomizeData.prices.big);
      incrementBigBeer();
      increaseBigBeer(name);
      break;
    case "jerky":
      PersonData[name].beef_jerky++;
      increaseToPay(name, CustomizeData.prices.jerky);
      incrementBeefJerky();
      increaseBeefJerky(name);
      break;
    default:
      res.status(404).send("Invalid increment type.");
      return;
  }

  savePeople();
  res.status(200).send("Incremented.");
};

let savePeople = () => {
  let jsonData = JSON.stringify(PersonData, null, 2); // Indent with 2 spaces for readability

  fs.writeFile(
    filePath,
    jsonData,
    "utf8",
    (err: NodeJS.ErrnoException | null) => {
      if (err) {
        console.error(`Error saving person data to file: ${err.message}`);
      }
    }
  );
};

export {
  PersonData,
  loadPersonData,
  createPerson,
  getPerson,
  getAllPeople,
  setPassword,
  checkPassword,
  increment,
  hashPassword,
};
