module.exports = function(sequelize, Sequalize) {
    const NurseSchema = sequelize.define("Nurse", {
        name: Sequalize.STRING,
        center: Sequalize.INTEGER
    },{
        timestamps: false
    });
    return NurseSchema;
}