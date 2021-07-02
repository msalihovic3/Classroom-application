const Sequelize = require("sequelize");
const sequelize = new Sequelize("wt2018115","root","root",{host:"127.0.0.1",dialect:"mysql",logging:false});
const db={};

db.Sequelize = Sequelize;  
db.sequelize = sequelize;

//import modela
db.predmet = sequelize.import(__dirname+'/predmet.js');
db.grupa = sequelize.import(__dirname+'/grupa.js');
db.tip = sequelize.import(__dirname+'/tip.js');
db.aktivnost = sequelize.import(__dirname+'/aktivnost.js');
db.student = sequelize.import(__dirname+'/student.js');
db.dan = sequelize.import(__dirname+'/dan.js');

//relacije
//Predmet 1-N Grupa
db.predmet.hasMany(db.grupa,{as:'grupePredmeta'});
db.grupa.belongsTo(db.predmet,  {foreignKey:{ allowNull: false}});
//Aktivnost N-1 Predmet
db.predmet.hasMany(db.aktivnost,{as:'aktivnostiPredmeta'});
db.aktivnost.belongsTo(db.predmet,  {foreignKey:{ allowNull: false}});
//Aktivnost N-0 Grupa
db.aktivnost.belongsTo(db.grupa);
db.grupa.hasMany(db.aktivnost,{as:'aktivnostiGrupe'});
//Aktivnost N-1 Dan/
db.aktivnost.belongsTo(db.dan,  {foreignKey:{ allowNull: false}});
db.dan.hasMany(db.aktivnost,{as:'aktivnostiDana'});
//Aktivnost N-1 Tip
db.aktivnost.belongsTo(db.tip,  {foreignKey:{ allowNull: false}});
db.tip.hasMany(db.aktivnost,{as:'aktivnostiTipa'});
//Student N-M Grupa
db.studentGrupe = sequelize.define('grupe_studenata');
db.student.belongsToMany(db.grupa,{through:'grupe_studenata'});
db.grupa.belongsToMany(db.student,{through:'grupe_studenata'});


module.exports=db;