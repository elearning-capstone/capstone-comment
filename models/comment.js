module.exports = (sequelize, DataTypes) => {
    const comment = sequelize.define("comment", {
        course_id: {
            type: DataTypes.INGETER,
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
            type: DataTypes.INGETER,
            defaultValue: 0,
        },
        total_reply: {
            type: DataTypes.INGETER,
            defaultValue: 0,
        },
        tag_user: {
            type: DataTypes.INGETER,
            defaultValue: null,
        },
    });

    return comment;
}