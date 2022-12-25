const postModel = require("../../db/models/post.model")
const myHelper = require("../../app/helper")
const { post } = require("../../routes/user.routes")
const { find } = require("../../db/models/user.model")
const e = require("express")
class Post {
    static addPost = async (req, res) => {
        try {
            const postData = new postModel({
                userId: req.user._id,
                ...req.body
            })
            await postData.save()
            myHelper.resHandler(res, 200, true, postData, "added")

        }
        catch (e) {
            myHelper.resHandler(res, 500, false, e, e.message)

        }
    }
    static myPosts = async (req, res) => {
        try {
            // const posts = await postModel.find({userId: req.user._id})
            await req.user.populate("myPosts")
            myHelper.resHandler(res, 200, true, {
                posts: req.user.myPosts,
                user: req.user
            }, "added")
        }
        catch (e) {
            myHelper.resHandler(res, 500, false, e, e.message)

        }

    }
    static getAll = async (req, res) => {

        try {
            const posts = await postModel.find({});
            if (!posts) return myHelper.resHandler(res, 500, false, err, 'No posts yet')
            const newArrayofElements = []
            posts.forEach(element => {
                if (req.user._id.toString() == element.userId.toString()) {
                    const newOjbect = {
                        ...element._doc,
                        isMine: true
                    }
                    newArrayofElements.push(newOjbect)

                } else {
                    const newOjbect = {
                        ...element._doc,
                        isMine: false
                    }
                    newArrayofElements.push(newOjbect)
                }

            });

            myHelper.resHandler(res, 200, true, newArrayofElements, "added")
        }
        catch (e) {
            myHelper.resHandler(res, 500, false, e, e.message)
        }

    }
    static deleteSinglePost = async (req, res) => {
        try {
            const posts = await postModel.findById(req.body.postId);
            if (req.user._id.toString() == posts.userId.toString()) {
                await postModel.findByIdAndDelete(req.body.postId)
                myHelper.resHandler(res, 200, true, posts, "deleted")
            } else {
                myHelper.resHandler(res, 500, false, post, 'That is not your post')
            }
        }
        catch (e) {
            myHelper.resHandler(res, 500, false, e, e.message)
        }

    }
    static deleteAllPosts = async (req, res) => {
        try {
            const posts = await postModel.deleteMany({});
            myHelper.resHandler(res, 200, true, posts, "All posts deleted")
        }
        catch (e) {
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
    static editPosts = async (req, res) => {
        try {
            const post = await postModel.findOneAndUpdate({ _id: req.body.postId }, { content: req.body.newContent }, { new: true });
            console.log(req.body.postId);
            if (post) {
                myHelper.resHandler(res, 200, true, post, "Updated")
            } else {
                myHelper.resHandler(res, 404, true, post, "Not find")
            }
        }
        catch (e) {
            myHelper.resHandler(res, 500, false, e, e.message)
        }
    }
}
module.exports = Post