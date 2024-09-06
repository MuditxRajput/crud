import dotenv from 'dotenv';
import express from 'express';
import mysql from 'mysql2';
dotenv.config();
const app = express();
app.use(express.json());
const port =8080;

const connection = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD|| '',
    database:process.env.DB_NAME,
})

connection.connect((err)=>{
    if(err){
        console.log(`Error connection to the database`);
        
    }
    else{
        app.listen(port,()=>{console.log(`database is connected..`);
    })
    }
})


// create the contact..
app.post('/create',(req,res)=>{
    const{First_Name,Last_Name,Email,Number} = req.body;
    const sql = 'INSERT INTO contact (First_Name, Last_Name, Email, Number) VALUES (?, ?, ?)';
    connection.query(sql, [First_Name,Last_Name, Email, Number], (error, results) => {
        if (error) return res.status(500).json({ error: error.message });
        res.status(201).json({ id: results.insertId, First_Name,Last_Name, Email, Number });
      });
});

app.get('/contacts', (req, res) => {
    const sql = 'SELECT * FROM contact';
    connection.query(sql, (error, results) => {
      if (error) return res.status(500).json({ error: error.message });
      res.status(200).json(results);
    });
  });

  app.put('/contacts/:id', (req, res) => {
    const { id } = req.params;
    const { First_Name,Last_Name,Email,Number } = req.body;
    const sql = 'UPDATE contact SET name = ?, email = ?, phone = ? WHERE id = ?';
    connection.query(sql, [First_Name,Last_Name,Email,Number, id], (error, results) => {
      if (error) return res.status(500).json({ error: error.message });
      if (results.affectedRows === 0) return res.status(404).json({ message: 'Contact not found' });
      res.status(200).json({ id, First_Name,Last_Name,Email,Number });
    });
  });

  app.delete('/contacts/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM contact WHERE id = ?';
    connection.query(sql, [id], (error, results) => {
      if (error) return res.status(500).json({ error: error.message });
      if (results.affectedRows === 0) return res.status(404).json({ message: 'Contact not found' });
      res.status(204).send();
    });
  });