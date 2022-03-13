const express = require("express");
const router = express.Router();
const { comment, reply, like } = require("../models");

router.get("/", async (req, res) => {
    try {
        const { course_id, user_id } = req.query;

        //select comment reply like where course id
        let course_comment = await comment.findAll({
            where: {
                course_id,
            },
            include: [
                {
                    model: reply,
                    required: false, //include comment even if no reply
                    include: [{
                        model: like,
                        required: false, //include reply even if no like
                        where: {
                            user_id,
                        },
                    }],
                },
                {
                    model: like,
                    required: false, //include comment even if no like
                    where: {
                        user_id,
                    },
                }
            ],
        });

        //reformat query result
        let result = course_comment.map((element) => {
            let data = element.dataValues;
            let replies = data.replies.map((element2) => {
                let data2 = element2.dataValues;
                return {
                    reply_id: data2.id,
                    comment_id: data2.comment_id,
                    reply: data2.reply,
                    total_like: data2.total_like,
                    user_id: data2.user_id,
                    tag_user: data2.tag_user,
                    is_like: (data2.likes[0] || { is_like: false }).is_like,
                };
            });
            return {
                comment_id: data.id,
                course_id: data.course_id,
                comment: data.comment,
                total_like: data.total_like,
                total_reply: data.total_reply,
                user_id: data.user_id,
                tag_user: data.tag_user,
                is_like: (data.likes[0] || { is_like: false }).is_like,
                reply: replies,
            };
        });

        return res.json({
            comment: result,
        });
    } catch(err) {
        return res.status(404).json({ message: "not found" });
    }
});

router.post("/", async (req, res) => {
    try {
        const { tag_user } = req.body;
        const user_comment = req.body.comment;
        const { user_id, course_id } = req.query;

        if (typeof user_comment != "string") {
            return res.status(400).json({ message: "invalid comment" });
        }

        return res.json({ 
            comment: await comment.create({
                course_id,
                comment: user_comment,
                user_id,
                tag_user: tag_user || null,
            }),
        });
    } catch(err) {
        return res.status(404).json({ message: "not found" });
    }
});

router.post("/reply", async (req, res) => {
    try {
        const { comment_id, tag_user } = req.body;
        const user_reply = req.body.reply;
        const { user_id } = req.query;

        if (typeof user_reply != "string") {
            return res.status(400).json({ message: "invalid reply" });
        }

        let user_comment = await comment.findOne({
            where: {
                id: comment_id
            }
        });

        if (!user_comment) {
            return res.status(404).json({ message: "comment not found" });
        }

        let new_reply = await reply.create({
            comment_id,
            reply: user_reply,
            user_id,
            tag_user: tag_user || null,
        });

        user_comment.total_reply += 1;
        user_comment.save();

        return res.json({ 
            reply: new_reply,
        });
    } catch(err) {
        return res.status(404).json({ message: "not found" });
    }
});

router.post("/like", async (req, res) => {
    try {
        const { comment_id, reply_id } = req.body;
        const { user_id } = req.query;

        if ((typeof comment_id != "number") == (typeof reply_id != "number")) { //xnor
            return res.status(400).json({ message: "either comment id or reply id" });
        }

        if (comment_id) {
            let user_comment = await comment.findOne({
                where: {
                    id: comment_id,
                },
            });

            if (!user_comment) {
                return res.status(404).json({ message: "comment not found" });
            }

            let user_like = await like.findOne({
                where: {
                    user_id,
                    comment_id,
                }
            });

            if (user_like) {
                if (user_like.is_like == false) {
                    user_comment.total_like += 1;
                    user_comment.save();
                }
                user_like.is_like = true;
                user_like.save();
            } else {
                user_like = await like.create({
                    comment_id,
                    user_id,
                    is_like: true,
                });
                user_comment.total_like += 1;
                user_comment.save();
            }

            return res.json({
                like: user_like,
            });
        }

        if (reply_id) {
            let user_reply = await reply.findOne({
                where: {
                    id: reply_id,
                },
            });

            if (!user_reply) {
                return res.status(404).json({ message: "reply not found" });
            }

            let user_like = await like.findOne({
                where: {
                    user_id,
                    reply_id,
                }
            });

            if (user_like) {
                if (user_like.is_like == false) {
                    user_reply.total_like += 1;
                    user_reply.save();
                }
                user_like.is_like = true;
                user_like.save();
            } else {
                user_like = await like.create({
                    reply_id,
                    user_id,
                    is_like: true,
                });
                user_reply.total_like += 1;
                user_reply.save();
            }

            return res.json({
                like: user_like,
            });
        }
    } catch(err) {
        return res.status(404).json({ message: "not found" });
    }
});

router.post("/unlike", async (req, res) => {
    try {
        const { comment_id, reply_id } = req.body;
        const { user_id } = req.query;

        if ((typeof comment_id != "number") == (typeof reply_id != "number")) { //xnor
            return res.status(400).json({ message: "either comment id or reply id" });
        }

        if (comment_id) {
            let user_comment = await comment.findOne({
                where: {
                    id: comment_id,
                },
            });

            if (!user_comment) {
                return res.status(404).json({ message: "comment not found" });
            }

            let user_like = await like.findOne({
                where: {
                    user_id,
                    comment_id,
                }
            });

            if (user_like) {
                if (user_like.is_like == true) {
                    user_comment.total_like -= 1;
                    user_comment.save();
                }
                user_like.is_like = false;
                user_like.save();
            } else {
                user_like = await like.create({
                    comment_id,
                    user_id,
                    is_like: false,
                });
            }

            return res.json({
                like: user_like,
            });
        }

        if (reply_id) {
            let user_reply = await reply.findOne({
                where: {
                    id: reply_id,
                },
            });

            if (!user_reply) {
                return res.status(404).json({ message: "reply not found" });
            }

            let user_like = await like.findOne({
                where: {
                    user_id,
                    reply_id,
                }
            });

            if (user_like) {
                if (user_like.is_like == true) {
                    user_reply.total_like -= 1;
                    user_reply.save();
                }
                user_like.is_like = false;
                user_like.save();
            } else {
                user_like = await like.create({
                    reply_id,
                    user_id,
                    is_like: false,
                });
            }

            return res.json({
                like: user_like,
            });
        }
    } catch(err) {
        return res.status(404).json({ message: "not found" });
    }
});

module.exports = router;