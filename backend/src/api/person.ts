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

const fs = require("fs");

const prices = {
  small: 5,
  big: 8,
  jerky: 15,
};

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
        console.log(`Loaded PeopleData from file.`);
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

let getPerson = (req: any, res: any) => {
  const name = req.params.name;
  if (!(name in PersonData)) {
    res.status(404).send("Person not found");
    return;
  }
  res.json(PersonData[name]);
};

let createPerson = (req: any, res: any) => {
  const name = req.params.name;

  if (name in PersonData) {
    res.status(409).send("Person already exists");
    return;
  }

  let newPerson: Person = {
    small_beers: 0,
    big_beers: 0,
    beef_jerky: 0,
  };

  PersonData[name] = newPerson;
  savePeople();
  res.status(201).send("Person created");
};

let getAllPeople = (req: any, res: any) => {
  res.json(PersonData);
};

let checkPassword = (req: any, res: any) => {
  let name = req.params.name;

  // Check if person exists
  if (!(name in PersonData)) {
    res.status(404).send("Person not found");
    return;
  }

  // Check if password is null
  if (
    PersonData[name].password === null ||
    PersonData[name].password === undefined
  ) {
    res.status(403).send("Password not set");
    return;
  }

  let password = req.query.password;

  // Check if password is not provided
  if (password === null || password === undefined) {
    res.status(400).send("Password not provided");
    return;
  }

  let hashedPassword = hashPassword(password);

  // Check if password matches
  if (PersonData[name].password !== hashedPassword) {
    res.status(403).send("Incorrect password");
    return;
  }

  res.status(200).send("Correct password");
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
    savePeople();
    return;
  }

  let passwordOld = req.query.passwordOld;
  let hashedPasswordOld = hashPassword(passwordOld);

  // Check if password matches
  if (PersonData[name].password !== hashedPasswordOld) {
    res.status(403).send("Incorrect password");
    return;
  }

  PersonData[name].password = hashedPassword;
  savePeople();
  res.status(200).send("Password set");
};

let increment = (req: any, res: any) => {
  let name = req.params.name;
  let type = req.query.type;

  if (!PersonData[name]) {
    res.status(404).send("Person not found.");
    return;
  }

  switch (type) {
    case "small":
      PersonData[name].small_beers++;
      increaseToPay(name, prices.small);
      incrementSmallBeer();
      increaseSmallBeer(name);
      break;
    case "big":
      PersonData[name].big_beers++;
      increaseToPay(name, prices.big);
      incrementBigBeer();
      increaseBigBeer(name);
      break;
    case "jerky":
      PersonData[name].beef_jerky++;
      increaseToPay(name, prices.jerky);
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
      } else {
        console.log("Person data saved to file.");
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
};