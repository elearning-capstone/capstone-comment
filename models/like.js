module.exports = (sequelize, DataTypes) => {
    const like = sequelize.define("like", {
        comment_id: {
            type: DataTypes.INGETER,
            defaultValue: null,
        },
        reply_id: {
            type: DataTypes.INGETER,
            defaultValue: null,
        },
        is_like: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        }
    });

    return like;
}