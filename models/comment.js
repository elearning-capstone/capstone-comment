module.exports = (sequelize, DataTypes) => {
    const comment = sequelize.define("comment", {
        course_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        comment: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        total_like: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        total_reply: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        tag_user: {
            type: DataTypes.INTEGER,
            defaultValue: null,
        },
    });

    comment.associate = (models) => {
        comment.hasMany(models.reply), {
            foreignKey: "comment_id",
        };
        comment.hasMany(models.like, {
            foreignKey: "comment_id",
        });
    };

    return comment;
}