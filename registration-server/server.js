const express = require('express');
const bodyParser = require('body-parser');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Import the cors package

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const excelFilePath = path.join(__dirname, 'registrations.xlsx');

// Function to write data to Excel
function writeToExcel(data) {
  let workbook;
  let worksheet;

  if (fs.existsSync(excelFilePath)) {
    workbook = xlsx.readFile(excelFilePath);
    worksheet = workbook.Sheets[workbook.SheetNames[0]];
  } else {
    workbook = xlsx.utils.book_new();
    worksheet = xlsx.utils.json_to_sheet([]);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Registrations');
  }

  const jsonData = xlsx.utils.sheet_to_json(worksheet);
  jsonData.push(data);
  xlsx.utils.sheet_add_json(worksheet, jsonData);
  xlsx.writeFile(workbook, excelFilePath);
}

app.post('/register', (req, res) => {
  const formData = req.body;
  writeToExcel(formData);
  res.send('Registration successful!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});