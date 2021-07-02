let assert = chai.assert;
describe('Operacije', function() {
 describe('iscrtajRaspored ()', function() {
   it('provjera prvog sata ukoliko se kreira tabela sa pocetnom vremenom koja je parna', function() {

    Operacije.iscrtajRaspored(document.getElementById("mojRaspored1"),["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak","Petak"],8,21);

    let tabele= document.getElementsByTagName("table");
    let tekst= document.getElementsByTagName("table")[tabele.length-1].children[0].children[0].children[0].textContent;
     
     assert.equal(tekst, "08:00","Broj redova treba biti 3");

   });
   it('provjera prvog sata ukoliko se kreira tabela sa pocetnom vremenom koja nije parna', function() {

    Operacije.iscrtajRaspored(document.getElementById("mojRaspored1"),["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak","Petak"],9,21);

    let tabele= document.getElementsByTagName("table");
    let tekst= document.getElementsByTagName("table")[tabele.length-1].children[0].children[0].children[0].textContent;
     
     assert.equal(tekst, "","Broj redova treba biti 3");

   });
   it('provjera do koji je zadnji sat oznacen u tabeli', function() {

    Operacije.iscrtajRaspored(document.getElementById("mojRaspored1"),["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak","Petak"],9,24);

    let tabele= document.getElementsByTagName("table");
    let brojcelija=document.getElementsByTagName("table")[tabele.length-1].children[0].children[0].children.length;
    let tekst= document.getElementsByTagName("table")[tabele.length-1].children[0].children[0].children[brojcelija-1].textContent;
 

     assert.equal(tekst, "23:00","Broj redova treba biti 3");

   });

   it('provjera do koji je zadnji sat oznacen u tabeli', function() {

    Operacije.iscrtajRaspored(document.getElementById("mojRaspored1"),["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak","Petak"],9,24);

    let tabele= document.getElementsByTagName("table");
    let brojcelija=document.getElementsByTagName("table")[tabele.length-1].children[0].children[0].children.length;
    let tekst= document.getElementsByTagName("table")[tabele.length-1].children[0].children[0].children[brojcelija-1].textContent;
 

     assert.equal(tekst, "23:00","Broj redova treba biti 3");

   });
   
   it('provjera koliko raspored ima redova(dana)', function() {
    var dani=["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak","Petak"];
    Operacije.iscrtajRaspored(document.getElementById("mojRaspored1"),dani,9,24);

    let tabele= document.getElementsByTagName("table");

    let tabela= document.getElementsByTagName("table")[tabele.length-1];
 
    let redovi = tabela.getElementsByTagName("tr");
     assert.equal(redovi.length-1, dani.length,"Broj redova za dane rasporeda treba biti isti kao i broj elemenata u nizu dana");
   

   });

   it('provjera koji je prvi dan u rasporedu', function() {
    var dani=["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak","Petak"];
    Operacije.iscrtajRaspored(document.getElementById("mojRaspored1"),dani,9,24);

    let tabele= document.getElementsByTagName("table");

    let prvi_dan= document.getElementsByTagName("table")[tabele.length-1].children[0].children[1].children[0].textContent;
 
     assert.equal(prvi_dan, dani[0],"prvi dan treba biti isti kao i prvi element u nizu dana");
   

   });

   it('provjera koji je zadnji dan u rasporedu', function() {
    var dani=["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak","Petak"];
    Operacije.iscrtajRaspored(document.getElementById("mojRaspored1"),dani,9,23);

    let tabele= document.getElementsByTagName("table");

    let redovi= document.getElementsByTagName("table")[tabele.length-1].children[0].children.length;
    
    let zadnji_dan= document.getElementsByTagName("table")[tabele.length-1].children[0].children[redovi-1].children[0].textContent;

     assert.equal(zadnji_dan, dani[dani.length-1],"zadnji dan treba biti isti kao i prvi element u nizu dana");
   

   });

   it('testiranje boje ćelija', function() {
    var dani=["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak","Petak"];
    Operacije.iscrtajRaspored(document.getElementById("mojRaspored1"),dani,9,23);

    let tabele= document.getElementsByTagName("table");

    let redovi= document.getElementsByTagName("table")[tabele.length-1].children[0].children.length;
    
    let boja= window.getComputedStyle(document.getElementsByTagName("table")[tabele.length-1].children[0].children[1].children[1], null).getPropertyValue("background-color");;
   
     assert.equal(boja, "rgb(224, 228, 228)","boja treba biti rgb(224, 228, 228)");
   
   });
   it('testiranje greske ako je poslan sat decimalnog oblik', function() {
   let dani=["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak","Petak"];
    Operacije.iscrtajRaspored(document.getElementById("mojRaspored1"),dani,9.5,23);
    let broj_p=document.getElementsByTagName("p").length;
    assert.equal(document.getElementsByTagName("p")[broj_p-1].textContent,"Greška","Pri kreiranju tabele sati trebaju biti cijeli brojevi");
   
   });

   it('testiranje greske ako referenca nije kreirana', function() {
    let dani=["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak","Petak"];
     var text=Operacije.iscrtajRaspored(document.getElementById("raspored"),dani,9,23);
 
     assert.equal(text,"Greška","Pri kreiranju tabele sati trebaju biti cijeli brojevi");
    
    });

    it('testiranje greške ako početno vrijeme rasporeda nije cijeli broj', function() {
      let dani=["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak","Petak"];
       var text=Operacije.iscrtajRaspored(document.getElementById("raspored"),dani,9.5,23);
   
       assert.equal(text,"Greška","Pri kreiranju tabele sati trebaju biti cijeli brojevi");
      
      });

      it('testiranje greške ako je pocetno vrijeme ima veću vrijednost od krajnjeg vremena rasporeda', function() {
        let dani=["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak","Petak"];
         var text=Operacije.iscrtajRaspored(document.getElementById("raspored"),dani,17,15);
     
         assert.equal(text,"Greška","Pri kreiranju tabele sati trebaju biti cijeli brojevi");
        
        });

 });

 describe('dodajAktivnost ()', function() {
   
  it('testiranje kreiranja aktivnosti gdje je početni sat jednak pocetnom satu rasporedu', function() {
    Operacije.dodajAktivnost(document.getElementById("mojRaspored1"),"WT","predavanje",19,24,"Ponedjeljak");


   Operacije.dodajAktivnost(document.getElementById("mojRaspored1"),"RMA","vježbe",8,12,"Ponedjeljak");
   
    assert.equal( document.getElementsByTagName("table")[0].children[0].children[1].children[1].getAttribute("value"),"zauzeta");
   
    
    });

    it('testiranje kreiranja aktivnosti gdje je krajnji sad jednak krajnjem satu rasporedu', function() {

      Operacije.dodajAktivnost(document.getElementById("mojRaspored1"),"WT","predavanje",19,24,"Ponedjeljak");

      let broj_celija=document.getElementsByTagName("table")[0].children[0].children[1].children.length;
    
      assert.equal( document.getElementsByTagName("table")[0].children[0].children[1].children[broj_celija-1].getAttribute("value"),"zauzeta");
     
      
      });

    

    it('testiranje naziv predmeta u kreiranoj aktivnosti', function() {

   
    assert.equal( document.getElementsByTagName("table")[0].children[0].children[1].children[1].children[0].textContent,"RMA");
       
        
    });

    it('testiranje tip aktivnosti', function() {

   
     assert.equal( document.getElementsByTagName("table")[0].children[0].children[1].children[1].children[1].textContent,"vježbe");
         
          
    });
    it('testiranje kreirane aktivnosti u prvom danu rasporeda', function() {
            
      let br=0;
      Operacije.dodajAktivnost(document.getElementById("mojRaspored1"),"WT","predavanje",15,17,"Ponedjeljak");
      for (var i = 1; i < document.getElementsByTagName("table")[0].children[0].children[1].children.length; i++)       {
            if ( document.getElementsByTagName("table")[0].children[0].children[1].children[i].getAttribute('value') == "zauzeta") { br++; }
        }
       
      assert.equal(br,3);
           
            
      });

      it('testiranje kreirane aktivnosti kada saljemo necijele sate', function() {
            
        let br=0;
        Operacije.dodajAktivnost(document.getElementById("mojRaspored1"),"WT","predavanje",12.5,17.5,"Utorak");
             
        assert.equal(document.getElementsByTagName("table")[0].children[0].children[2].children[10].getAttribute('value'),"zauzeta");
      });

      it('testiranje greske kreirane aktivnosti-daj li ce se broj aktivnosti povecati', function() {
            
        Operacije.dodajAktivnost(document.getElementById("mojRaspored1"),"WT","predavanje",10,12,"Ponedjeljak");
              
          let br=0;
           
          for (var i = 1; i < document.getElementsByTagName("table")[0].children[0].children[1].children.length; i++)       {
               if ( document.getElementsByTagName("table")[0].children[0].children[1].children[i].getAttribute('value') == "zauzeta") { br++; }
          }
           
          assert.equal(br,3);
            
         });

        it('testiranje greske kreirane aktivnosti-ukoliko se poklopi nova aktivnost sa već postojećom', function() {
            
          Operacije.dodajAktivnost(document.getElementById("mojRaspored1"),"RMA","predavanje",8,12,"Ponedjeljak");
          assert.equal( document.getElementsByTagName("table")[0].children[0].children[1].children[1].children[0].textContent,"RMA");
          assert.equal( document.getElementsByTagName("table")[0].children[0].children[1].children[1].children[1].textContent,"vježbe");
                
        });

      

        it('testiranje greske kreirane aktivnosti ukoliko je pocetak aktivnosti manji sat od pocetnog vremena rasporeda', function() {
            
          let text=Operacije.dodajAktivnost(document.getElementById("mojRaspored1"),"RMA","predavanje",6,10,"Ponedjeljak");
          
          assert.equal( text,"Greška - u rasporedu ne postoji dan ili vrijeme u kojem pokušavate dodati termin");
          alert(text);
        });

        it('testiranje greske kreirane aktivnosti-ukoliko se poklopi nova aktivnost sa već postojećom2', function() {
            
          let text =Operacije.dodajAktivnost(document.getElementById("mojRaspored1"),"OOI","predavanje",11,13,"Ponedjeljak");
          alert(text);
          assert.equal( text,"Greška - već postoji termin u rasporedu u zadanom vremenu");
         
                
        });

        it('testiranje greske ukoliko raspored u koji zelimo dodati aktivnost nije kreiran', function() {
            
          let text=Operacije.dodajAktivnost(document.getElementById("mojRaspored"),"RMA","predavanje",9,10,"Ponedjeljak");
          
          assert.equal( text,"Greška-raspored nije kreiran");
          alert(text);
        });

       
});
});



//Operacije.dodajAktivnost(mojRasporedDiv,"WT","predavanje",9,12,"Ponedjeljak");
//Operacije.dodajAktivnost(mojRasporedDiv,"WT","vježbe",12.5,13.5,"Ponedjeljak");
//Operacije.dodajAktivnost(mojRasporedDiv,"RMA","predavanje",14,17,"Ponedjeljak");

//Operacije.dodajAktivnost(mojRasporedDiv,"RMA","vježbe",12.5,14,"Utorak");
//Operacije.dodajAktivnost(mojRasporedDiv,"DM","tutorijal",14,16,"Utorak");
//Operacije.dodajAktivnost(mojRasporedDiv,"DM","predavanje",16,19,"Utorak");
//Operacije.dodajAktivnost(mojRasporedDiv,"WT","predavanje",12,15,"Ponedjeljak"); 