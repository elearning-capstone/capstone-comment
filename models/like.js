module.exports = (sequelize, DataTypes) => {
    const like = sequelize.define("like", {
        comment_id: {
            type: DataTypes.INTEGER,
            defaultValue: null,
        },
        reply_id: {
            type: DataTypes.INTEGER,
            defaultValue: null,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        is_like: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    });

    like.associate = (models) => {
        like.belongsTo(models.comment), {
            foreignKey: "comment_id",
        };
        like.belongsTo(models.reply, {
            foreignKey: "reply_id",
        });
    };

    return like;
}