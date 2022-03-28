module.exports = function(sequelize, Sequalize) {
    const CenterSchema = sequelize.define("Center", {
        name: Sequalize.STRING,
    },{
        timestamps: false
    });
    return CenterSchema;
}