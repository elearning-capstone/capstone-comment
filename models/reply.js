module.exports = (sequelize, DataTypes) => {
    const reply = sequelize.define("reply", {
        comment_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        reply: {
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

    reply.associate = (models) => {
        reply.belongsTo(models.comment, {
            foreignKey: "comment_id",
        });
        reply.hasMany(models.like, {
            foreignKey: "reply_id",
        });
    };

    return reply;
}