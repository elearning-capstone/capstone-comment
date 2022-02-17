const express = require("express");
const router = express.Router();
const { comment } = require("../models");

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

module.exports = router;