import { deleteBeer, getBeer, getBeers, loadBeerData, payBeer } from "./api/beer";
import {
  PersonData,
  getPerson,
  createPerson,
  getAllPeople,
  setPassword,
  checkPassword,
  loadPersonData,
  increment,
} from "./api/person";
import { getStats, loadStatData, getMeter } from "./api/stat";

// Initialize the app
const express = require("express");
const app = express();
const cors = require("cors");

// Port on which the server will run on
const port = 4999;

// API path
const api_path = "/api/v2";

loadPersonData();
loadStatData();
loadBeerData();

app.get(`${api_path}`, (req: any, res: any) => {
  res.send("Hello World!");
});

// Get all the people
app.get(`${api_path}/person`, getAllPeople);

// Get a specific person
app.get(`${api_path}/person/:name`, getPerson);

// Create a person
app.post(`${api_path}/person/:name`, createPerson);

// Check password
app.get(`${api_path}/person/:name/password`, checkPassword);

// Set password
app.post(`${api_path}/person/:name/password`, setPassword);

// Increment consumption
app.post(`${api_path}/person/:name/increment`, increment);

// Get statistics
app.get(`${api_path}/stat/:key`, getStats);

// Get meter
app.get(`${api_path}/stat/meter`, getMeter);

// Get all the beers
app.get(`${api_path}/beer`, getBeers);

// Get all the beers for a specific person
app.get(`${api_path}/beer/:name`, getBeer);

// Pay everything for a specific person
app.post(`${api_path}/beer/:name/pay`, payBeer);

// Delete a person's consumption
app.delete(`${api_path}/beer/:name`, deleteBeer);

// Initialize the app
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
