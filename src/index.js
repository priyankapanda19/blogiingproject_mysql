const express = require("express")
const mongoose = require("mongoose")
const mysql = require("mysql");
const route = require("./src/routes/route.js")
const cors = require("cors")
const app = express()

app.use(express.json())
app.use(cors())



const db = mysql.createConnection({
    host: "sql6.freesqldatabase.com",
    user: "sql6587429",
    password: "vFzb623ilp",
    database: "sql6587429"
});

db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("MySQL is Connected...")
    }
})

app.use('/', route)

app.all('/*', (req, res) => {
    res.status(404).send("Page not found!")
})

app.listen(process.env.PORT || 3001, () => {
    console.log(`server is runing on 3001`)
})