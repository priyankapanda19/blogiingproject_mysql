const express = require("express")
const Router = express.Router()
const { signUp, login } = require('../controller/userController2')
const BlogController= require("../Controller/BlogController")
const middleware= require("../middlewares/auth")

Router.get('/test', (req, res) => {
    res.send("testing successful")
})

Router.post('/signUp', signUp)
Router.post('/login', login)

module.exports = Router



/////////////////



router.post("/createBlog",middleware.auth, BlogController.createBlog)
router.get("/filteredBlogs",middleware.auth, BlogController.getBlogs)
router.put("/blogs/:blogId",middleware.auth, BlogController.updateBlog)
router.delete("/blogsbyid/:blogId",middleware.auth, BlogController.DeleteBlog)
router.delete("/blogs",middleware.auth, BlogController.deleteByQuery)


//errorHandling for wrong address
router.all("/**", function (req, res) {         
    res.status(400).send({
        status: false,
        msg: "The api you request is not available"
    })
})
module.exports = router