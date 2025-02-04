let express = require('express');
let cors = require('cors');
let sql = require('mysql2')

let app = express();

app.use(cors());
app.use(express.json());

// Подключение к БД
let db = sql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '009900red21_2025',
    database: 'demo'
})

db.connect((err) => {
    console.log('DB Connected');
})

app.get('/users', (req, res) => {
    db.query('SELECT * FROM dusers', (err, result) => {
        res.json(result);
    })
})

app.get('/orders', (req, res) => {
    db.query('SELECT * FROM dorders', (err, result) => {
        res.json(result);
    })
})

app.post('/userOrders', (req, res) => {
    let { userid } = req.body;
    db.query('SELECT * FROM dorders WHERE userid = ?', [userid], (err, result) => {
        res.json(result);
    })
})


app.post('/users', (req, res) => {
    let { login, password, subname1, subname2, phone, email, role } = req.body;

    let q = 'INSERT INTO dusers (login, password, subname1, subname2, phone, email, role) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(q, [login, password, subname1, subname2, phone, email, role], (err, result) => {
        res.json({ id: result.insertId, login: login, password: password, subname1: subname1, subname2: subname2, phone: phone, email: email, role: role });
    })
})

app.post('/orders', (req, res) => {
    let { date, time, count, userid, phone, status } = req.body;

    let q = 'INSERT INTO dorders (date, time, count, userid, phone, status) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(q, [date, time, count, userid, phone, status], (err, result) => {
        res.json({ id: result.insertId, date: date, time: time, count: count, userid: userid, phone: phone, status: status });
    })
})

app.listen(5000, () => {
    console.log('Server listen 5000');
})

/*
INSERT INTO dusers (login, password, subname1, subname2, phone, email, role) VALUES ('admin', 'restaurant', 'admin', 'admin', '0', '', 'admin')

CREATE TABLE dusers(
    id INT PRIMARY KEY AUTO_INCREMENT,
    login VARCHAR(64),
    password VARCHAR(64),
    subname1 VARCHAR(64),
    subname2 VARCHAR(64),
    phone VARCHAR(64),
    email VARCHAR(64),
    role VARCHAR(64)
);

CREATE TABLE dorders(
    id INT PRIMARY KEY AUTO_INCREMENT,
    date VARCHAR(64),
    time VARCHAR(64),
    count VARCHAR(64),
    userid INT,
    phone VARCHAR(64),
    status VARCHAR(64)
);

*/