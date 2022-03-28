module.exports = function(sequelize, Sequalize) {
    const BookSchema = sequelize.define("Book", {
        id: {
            type: Sequalize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        date: Sequalize.STRING,
        name: Sequalize.STRING,
        nric: Sequalize.STRING,
        center: Sequalize.STRING,
        slot_number: Sequalize.INTEGER,
    },{
        timestamps: false
    });
    const Center = require('./center')(sequelize, Sequalize);
    BookSchema.belongsTo(Center, {
        foreignKey: 'center'
    });
    return BookSchema;
}