module.exports = (sequelize, DataTypes) => {
    const reply = sequelize.define("reply", {
        comment_id: {
            type: DataTypes.INGETER,
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
            type: DataTypes.INGETER,
            defaultValue: 0,
        },
        tag_user: {
            type: DataTypes.INGETER,
            defaultValue: null,
        },
    });

    return reply;
}