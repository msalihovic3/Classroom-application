function  iscrtajRaspored(mojRasporedDiv,dani,satPocetak,satKraj) {

    
 if(mojRasporedDiv==null ||  !Number.isInteger(satPocetak) || !Number.isInteger(satKraj) || satPocetak>=satKraj ){
      let text=document.createElement('p');
     
      mojRasporedDiv.appendChild(text);
      text.innerHTML = 'Greška';
    }else{
  
    var table = document.createElement('TABLE');
    var tableBody = document.createElement('TBODY');
  
    
    table.appendChild(tableBody);
    mojRasporedDiv.appendChild(table);

    //popunjavanje reda sa satima
    var id=1;
    var tr = document.createElement('TR');
      tableBody.appendChild(tr);
      tr.setAttribute('value',"sati");
      for (var j = satPocetak; j < satKraj-1;j+=2) {
         
        var td = document.createElement('TD');
        td.setAttribute('id',id);
        
        id++;
        if(j==12 && satKraj>13){
        td.setAttribute('colSpan', '6');
       
        td.appendChild(document.createTextNode(j+":00"));
        }
        else if(j>=14 && j!=satKraj){
            td.setAttribute('colSpan', '4');
            
            td.appendChild(document.createTextNode(j+1+":00"));
            td.setAttribute('value',j+1);
        }
            else if(j==satKraj){
                td.setAttribute('colSpan', '4');
            td.appendChild(document.createTextNode(""));
            td.setAttribute('value',j);
        }  else{
         if(j==satPocetak && j%2!=0){
            td.setAttribute('colSpan', '2');
            td.setAttribute('value',j);
            j=j+1;
            tr.appendChild(td);
            var td = document.createElement('TD');
            td.setAttribute('id',id);
            id++;
            td.setAttribute('colSpan', '4');

            if(j<10 ) td.appendChild(document.createTextNode("0"+j+":00"));
            else
            td.appendChild(document.createTextNode(j+":00"));
            td.setAttribute('value',j);
          }
          else{
            td.setAttribute('colSpan', '4');
           
            if(j<10 ) td.appendChild(document.createTextNode("0"+j+":00"));
            else
            td.appendChild(document.createTextNode(j+":00"));
            td.setAttribute('value',j);
          }
         } 
        
            tr.appendChild(td);
          
      }

    //popunjavanje ostalih ćelija tabele
    for (var i = 1; i < dani.length+1; i++) {
      var tr = document.createElement('TR');
      tr.setAttribute('id','tr'+i);
      tableBody.appendChild(tr);
      let a=1;
      if(satPocetak%2==0) a=0;

      for (var j = satPocetak-1; j < satKraj+(satKraj-satPocetak); j++) {
        var td = document.createElement('TD');
        td.setAttribute('id',j);
      
       if(j==satPocetak-1){
   
        td.appendChild(document.createTextNode(dani[i-1]));
        td.setAttribute('value',"dani");
        }
        else{
          
        td.appendChild(document.createTextNode(""));
        td.setAttribute('value',"slobodna");
        
       
        if((j+a)%2==0){
          td.style.border= "1 solid black";
        }else{
          td.style.borderRight = "1 solid ";
          td.style.borderLeft = "2px dashed";
        }
      }
       
        tr.appendChild(td);
      }
    }

     mojRasporedDiv.appendChild(table);
    }
  }



 


  function dodajAktivnost(mojRasporedDiv,naziv,tip,vrijemePocetka,vrijemeKraja,dan) {   
    
    if(mojRasporedDiv==null)
      alert("Greška-raspored nije kreiran");
      
      var indexDana=dani.indexOf(dan);
      var pocetni_sat_tabele = parseInt(mojRasporedDiv.children[0].children[0].children[0].children[0].getAttribute("value"));
      var zadnji_sat_tabele=parseInt(mojRasporedDiv.children[0].children[0].children[0].children[mojRasporedDiv.children[0].children[0].children[0].children.length-1].getAttribute("value"))+2;
       
      let razlika_p=vrijemePocetka-Number.parseInt(vrijemePocetka);
      let razlika_k=vrijemeKraja-Number.parseInt(vrijemeKraja);
      
      if(vrijemePocetka<pocetni_sat_tabele || vrijemeKraja<pocetni_sat_tabele || vrijemePocetka>zadnji_sat_tabele || vrijemeKraja>zadnji_sat_tabele || vrijemePocetka<0 || vrijemePocetka>24 || vrijemeKraja<0 || vrijemeKraja>24 || vrijemePocetka>vrijemeKraja || indexDana==null || indexDana<0){
        alert("Greška - u rasporedu ne postoji dan ili vrijeme u kojem pokušavate dodati termin");
      
      }  else if(razlika_p!=0 && razlika_p!=0.5 || razlika_k!=0 && razlika_k!=0.5){
      
        alert("Greška - u rasporedu ne postoji dan ili vrijeme u kojem pokušavate dodati termin");
      }
     else
        {
          
            indexDana++;
            var celije=vrijemeKraja-vrijemePocetka;
            if(!Number.isInteger(celije)) celije=parseInt(celije)*2+1;
            else celije*=2;
            var pocetak;
            
            //ukoliko imamo sate kao sto su 12.5, 10.5...
            if(!Number.isInteger(vrijemePocetka)) pocetak=parseInt(vrijemePocetka)+1;
            else
            pocetak=vrijemePocetka;
            
        //vrijednost pocetnog sata u tabeli
        
         //razlika sati pocetka aktivnosti i pocetka rasporeda
         var sat_pocetak_id=pocetak - pocetni_sat_tabele;
         var pozicija_elementa_prema_id=pocetak+sat_pocetak_id-1;
       
         let broj_celije=Number.parseInt(mojRasporedDiv.children[0].children[0].children[indexDana].children[1].getAttribute("id"))+sat_pocetak_id*2;
         var x=0;
         var pozicija_novog=Number.parseInt(mojRasporedDiv.children[0].children[0].children[indexDana].children[1].getAttribute("id"));
        
         for(var k=0; k<mojRasporedDiv.children[0].children[0].children[indexDana].children.length; k++){
            
          if(mojRasporedDiv.children[0].children[0].children[indexDana].children[k].getAttribute("value")=="zauzeta"){
            
           var a=0;
        
           if(pozicija_novog>=pozicija_elementa_prema_id){ break;}
            a=Number.parseInt(mojRasporedDiv.children[0].children[0].children[indexDana].children[k+1].getAttribute("id"))-Number.parseInt(mojRasporedDiv.children[0].children[0].children[indexDana].children[k].getAttribute("id"))-1;
           //broj prosirenih celija
            x+=a;
            pozicija_novog+=a;
           
        
          }else
            pozicija_novog++;
          
        }

        let provjera=false;

        //provjera da li postoji pocetna celija i da li je zauzeta
        for(var k=0; k<mojRasporedDiv.children[0].children[0].children[indexDana].children.length; k++){
             
        
          if(Number.parseInt(mojRasporedDiv.children[0].children[0].children[indexDana].children[k].getAttribute("id"))==broj_celije && mojRasporedDiv.children[0].children[0].children[indexDana].children[k].getAttribute("value")!="zauzeta"){
             provjera=true;
          
             //provjera da li su zauzete sve ostale celije koje su potrebe za izvrršavanje aktivnosti
             for(var j=1; j<=celije-1; j++ ){
              
               if(mojRasporedDiv.children[0].children[0].children[indexDana].children[k+j].getAttribute("value")=="zauzeta" || Number.parseInt(mojRasporedDiv.children[0].children[0].children[indexDana].children[k+j].getAttribute("id"))>broj_celije+celije)
                 {
                 
                  provjera=false;
                 } 
                
             }
           
          }
         
        }
       
        if(provjera){
         
        
        //spajanje celija
        if(!Number.isInteger(vrijemePocetka)){
     
        mojRasporedDiv.children[0].children[0].children[indexDana].children[sat_pocetak_id*2-x].colSpan = celije;
        mojRasporedDiv.children[0].children[0].children[indexDana].children[sat_pocetak_id*2-x].setAttribute("value","zauzeta");
        
        var newPar = document.createElement('h');
        var tip1 = document.createElement('p');
       newPar.innerHTML = naziv;
       tip1.innerHTML = tip;
      
    
       mojRasporedDiv.children[0].children[0].children[indexDana].children[sat_pocetak_id*2-x].appendChild(newPar);
       mojRasporedDiv.children[0].children[0].children[indexDana].children[sat_pocetak_id*2-x].appendChild(tip1);
     
       if(!Number.isInteger(vrijemePocetka)){
        mojRasporedDiv.children[0].children[0].children[indexDana].children[sat_pocetak_id*2-x].style.borderLeft = "2px dashed";
      }else{
        mojRasporedDiv.children[0].children[0].children[indexDana].children[sat_pocetak_id*2-x].style.borderLeft = "1px solid";
      }
      if(!Number.isInteger(vrijemeKraja)){
        mojRasporedDiv.children[0].children[0].children[indexDana].children[sat_pocetak_id*2-x].style.borderRight = "2px dashed";
      }else{
        mojRasporedDiv.children[0].children[0].children[indexDana].children[sat_pocetak_id*2-x].style.borderRight = "1px solid";
      }
       //brisanje celija
         
       for(var i=2; i<celije+1; i++){
       
        mojRasporedDiv.children[0].children[0].children[indexDana].children[sat_pocetak_id*2+1-x].remove();
        
     }
        
        } else{
         mojRasporedDiv.children[0].children[0].children[indexDana].children[sat_pocetak_id*2+1-x].colSpan = celije;
         mojRasporedDiv.children[0].children[0].children[indexDana].children[sat_pocetak_id*2+1-x].setAttribute("value","zauzeta");
        
         var newPar = document.createElement('h');
         var tip1 = document.createElement('p');
        
        newPar.innerHTML = naziv;
        tip1.innerHTML = tip;
       
     
        mojRasporedDiv.children[0].children[0].children[indexDana].children[sat_pocetak_id*2+1-x].appendChild(newPar);
        mojRasporedDiv.children[0].children[0].children[indexDana].children[sat_pocetak_id*2+1-x].appendChild(tip1);
        
        if(!Number.isInteger(vrijemePocetka)){
          mojRasporedDiv.children[0].children[0].children[indexDana].children[sat_pocetak_id*2+1-x].style.borderLeft = "2px dashed";
        }else{
          mojRasporedDiv.children[0].children[0].children[indexDana].children[sat_pocetak_id*2+1-x].style.borderRight = "1px solid";
        }
        if(!Number.isInteger(vrijemeKraja)){
          mojRasporedDiv.children[0].children[0].children[indexDana].children[sat_pocetak_id*2+1-x].style.borderRight = "2px dashed";
        }else{
          mojRasporedDiv.children[0].children[0].children[indexDana].children[sat_pocetak_id*2+1-x].style.borderRight = "1px solid";
        }
         //brisanje celija
         
         for(var i=2; i<celije+1; i++){
       
         mojRasporedDiv.children[0].children[0].children[indexDana].children[sat_pocetak_id*2+2-x].remove();
         
      }
   
    }

   

    }else{
      alert("“Greška - već postoji termin u rasporedu u zadanom vremenu”");
    }
        
         }
      
    }



    var dani = ["Ponedjeljak", "Utorak", "Srijeda", "Četvrtak","Petak"];
   let mojRasporedDiv = document.getElementById("mojRaspored1");
  
    iscrtajRaspored(mojRasporedDiv,dani,8,24);
    
    dodajAktivnost(mojRasporedDiv,"WT","predavanje",8.3,12,"Ponedjeljak");
    dodajAktivnost(mojRasporedDiv,"WT","vježbe",12.5,13.5,"Ponedjeljak");
    dodajAktivnost(mojRasporedDiv,"RMA","predavanje",14,17,"Ponedjeljak");
    dodajAktivnost(mojRasporedDiv,"RMA","vježbe",12.5,14,"Utorak");
    dodajAktivnost(mojRasporedDiv,"DM","tutorijal",14,16,"Utorak");
    dodajAktivnost(mojRasporedDiv,"DM","predavanje",16.5,19.5,"Utorak");
    dodajAktivnost(mojRasporedDiv,"DM","predavanje",20,24,"Utorak");
    dodajAktivnost(mojRasporedDiv,"WT","predavanje",12,15,"Ponedjeljak");
    dodajAktivnost(mojRasporedDiv,"WT","predavanje",19,24,"Ponedjeljak");
    dodajAktivnost(mojRasporedDiv,"WT","vježbe",8,11,"Petak");
    dodajAktivnost(mojRasporedDiv,"RMA","vježbe",20,24,"Petak");
    dodajAktivnost(mojRasporedDiv,"RMA","vježbe",21,25,"Četvrtak");


    let mojRasporedDiv2 = document.getElementById("mojRaspored2");
  
   
    iscrtajRaspored(mojRasporedDiv2,dani,9,23);
    dodajAktivnost(mojRasporedDiv2,"WT","predavanje",15,17,"Ponedjeljak");
    dodajAktivnost(mojRasporedDiv2,"WT","predavanje",12,13,"Ponedjeljak");
    dodajAktivnost(mojRasporedDiv2,"WT","predavanje",9,11,"Ponedjeljak");
    dodajAktivnost(mojRasporedDiv2,"DM","predavanje",16,19.5,"Utorak");
    dodajAktivnost(mojRasporedDiv2,"DM","predavanje",20,22,"Utorak");  
    dodajAktivnost(mojRasporedDiv2,"DM","predavanje",18,22,"Utorak"); 
    dodajAktivnost(mojRasporedDiv2,"DM","predavanje",12,17,"Srijeda");
    dodajAktivnost(mojRasporedDiv2,"DM","predavanje",16,20,"Srijeda");
    dodajAktivnost(mojRasporedDiv2,"DM","predavanje",16,20,"Četvrtak");
    dodajAktivnost(mojRasporedDiv2,"DM","predavanje",20,23,"Četvrtak");
    dodajAktivnost(mojRasporedDiv2,"DM","predavanje",8,10,"Četvrtak");