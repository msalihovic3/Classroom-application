const db = require('./db')
db.sequelize.sync({force:true}).then(function(){
 
        console.log("Gotovo kreiranje tabela i ubacivanje pocetnih podataka!");
        process.exit();



});

