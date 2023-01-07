
const mysql = require("mysql");
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const ShortUniqueId = require('short-unique-id')
const uid = new ShortUniqueId();
const uidWithTimestamp = uid.stamp(36);


const db = mysql.createConnection({
    host: "sql6.freesqldatabase.com",
    user: "sql6587429",
    password: "vFzb623ilp",
    database: "sql6587429"
});

const isEmpty = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
};

//******regex validation*****
let nameRegex = /^[a-z A-Z]+$/
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
let mobileRegex = /^((\+91)?|91)?[6789][0-9]{9}$/
let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,15}$/


const signUp = async function (req, res) {
    try {
        let data = req.body
        let { name, email, mobile, password } = data

        if (Object.keys(data).length == 0) return res.status(400).send({ status: false, msg: "Enter input field" })

        if (!isEmpty(name)) return res.status(400).send({ status: false, msg: "Enter your name" })
        if (!nameRegex.test(name)) return res.status(400).send({ status: false, msg: "Enter valid name ..!!" })

        if (!isEmpty(email)) return res.status(400).send({ status: false, msg: "Enter your Email" })
        if (!emailRegex.test(email)) return res.status(400).send({ status: false, msg: "Enter valid Email ..!!" })

        if (!isEmpty(mobile)) return res.status(400).send({ status: false, msg: "Enter your Mobile no." })
        if (!mobileRegex.test(mobile)) return res.status(400).send({ status: false, msg: "Enter valid mobile no. ..!!" })

        if (!isEmpty(password)) return res.status(400).send({ status: false, msg: "Enter your password" })
        if (!passwordRegex.test(password)) return res.status(400).send({ status: false, msg: "Enter valid password like Abc@123 ..!!" })

        db.query(`SELECT * from user WHERE (email = "${email}" || mobile  = "${mobile}")`, async (err, results) => {

            if (err) { console.log(err) }

            if (results.length > 0) {
                for (let i in results) if (results[i].email == email) return res.send({ status: false, message: 'The Email is already exist!' })
                for (let i in results) if (results[i].mobile == mobile) return res.send({ status: false, message: 'The Mobile is already exist!' })
            }

            let hashedPassword = await bcrypt.hash(password, 10);

            db.query(`INSERT INTO user SET ?`, { id: uidWithTimestamp, name: name, email: email, mobile: mobile, password: hashedPassword }, (err, results) => {
                if (err) {
                    console.log(err);
                } else {
                    return res.send({ status: false, message: 'User Registered' });
                }
            })
        })

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}



let counter = 1
const MAX_ATTEMPS = 5
const login = async function (req, res) {
    try {
        let data = req.body
        let { email, password } = data

        if (!isEmpty(email)) return res.status(400).send({ status: false, message: "Enter your Email" })
        if (!emailRegex.test(email)) return res.status(400).send({ status: false, message: "Enter valid Email ..!!" })

        if (!isEmpty(password)) return res.status(400).send({ status: false, message: "Enter your password" })
        if (!passwordRegex.test(password)) return res.status(400).send({ status: false, message: "Enter valid password like Abc@123 ..!!" })


        db.query(`SELECT * from user WHERE (email = "${email}")`, async (err, results) => {

            if (err) { console.log(err) }
            // console.log(results);
            if (results.length == 0) return res.status(400).send({ status: false, message: "You aren't registration user! You have you register first." })

            let pass = await bcrypt.compare(password, results[0].password)
            // console.log("a:", counter);

            if (counter >= MAX_ATTEMPS) {

                setTimeout(() => { counter = 1 }, 10000/* * 60 * 60 * 24*/)
                return res.status(400).send({ status: false, message: "You are blocked for 24hrs!" })
            }


            if (!results || !pass) {
        
                counter++
                return res.status(401).send({ status: false, message: 'Email or Password is incorrect' })

            } else {
                const payload = { id: results[0].id };
                const token = jwt.sign({ payload }, "functionup", { expiresIn: "24h" });
            

                const cookieOptions = { expires: new Date(Date.now() + 24 * 60 * 60 * 1000), httpOnly: true }
                res.cookie('userSave', token, cookieOptions);
                
                return res.status(200).send({ status: true, data: { email: results[0].email, userId: results[0].id, token: token } })
            }
        })

    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}



module.exports = { signUp, login }