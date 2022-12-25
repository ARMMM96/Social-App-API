const router = require("express").Router()
const Post = require('../app/controller/post.controller')
const { auth } = require("../app/middleware/auth.middleware")
router.post("/add", auth, Post.addPost)
router.get("/myPosts", auth, Post.myPosts)
router.get('/all', auth, Post.getAll)
router.delete('/delete', auth, Post.deleteSinglePost)
router.delete('/deleteall', auth, Post.deleteAllPosts)
router.patch('/edit', auth, Post.editPosts)

module.exports = router