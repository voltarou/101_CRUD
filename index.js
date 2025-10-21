const express = require('express');
let mysql = require('mysql2');
const app = express();
const port = 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const db = mysql.createConnection({
    host: '127.0.0.1',
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


app.get('/', (req, res) => {
    res.send('Hello World! Server Mahasiswa API is running.');
});


app.get('/api/mahasiswa', (req, res) => {
    db.query('SELECT * FROM mahasiswa', (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            
            return res.status(500).json({ error: 'Error fetching data from database' });
        }
        res.json(results);
    });
});


app.post('/api/mahasiswa', (req, res) => {
    
    const { nama, alamat, agama } = req.body;
    
    if (!nama || !alamat || !agama) {
        return res.status(400).json({ error: 'All fields (nama, alamat, agama) are required' });
    }

    const query = 'INSERT INTO mahasiswa (nama, alamat, agama) VALUES (?, ?, ?)';
    db.query(query, [nama, alamat, agama], (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).json({ error: 'Error inserting data into database' });
        }
        res.status(201).json({ 
            message: 'Data inserted successfully',
            id: result.insertId 
        });
    });
});


app.put('/api/mahasiswa/:id', (req, res) => {
    const { id } = req.params;
    const { nama, alamat, agama } = req.body;

    if (!nama || !alamat || !agama) {
        return res.status(400).json({ error: 'All fields (nama, alamat, agama) are required for update' });
    }

    db.query(
        'UPDATE mahasiswa SET nama = ?, alamat = ?, agama = ? WHERE id = ?',
        [nama, alamat, agama, id],
        (err, result) => {
            if (err) {
                console.error('Error updating data:', err);
                return res.status(500).json({ error: 'Error updating data in database' });
            }
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ error: `Mahasiswa with ID ${id} not found.` });
            }
            res.json({ message: 'Data updated successfully' });
        }
    );
});


app.delete('/api/mahasiswa/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM mahasiswa WHERE id = ?', [id], (err, result) => {
        if (err) {
            console.error('Error deleting data:', err);
            return res.status(500).json({ error: 'Error deleting data from database' });
        }
       
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `Mahasiswa with ID ${id} not found.` });
        }
        res.json({ message: 'Data deleted successfully' });
    });
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
