const express = require("express");
const router = express.Router();
const { comment, reply, like } = require("../models");

router.get("/", async (req, res) => {
    try {
        const { course_id } = req.query;

        return res.json({
            comment: comment.findAll({
                where: {
                    course_id,
                }
            }),
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

        let count = await comment.count({
            where: {
                id: comment_id
            }
        });

        if (count == 0) {
            return res.status(404).json({ message: "comment not found" });
        }

        return res.json({ 
            reply: await reply.create({
                comment_id,
                reply: user_reply,
                user_id,
                tag_user: tag_user || null,
            }),
        });
    } catch(err) {
        return res.status(404).json({ message: "not found" });
    }
});

module.exports = router;