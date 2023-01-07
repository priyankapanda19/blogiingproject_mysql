const jwt = require("jsonwebtoken")
const mongoose = require("mongoose")
const teacherModel = require("../model/userModel")
const isObject = mongoose.Types.ObjectId

let authentication = async (req, res, next) => {
    try {
        let token = req.headers.authorization
    

        jwt.verify(token, "functionup" , (err, decoded) => {
            if (err) return res.status(401).send({ status: false, msg: err.message })

            req.token = decoded.id
            next()

        })

    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}
let authorization = async (req, res, next) => {
    try {
        let tokenId = req.token
        
        let teacherId = req.params.id

        if (!isObject(teacherId)) return res.status(400).send({ status: false, msg: "teacherID not valid.." });
        let teacher = await teacherModel.findById(teacherId)
        if (!teacher) return res.status(404).send({ status: false, msg: "teacher not found.." });

        if (tokenId !== teacherId) { return res.status(403).send({ status: false, msg: "Teacher unauthorized" }) }

        next()
    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports = { authentication, authorization }
