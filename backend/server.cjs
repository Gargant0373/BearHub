const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto-js');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const dataFilePath = 'beerData.json';
const logsFolderPath = 'logs';

const port = 4999;

let beerData = {};

const SMALL_BEER_PRICE = 5;
const BIG_BEER_PRICE = 8;

// Load existing data from the JSON file
fs.readFile(dataFilePath, 'utf8', (err, data) => {
  if (!err) {
    try {
      beerData = JSON.parse(data);
    } catch (parseError) {
      console.error('Error parsing beerData.json:', parseError);
    }
  }
});

app.use((req, res, next) => {
  const { type } = req.body;
  const timestamp = new Date().toISOString();

  let logObject = {
    timestamp,
    personName: '',
    action: '',
  };

  if (req.url.includes('/beers')) {
    logObject.action = 'ADD';
    logObject.type = type;
    logObject.personName = req.url.split('/')[3].trim();
  } else if (req.url.includes('/pay')) {
    logObject.action = 'PAY';
    logObject.personName = req.url.split('/')[3].trim();
    logObject.paidAmount = beerData[logObject.personName]?.toPay;
  } else {
    logObject.action = 'UNKNOWN';
  }

  if (logObject.action === 'UNKNOWN') {
    next(); // Skip log creation and continue with the middleware chain
  } else {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const formattedDate = `${year}-${month}-${day}`;

    const logFilePath = path.join(logsFolderPath, formattedDate + `.json`);

    // Save the log to the JSON file
    fs.appendFile(logFilePath, JSON.stringify(logObject) + '\n', 'utf8', (err) => {
      if (err) {
        console.error('Error saving log:', err);
      }
    });

    console.log(logObject);

    next();
  }
});

// Validate the password for a specific person
app.get('/api/people/:name/validatePassword', (req, res) => {
  const { name } = req.params;
  const { password } = req.query;
  
  if (!password) {
    res.status(400).json({ error: 'Password not provided' });
    return;
  }

  let hashedPassword = crypto.SHA256(password).toString(crypto.enc.Base64);
  
  if (beerData[name]) {
    const savedPassword = beerData[name].password;

    console.log(hashedPassword, savedPassword);

    if (hashedPassword == savedPassword) {
      res.status(200).json({ valid: true, message: 'Password is correct' });
    } else {
      res.status(200).json({ valid: false, message: 'Password is incorrect' });
    }
  } else {
    res.status(404).json({ error: 'Person not found' });
  }
});

// Update the password for a specific person
app.post('/api/people/:name/password', (req, res) => {
  const { name } = req.params;
  const { password } = req.body;

  console.log(password);

  if (beerData[name]) {
    beerData[name].password = crypto.SHA256(password).toString(crypto.enc.Base64);
    saveData();
    res.status(200).json({ password: beerData[name].password });
  } else {
    res.status(404).json({ error: 'Person not found' });
  }
});

// Delete the data
app.delete('/api/people/:name', (req, res) => {
  const { name } = req.params;
  if (beerData[name]) {
    delete beerData[name];
    saveData();
    res.status(200).json(beerData);
  } else {
    res.status(404).json({ error: 'Person not found' });
  }
});

// Save data to the JSON file
const saveData = () => {
  fs.writeFile(dataFilePath, JSON.stringify(beerData, null, 2), 'utf8', (err) => {
    if (err) {
      console.error('Error saving data to beerData.json:', err);
    }
  });
};

app.post('/api/people/:personName/pay', (req, res) => {
  const { personName } = req.params;
  if (beerData[personName]) {
    beerData[personName].toPay = 0;
    saveData();
    res.status(200).json(beerData[personName]);
  } else {
    res.status(404).json({ error: 'Person not found' });
  }
});

app.post('/api/people/:personName/beers', (req, res) => {
  const { personName } = req.params;
  const { type } = req.body;
  if (beerData[personName]) {
    if (type === 'small') {
      beerData[personName].smallBeers += 1;
      beerData[personName].toPay += SMALL_BEER_PRICE;
    } else if (type === 'big') {
      beerData[personName].bigBeers += 1;
      beerData[personName].toPay += BIG_BEER_PRICE;
    }
    saveData();
    res.status(201).json(beerData[personName]);
  } else {
    const newPerson = { name: personName, smallBeers: 0, bigBeers: 0, toPay: 0 };
    if (type === 'small') {
      newPerson.smallBeers = 1;
      newPerson.toPay = SMALL_BEER_PRICE;
    } else if (type === 'big') {
      newPerson.bigBeers = 1;
      newPerson.toPay = BIG_BEER_PRICE;
    }
    beerData[personName] = newPerson;
    saveData();
    res.status(201).json(newPerson);
  }
});

app.get('/api/people', (req, res) => {
  res.json(Object.values(beerData));
});

app.get('/api/people/:name', (req, res) => {
  const { personName } = req.params;
  const person = beerData[personName];
  if (person) {
    res.json(person);
  } else {
    res.status(404).json({ error: 'Person not found' });
  }
});

// Get logs for a specific day
app.get('/api/logs/:date', (req, res) => {
  const { date } = req.params;
  const logFilePath = path.join(logsFolderPath, `${date}.json`); // Update log file path

  if (fs.existsSync(logFilePath)) {
    fs.readFile(logFilePath, 'utf8', (err, data) => {
      if (!err) {
        const logs = data
          .split('\n')
          .filter((line) => line.trim() !== '')
          .map((line) => JSON.parse(line));
        res.json(logs);
      } else {
        res.status(500).json({ error: 'Error reading log file' });
      }
    });
  } else {
    res.status(404).json({ error: 'Log file not found' });
  }
});

// Get all logs
app.get('/api/logs', (req, res) => {
  const logFiles = fs.readdirSync(logsFolderPath);
  const allLogs = [];

  logFiles.forEach((logFile) => {
    const logFilePath = path.join(logsFolderPath, logFile);
    const logDate = logFile.replace('.json', '');

    const logData = fs.readFileSync(logFilePath, 'utf8');
    const logs = logData
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line) => JSON.parse(line))
      .map((log) => ({ ...log, date: logDate }));

    allLogs.push(...logs);
  });

  res.json(allLogs);
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
