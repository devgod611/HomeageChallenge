module.exports = function(sequelize, Sequalize) {
    const NurseWorkdaySchema = sequelize.define("Nurse_Workday", {
        id: {
            type: Sequalize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nurse: Sequalize.INTEGER,
        work_date: Sequalize.STRING,
        center: Sequalize.INTEGER,
    },{
        timestamps: false
    });
    return NurseWorkdaySchema;
}