const express = require("express");
const bodyParser = require("body-parser");
const fs = require('fs');
const app = express();
const db = require('./db.js');
const { tip } = require("./db.js");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.static(__dirname+"/public"));

app.get('/',function(req,res){
   res.sendFile(__dirname+"/public/aktivnost.html");
});

app.get('/',function(req,res){
  res.sendFile("studenti.html");
}); 
app.get('/',function(req,res){
   res.sendFile(__dirname+"/public/unosRasporeda.html");
});

app.get('/',function(req,res){
    res.sendFile(__dirname+"/public/raspored.html");
 });


 app.get('/',function(req,res){
    res.sendFile(__dirname+"/public/planiranjeNastavnik.html");
 });

 app.get('/',function(req,res){
    res.sendFile(__dirname+"/public/podaciStudent.html");
 });


 function csvJSONPredmeti(csv){

    var lines=csv.split("\n");
 
          var result = [];
      
          var headers=["naziv"];
        
         
          if(csv!="")
          for(var i=0;i<lines.length;i++){
        
              var obj = {};
              var currentline=lines[i].split(",");
        
               obj[headers[0]] = currentline[0];
              
        
              result.push(obj);
             
        
          }
    //return result; //JavaScript object
    return result; //JSON
  }

  function csvJSONAktivnosti(csv){

   var lines=csv.split("\n");
  
         var result = [];
         var headers=["naziv","tip","pocetak","kraj","dan"];
         if(csv!="")
         for(var i=0;i<lines.length;i++){
       
             var obj = {};
             var currentline=lines[i].split(",");
            
             for (j=0;j<headers.length; j++){
                if(headers[j]=="pocetak" || headers[j]=="kraj")
                obj[headers[j]] = Number(currentline[j]);
                else
              obj[headers[j]] = currentline[j];
             }
       
             result.push(obj);
      
            
         }
   //return result; //JavaScript object
   return result; //JSON
 }

  function csvJSONAktivnostiZaPredmet(csv,predmet){

   var lines=csv.split("\n");
  
         var result = [];
         var headers=["naziv","tip","pocetak","kraj","dan"];
          if(csv!="")
         for(var i=0;i<lines.length;i++){
       
             var obj = {};
             var currentline=lines[i].split(",");
             if(currentline[0]==predmet){
             for (j=0;j<headers.length; j++){
               if(headers[j]=="pocetak" || headers[j]=="kraj")
                obj[headers[j]] = Number(currentline[j]);
                else
              obj[headers[j]] = currentline[j]
             }
       
             result.push(obj);
            
            }
         }
   //return result; //JavaScript object
   return result; //JSON
 }

 //POST /v2/student

 app.get('/v2/studenti',function(req,res){
   db.student.findAll().then(function (studenti) {
      let lista = [];
      for (let i = 0; i < studenti.length; i++) {
          noviObj = { ime: studenti[i].ime, index: studenti[i].index };
          lista.push(noviObj);
      }
      res.json({ lista });
  });

});

app.get('/v2/student/:id',function(req,res){
 
  const id = req.params.id;
  db.student.findOne({
    where: { id: id }
  }).then(function (student) {
  
          var noviObj = { ime: student.ime, index: student.index, id:student.id };
     
     res.json({ noviObj });
 });
});

app.post('/v2/student',function(req,res){
   
      const student1 = {
        ime: req.body.ime,
        index: req.body.index 
      };

      db.student.create(student1)
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Tutorial."
          });
        });

});

app.post('/v2/studenti',async function(req,res){
   
 var povrat=[];
 
    let lista = [];
    for (let i = 0; i < req.body.lista.length; i++) {
        noviObj = { ime: req.body.lista[i].ime, index: req.body.lista[i].index, grupaid:req.body.lista[i].id};
        lista.push(noviObj);
    }
    
    for (let i = 0; i < lista.length; i++) {
     const grupa=await db.grupa.findOne( {where: {  id: lista[i].grupaid } });
      var p_naziv=grupa.naziv.split("Grupa")[0];
      const predmet=await db.predmet.findOne( {where: {  naziv: p_naziv} });
   

    db.student.findAll({ where: {  index: lista[i].index } }).then(function (s) {
      
      if(s.length==0){
        db.student.create({ ime:lista[i].ime, index: lista[i].index}).then(function (ss) {
        
          db.student.findOne({ where: { ime:lista[i].ime,index: lista[i].index } }).then(function (p) {
            p.addGrupa(grupa);
          });
        });
     
      
        //Primjer 1. Knjiga.hasMany(Autor,{as:’autori’}), sve instance knjiga imaju getAutori i setAutori.
      }else{
     
     
      for(let j =0; j<s.length; j++){
        console.log(s[j].ime);
        console.log(lista[i].ime);
        if(s[j].ime!=lista[i].ime)
        {
          console.log("MIKI");
          povrat.push("Student "+ lista[i].ime +" nije kreiran jer postoji student "+s[j].ime+" sa istim indexom "+lista[i].index);
          
          break;

        }
      
        else  if(s[j].ime==lista[i].ime){


          db.grupa.findAll( {where: {  predmetId:predmet.id} }).then(function (ss) {

          db.studentGrupe.findAll({ where: {  studentId: s[j].id } }).then(function (sg) {//kombinacije grupa-sa odredjenimm studentom
            
            for(let m =0; m<ss.length; m++){
              for(let n =0; n<sg.length; n++){
                if(ss[m].id==sg[n].GrupaId){
                  db.studentGrupe.update({GrupaId:grupa.id}, {
                    where: { studentId:s[j].id  , GrupaId:sg[n].GrupaId }
                  });
                  break;
                }
              }
            }
           //console.log(ss);
           //console.log(sg);

          });
      
         });
        }
        
        }
        
        
        
      }
      if(i == lista.length-1){
        if(povrat.length==0) {
          res.status(200);
          res.send(povrat);
        }
      else
      res.send(povrat);}
  });
 
}

    

 
});

app.put('/v2/student/:id',function(req,res){
   const id = req.params.id;

  db.student.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Student was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Student with id=${id}. Maybe Student was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Student with id=" + id
      });
    });
});

app.delete('/v2/student/:id',function(req,res){

      const id = req.params.id;
    
      db.student.destroy({
        where: { id: id }
      })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "Studnet was deleted successfully!"
            });
          } else {
            res.send({
              message: `Cannot delete Student with id=${id}. Maybe Student was not found!`
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete Student with id=" + id
          });
        });
  
});

//tip
app.get('/v2/tipovi',function(req,res){
   db.tip.findAll().then(function (tipovi) {
     console.log(tipovi);
      let lista = [];
      for (let i = 0; i < tipovi.length; i++) {
          noviObj = { naziv: tipovi[i].naziv };
          lista.push(noviObj);
      }
      res.json({ lista });
  });
});

app.get('/v2/tip/:id',function(req,res){
 
  const id = req.params.id;
  db.tip.findOne({
    where: { id: id }
  }).then(function (tip) {
  
          var noviObj = { naziv: tip.naziv, id:tip.id };
     
     res.json({ noviObj });
 });
});

app.post('/v2/tip',function(req,res){
  console.log(req.body.naziv);
  
  
    db.tip.findOrCreate({where:{naziv:req.body.naziv}})
      .then(data => {
       db.tip.findOne({where:{naziv:req.body.naziv}}).then(function (tip) {
        var tipJ={
          id:tip.id
        }
        res.json(tipJ);
       });
     
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Tutorial."
        });
      });
});

app.put('/v2/tip/:id',function(req,res){
   const id = req.params.id;

  db.tip.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Tip was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Tip with id=${id}. Maybe Tip was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Tip with id=" + id
      });
    });
});

app.delete('/v2/tip/:id',function(req,res){
   const id = req.params.id;
    
   db.tip.destroy({
     where: { id: id }
   })
     .then(num => {
       if (num == 1) {
         res.send({
           message: "Tip was deleted successfully!"
         });
       } else {
         res.send({
           message: `Cannot delete Tip with id=${id}. Maybe Tip was not found!`
         });
       }
     })
     .catch(err => {
       res.status(500).send({
         message: "Could not delete Tip with id=" + id
       });
     });

});

//dan
app.get('/v2/dani',function(req,res){
   db.dan.findAll().then(function (dani) {
      let lista = [];
      for (let i = 0; i < dani.length; i++) {
          noviObj = { naziv: dani[i].naziv };
          lista.push(noviObj);
      }
      res.json({ lista });
  });
});

app.get('/v2/dan/:id',function(req,res){
 
  const id = req.params.id;
  db.dan.findOne({
    where: { id: id }
  }).then(function (dan) {
  
          var noviObj = { naziv: dan.naziv, id:dan.id };
     
     res.json({ noviObj });
 });
});

app.post('/v2/dan',function(req,res){
   if (!req.body.naziv) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
  
    // Create a Tutorial
    const dan = {
     naziv: req.body.naziv
   
    };
  
    // Save Tutorial in the database
      db.dan.findOrCreate({where:{naziv:req.body.naziv}})
      .then(data => {
       db.dan.findOne({where:{naziv:req.body.naziv}}).then(function (dan) {
        var danJ={
          id:dan.id
        }
        res.json(danJ);
       });
     
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Tutorial."
        });
      });

});

app.put('/v2/dan/:id',function(req,res){
   const id = req.params.id;

  db.dan.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Dan was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Dan with id=${id}. Maybe Dan was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Dan with id=" + id
      });
    });
});
app.delete('/v2/dan/:id',function(req,res){
  
      const id = req.params.id;
    
      db.dan.destroy({
        where: { id: id }
      })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "Dan was deleted successfully!"
            });
          } else {
            res.send({
              message: `Cannot delete Dan with id=${id}. Maybe Dan was not found!`
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete Dan with id=" + id
          });
        });
  
});

//predmet
app.get('/v2/predmeti',function(req,res){
   db.predmet.findAll().then(function (predmeti) {
      let lista = [];
      for (let i = 0; i < predmeti.length; i++) {
          noviObj = { id:predmeti[i].id, naziv: predmeti[i].naziv };
          lista.push(noviObj);
      }
      res.json({ lista });
  });
});

app.get('/v2/predmet/:id',function(req,res){
 
  const id = req.params.id;
  db.predmet.findOne({
    where: { id: id }
  }).then(function (predmet) {
  
          var noviObj = { naziv: predmet.naziv, id:predmet.id };
     
     res.json({ noviObj });
 });
});

app.post('/v2/predmet',function(req,res){
   if (!req.body.naziv) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
  
    const predmet = {
      naziv: req.body.naziv
    
    };
  
    // Save Tutorial in the database
    db.predmet.create(predmet)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Predmet."
        });
      });
});

app.put('/v2/predmet/:id',function(req,res){
   const id = req.params.id;

  db.predmet.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Predmet was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Predmet with id=${id}. Maybe Predmet was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Predmet with id=" + id
      });
    });
});
app.delete('/v2/predmet/:id',function(req,res){

      const id = req.params.id;
    
      db.predmet.destroy({
        where: { id: id }
      })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "Predmet was deleted successfully!"
            });
          } else {
            res.send({
              message: `Cannot delete Predmet with id=${id}. Maybe Predmet was not found!`
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete Predmer with id=" + id
          });
        });
   
});

//
//aktivnosti
app.get('/v2/aktivnosti',function(req,res){
   db.aktivnost.findAll().then(function (aktivnosti) {
 
      let lista = [];
      for (let i = 0; i < aktivnosti.length; i++) {
          noviObj = { naziv: aktivnosti[i].naziv, pocetak: aktivnosti[i].pocetak , kraj: aktivnosti[i].kraj , predmet: aktivnosti[i].predmet, grupa: aktivnosti[i].grupa, dan: aktivnosti[i].dan, tip: aktivnosti[i].tip};
          lista.push(noviObj);
      }
      res.json({ lista });
  });
});

app.get('/v2/aktivnost/:id',function(req,res){
 
  const id = req.params.id;
  db.aktivnost.findOne({
    where: { id: id }
  }).then(function (aktivnost) {
  
          var noviObj = { naziv: aktivnost.naziv, pocetak: aktivnost.pocetak , kraj: aktivnost.kraj , predmet: aktivnost.predmet, grupa: aktivnost.grupa, dan: aktivnost.dan, tip: aktivnost.tip };
     
     res.json({ noviObj });
 });
});

app.post('/v2/aktivnost', async function(req,res){
  //DODATI {naziv:"RMA vjezbe",pocetak:9.0,kraj:10.5,grupa:1,dan:2,tip:1,predmet:3}

 let tijelo = req.body;
 let novaLinija = "\n"+tijelo['naziv']+","+tijelo['tipId']+
 ","+tijelo['pocetak']+","+tijelo['kraj']+","+tijelo['danId'];
 console.log(novaLinija);
 let provjera=true;
 if( tijelo['naziv']=="" || tijelo['naziv']==null ){
   res.status(400).send({
      message: "Aktivnost nije validna!"
    });  return;
 }
 else if( tijelo['pocetak']=="" || tijelo['kraj']=="" || tijelo['pocetak']==null || tijelo['kraj']==null || Number(tijelo['pocetak'])<8 || Number(tijelo['pocetak'])>20 || Number(tijelo['kraj'])<8 || Number(tijelo['kraj'])>20 || Number(tijelo['pocetak'])>Number(tijelo['kraj']) ){
   
    return res.json({message:"Aktivnost nije validna!"});
 }

 // Create a Tutorial
 console.log(tijelo["PredmetId"]);
 console.log("tijelo");
 const aktivnost = {
   naziv: req.body.naziv,
   pocetak: Number(req.body.pocetak),
   kraj: Number(req.body.kraj),
   PredmetId:tijelo["PredmetId"],
   GrupaId:tijelo["GrupaId"],
   danId:tijelo["danId"],
   tipId:tijelo["tipId"]
   
 };


 db.aktivnost.findAll().then(function (aktivnosti) {
  let lista = [];
  let provjera=true;
  for (let i = 0; i < aktivnosti.length; i++) {
   
      noviObj = { naziv: aktivnosti[i].naziv, pocetak: aktivnosti[i].pocetak , kraj: aktivnosti[i].kraj , predmet: aktivnosti[i].PredmetId, grupa: aktivnosti[i].GrupaId, dan: aktivnosti[i].danId, tip: aktivnosti[i].tipId};
      lista.push(noviObj);
     // console.log(noviObj);
      //console.log(tijelo['danId']);
      if(aktivnosti[i].danId==tijelo['danId'] && Number(tijelo['pocetak'])<=Number(aktivnosti[i].pocetak) && Number(tijelo['kraj'])>=Number(aktivnosti[i].pocetak) ){
        provjera=false;
    
        break;
      } else if(aktivnosti[i].danId==tijelo['danId'] && Number(tijelo['pocetak'])>=Number(aktivnosti[i].pocetak) && Number(tijelo['pocetak'])<Number(aktivnosti[i].kraj)){
        provjera=false;
  
        break;
      }
  }

  if(provjera){
//kreiramo aktivnost
db.aktivnost.create(aktivnost)
.then(data => {
  return res.json({message:"Aktivnost je validna!"});
})
.catch(err => {
  res.status(500).send({
    message:
      err.message || "Some error occurred while creating the Grupa."
  });
});
  }else{
    return res.json({message:"Aktivnost nije validna!"});

  }
});

});

app.put('/v2/aktivnost/:id',function(req,res){
   const id = req.params.id;

  db.aktivnost.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Tutorial was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Tutorial with id=${id}. Maybe Tutorial was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Tutorial with id=" + id
      });
    });
});
app.delete('/v2/aktivnost/:id',function(req,res){

      const id = req.params.id;
    
      db.aktivnost.destroy({
        where: { id: id }
      })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "Aktivnost was deleted successfully!"
            });
          } else {
            res.send({
              message: `Cannot delete Aktivnost with id=${id}. Maybe Aktivnost was not found!`
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete Aktivnst with id=" + id
          });
        });
  
});

//grupa
app.get('/v2/grupe',function(req,res){
   db.grupa.findAll().then(function (grupe) {
      let lista = [];
      for (let i = 0; i < grupe.length; i++) {
          noviObj = { naziv: grupe[i].naziv, id:grupe[i].id };
          lista.push(noviObj);
      }
      res.json({ lista });
  });
});

app.get('/v2/grupa/:id',function(req,res){
 
  const id = req.params.id;
  db.grupa.findOne({
    where: { id: id }
  }).then(function (grupa) {
  
          var noviObj = { naziv: grupa.naziv, id:grupa.id };
     
     res.json({ noviObj });
 });
});

app.post('/v2/grupa',function(req,res){
   if (!req.body.naziv) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
  

    const grupa = {
      naziv: req.body.naziv
    };
  
    // Save Tutorial in the database
    db.grupa.create(grupa)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Grupa."
        });
      });
});

app.put('/v2/grupa/:id',function(req,res){
   const id = req.params.id;

  db.grupa.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Grupa was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Grupa with id=${id}. Maybe Grupa was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Grupa with id=" + id
      });
    });
});
app.delete('/v2/grupa/:id',function(req,res){

      const id = req.params.id;
    
      db.grupa.destroy({
        where: { id: id }
      })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "Grupa was deleted successfully!"
            });
          } else {
            res.send({
              message: `Cannot delete Grupa with id=${id}. Maybe Grupa was not found!`
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: "Could not delete Grupa with id=" + id
          });
        });
   
});

 app.get('/v1/predmeti',function(req,res){
    fs.readFile("predmeti.txt", function (err,data) {
        if (err) {
          return console.log(err);
        }
        var buf = Buffer.from(data);
        var predmeti = data.toString('utf-8');
       
        res.json(csvJSONPredmeti(predmeti));
  
    });   
});

app.get('/v1/aktivnosti',function(req,res){
   fs.readFile("aktivnosti.txt", function (err,data) {
       if (err) {
         return console.log(err);
       }
       var buf = Buffer.from(data);
       var csv = data.toString('utf-8');
       
       res.json(csvJSONAktivnosti(csv));
 
   });   
});


app.get('/v1/predmet/:naziv/aktivnost/',function(req,res){
   var predmet=req.params.naziv;
 
   
   fs.readFile("aktivnosti.txt", function (err,data) {
       if (err) {
         return console.log(err);
       }
       var buf = Buffer.from(data);
       var csv = data.toString('utf-8');
      
       res.json(csvJSONAktivnostiZaPredmet(csv,predmet));
 
   });   
});


app.post('/v1/predmet',function(req,res){
   let tijelo = req.body;
   let novaLinija = "\n"+tijelo['naziv'];
   fs.readFile("predmeti.txt", (err,dataBuffer)=>{

      if (err) {    fs.appendFile("predmeti.txt",tijelo['naziv'],function(err){
         if(err) throw err;
         return res.json({message:"Uspješno dodan predmet!"});
     });}
      else{
      var lines = dataBuffer.toString().split('\n');
      if(dataBuffer.toString()==""){
         novaLinija = tijelo['naziv'];
      }
     for (i=0;i<lines.length;i++){
         if(lines[i]==tijelo["naziv"]){
          
            return res.json({message:"Naziv predmeta postoji!"});
          }
      }
 
      fs.appendFile("predmeti.txt",novaLinija,function(err){
         if(err) throw err;
         return res.json({message:"Uspješno dodan predmet!"});
     });
   }
   });   
   
});

app.post('/v1/aktivnost',function(req,res){
   let tijelo = req.body;
   let novaLinija = "\n"+tijelo['naziv']+","+tijelo['tip']+
   ","+tijelo['pocetak']+","+tijelo['kraj']+","+tijelo['dan'];
   let provjera=true;
   if( tijelo['naziv']=="" || tijelo['naziv']==null ||  tijelo['tip']=="" || tijelo['tip']==null || tijelo['dan']=="" || tijelo['dan']==null  ){
    
       return res.json({message:"Aktivnost nije validna!"});
     
   }
   else if( tijelo['pocetak']=="" || tijelo['kraj']=="" || tijelo['pocetak']==null || tijelo['kraj']==null || Number(tijelo['pocetak'])<8 || Number(tijelo['pocetak'])>20 || Number(tijelo['kraj'])<8 || Number(tijelo['kraj'])>20 || Number(tijelo['pocetak'])>Number(tijelo['kraj']) ){
     
      return res.json({message:"Aktivnost nije validna!"});
   }
   
   fs.readFile("aktivnosti.txt", (err,dataBuffer)=>{


      if (err) { 
        novaLinija =tijelo['naziv']+","+tijelo['tip']+
         ","+tijelo['pocetak']+","+tijelo['kraj']+","+tijelo['dan'];
      fs.appendFile("aktivnosti.txt",novaLinija,function(err){
         
         if(err) throw err;
       return res.json({message:"Uspješno dodana aktivnost!"});

      });
   }
      else{
      if(dataBuffer.toString()==""){
         novaLinija = tijelo['naziv']+","+tijelo['tip']+
         ","+tijelo['pocetak']+","+tijelo['kraj']+","+tijelo['dan'];
      }
   
      var data=dataBuffer.toString('utf-8');
      var lines = data.split('\n');
      for (i=0;i<lines.length;i++){
          var elements = lines[i].split(',');    
          //uslovi da li se ispunjavaju    
          if(elements[4]==tijelo['dan'] && Number(tijelo['pocetak'])<=Number(elements[2]) && Number(tijelo['kraj'])>=Number(elements[2]) ){
            provjera=false;
         
            break;
          } else if(elements[4]==tijelo['dan'] && Number(tijelo['pocetak'])>=Number(elements[2]) && Number(tijelo['pocetak'])<Number(elements[3])){
            provjera=false;
          
            break;
          }
         
      }
   
      if(provjera){

      fs.appendFile("aktivnosti.txt",novaLinija,function(err){
         if(err) throw err;
       
         return res.json({message:"Uspješno dodana aktivnost!"});
     });
   }else{
      
      return res.json({message:"Aktivnost nije validna!"});
   }
}
   });  
});   


app.delete('/v1/aktivnost/:naziv', (req, res) => {
   const { naziv } = req.params;
   
   let pom2=false;
   var podaci="";
   fs.readFile("aktivnosti.txt", (err,dataBuffer)=>{

      if (err) throw err;
      var lines = dataBuffer.toString().split('\n');
      fs.unlink("aktivnosti.txt", (err) => {
         if (err) {
           console.error(err)
           return
         }
         //file removed
       })
       
      for (i=0;i<lines.length;i++){
         var elements = lines[i].split(',');
         if(elements[0]==naziv){
            pom2=true;
          }else{
           podaci+=lines[i]+"\n";
          }
      }
      console.error(podaci);
      var lines2 = podaci.split('\n');

      var writeStream = fs.createWriteStream("aktivnosti.txt");
      writeStream.end();

      for (j=0;j<lines2.length;j++){
         if(lines2[j].length!=0 && lines2[j].length!=1){
            if(j==0){
               fs.appendFile("aktivnosti.txt",lines2[j],function(err){
                  if(err)  return res.json({message:"Greška - aktivnost nije obrisana!"});
                 
              });
            }else{
     
            fs.appendFile("aktivnosti.txt","\n"+lines2[j],function(err){
               if(err)  return res.json({message:"Greška - aktivnost nije obrisana!"});
              });
            }
         }
      } 
    if(pom2){ return res.json({message:"Uspješno obrisana aktivnost!"});

    }else{
      return res.json({message:"Greška - aktivnost nije obrisana!"});
    }
         
   });   
  });

  app.delete('/v1/predmet/:naziv', (req, res) => {
   const { naziv } = req.params;
   
   let pom2=false;
   var podaci="";
   fs.readFile("predmeti.txt", (err,dataBuffer)=>{

      if (err) throw err;
      var lines = dataBuffer.toString().split('\n');
      fs.unlink("predmeti.txt", (err) => {
         if (err) {
           console.error(err)
           return
         }
         //file removed
       })
      

      for (i=0;i<lines.length;i++){
         if(lines[i]==naziv){
            pom2=true;
          }else{
           podaci+=lines[i]+"\n";
          }
      }
      console.error(podaci);
      var lines2 = podaci.split('\n');


 var writeStream2 = fs.createWriteStream("predmeti.txt");
      writeStream2.end();

      for (j=0;j<lines2.length;j++){
         if(lines2[j].length!=0 && lines2[j].length!=1){
            if(j==0){
               fs.appendFile("predmeti.txt",lines2[j],function(err){
                  if(err) return res.json({message:"Greška - predmet nije obrisan!"});
                 
              });
            }else{
         
            fs.appendFile("predmeti.txt","\n"+lines2[j],function(err){
               if(err) return res.json({message:"Greška - predmet nije obrisan!"});
              });
            }
         }
      } 
  

    if(pom2){ return res.json({message:"Uspješno obrisan predmet!"});

    }else{
      return res.json({message:"Greška - predmet nije obrisan!"});
    
    }
         
   });   
  });


  app.delete('/v1/all', (req, res) => {
   try {
      fs.unlinkSync("aktivnosti.txt")
      //file removed
    } catch(err) {
       res.json({message:"Greška - sadržaj datoteka nije moguće obrisati!"});
       return;
    }
    try {
      fs.unlinkSync("predmeti.txt")
      //file removed
    } catch(err) {
      res.json({message:"Greška - sadržaj datoteka nije moguće obrisati!"});
      return;
    }
    var writeStream = fs.createWriteStream("aktivnosti.txt");
      writeStream.end();
   var writeStream = fs.createWriteStream("predmeti.txt");
      writeStream.end();
    res.json({message:"Uspješno obrisan sadržaj datoteka!"});
});
 app.listen(3000);

 