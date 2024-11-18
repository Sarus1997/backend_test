const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const database = require('./model/db.json');
const cors = require('cors');
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello! Node.js");
});

app.get("/model", (req, res) => {
    res.send(database);
});

app.get('/model/:id', (req, res) => {
    const id = Number(req.params.id);
    const user = database.find(user => user.id === id);

    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

const fs = require('fs'); // เพิ่มส่วนนี้

app.post('/model/add', (req, res) => {
    const newUser = {
        id: database.length + 1,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        website: req.body.website,
        address: {
            street: req.body.address?.street,
            suite: req.body.address?.suite,
            city: req.body.address?.city,
            zipcode: req.body.address?.zipcode,
            geo: {
                lat: req.body.address?.geo?.lat,
                lng: req.body.address?.geo?.lng
            }
        }
    };

    database.push(newUser);

    // เขียนข้อมูลใหม่ลงในไฟล์ db.json
    fs.writeFile('./model/db.json', JSON.stringify(database, null, 2), (err) => {
        if (err) {
            console.error('Error writing to db.json:', err);
            res.status(500).json({ message: 'Failed to save data' });
        } else {
            res.status(201).json(newUser);
        }
    });
});


app.put('/model/update/:id', (req, res) => {
    const id = Number(req.params.id);
    const user = database.find(user => user.id === id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        user.website = req.body.website || user.website;
        user.address = {
            street: req.body.address?.street || user.address.street,
            suite: req.body.address?.suite || user.address.suite,
            city: req.body.address?.city || user.address.city,
            zipcode: req.body.address?.zipcode || user.address.zipcode,
            geo: {
                lat: req.body.address?.geo?.lat || user.address.geo.lat,
                lng: req.body.address?.geo?.lng || user.address.geo.lng
            }
        };

        res.json(user);
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

app.delete('/model/delete/:id', (req, res) => {
    const id = Number(req.params.id);
    const index = database.findIndex(user => user.id === id);

    if (index !== -1) {
        const deletedUser = database.splice(index, 1);
        res.json(deletedUser[0]);
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

//** รัน server ด้วยคำสั่ง node server.js หรือ nodemon server.js หรือ npm start หรือ npm run dev */
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
    console.log(`Click here to open: http://localhost:${port}`);
});

module.exports = app;

