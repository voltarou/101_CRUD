const express = require('express');
let mysql = require('mysql2');
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'iVoltarouuu13579',
  database: 'mahasiswa',
  port: 3309
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  } 
    console.log('Connected to the MySQL database.');
}); 

app.get('api/mahasiswa', (req, res) => {
    db.query('SELECT * FROM mahasiswa', (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).send('Error fetching data');
            return;
        }
        res.json(results);
    });
});

app.post('/api/mahasiswa', (req, res) => {
    const { nama, alamat, agama } = req.body;
    
    if (!nama || !alamat || !agama) {
        return res.status(400).send('All fields are required');
    }
    const query = 'INSERT INTO biodata (nama, alamat, agama) VALUES (?, ?, ?)';
    db.query(query, [nama, alamat, agama], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).send('Error inserting data');
        }
        res.status(201).send('Data inserted successfully');
    });
}   );



