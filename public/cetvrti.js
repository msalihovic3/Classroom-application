
var ajax = new XMLHttpRequest();
var ajax2 = new XMLHttpRequest();
var predmeti=[];
var predmeti2=[];


var x = document.getElementById("naziv");
var y = document.getElementById("aktivnost");

window.onload = function(){
    
    var ajax2 = new XMLHttpRequest();
    ajax2.onreadystatechange = function() {// Anonimna funkcija
        if (ajax2.readyState == 4 && ajax2.status == 200){
            predmeti2=ajax2.responseText;
           // document.getElementById("text").innerHTML = JSON.parse(grupe).lista[i].id;
            for(var i=0; i<JSON.parse(predmeti2).lista.length;i++){
                var option = document.createElement("option");
                option.text = JSON.parse(predmeti2).lista[i].naziv;
              
                x.add(option);
            }
            document.getElementById("text").innerHTML = "pocetno";
         
        }
        if (ajax2.readyState == 4 && ajax2.status == 404)
            document.getElementById("text").innerHTML = "Greska: nepoznat URL";
    }

    //console.log("grupe");
    ajax2.open("GET","http://localhost:3000/v2/grupe", true);
    ajax2.send();

    var ajax= new XMLHttpRequest();
    ajax.onreadystatechange = function() {// Anonimna funkcija
        if (ajax.readyState == 4 && ajax.status == 200){
            predmeti=ajax.responseText;
           // document.getElementById("text").innerHTML = JSON.parse(grupe).lista[i].id;
            for(var i=0; i<JSON.parse(predmeti).lista.length;i++){
                var option = document.createElement("option");
                option.text = JSON.parse(predmeti).lista[i].naziv;
              
                y.add(option);
            }
            document.getElementById("text").innerHTML = "pocetno";
         
        }
        if (ajax.readyState == 4 && ajax.status == 404)
            document.getElementById("text").innerHTML = "Greska: nepoznat URL";
    }

    //console.log("grupe");
    ajax.open("GET","http://localhost:3000/v2/predmeti", true);
    ajax.send();

}


function myFunction() {
    var naziv_grupe=document.getElementById('naziv').value; //naziv grupe selektovane
    var naziv_predmeta=document.getElementById('aktivnost').value; // naziv predmeta aktivnosti 
    var tip =document.getElementById('tip').value;
    var pocetak=document.getElementById('pocetak').value; 
    var kraj =document.getElementById('kraj').value;
    var dan =document.getElementById('dan').value;

    
    var provjeraPredmet=true;
    let aktivnost={}
    let idGrupe;
    let idPredmeta;
    let idTip;
    let idDan;
  /*  for(var i=0; i<predmeti2.length; i++){
       
        if(predmeti2[i]==naziv_predmeta) provjeraPredmet=false;

    }
    for(var i=0; i<predmeti.length; i++){
       
        if(predmeti[i]==naziv_grupe) idGrupe=predmeti[i].id;

    }*/
    for(var i=0; i<JSON.parse(predmeti2).lista.length; i++){
       
        if(JSON.parse(predmeti2).lista[i].naziv==naziv_grupe) idPredmeta=JSON.parse(predmeti2).lista[i].id;

    }
    for(var i=0; i<JSON.parse(predmeti).lista.length; i++){
       
        if(JSON.parse(predmeti).lista[i].naziv==naziv_predmeta) idGrupe=JSON.parse(predmeti2).lista[i].id;

    }
    

    let ajax3 = new XMLHttpRequest();
    var tipJson={};
    tipJson.naziv=tip;
 
 //trazenje id tipa
 ajax3.onreadystatechange = function() {
    if (ajax3.readyState == 4 && ajax3.status == 200){  
        
        idTip= JSON.parse(ajax3.responseText).id;

        ajax4.onreadystatechange = function() {
            if (ajax4.readyState == 4 && ajax4.status == 200){   
               // document.getElementById("demo").innerHTML = JSON.parse(ajax4.responseText).id;   
                idDan= JSON.parse(ajax4.responseText).id;

    aktivnost.naziv=naziv_predmeta;
    var poc=pocetak.split(":");
    aktivnost.pocetak=poc[0]+"."+poc[1];
    var kr=kraj.split(":");
    aktivnost.kraj=kr[0]+"."+kr[1];
    aktivnost.PredmetId=idPredmeta;
    aktivnost.GrupaId=idGrupe;
    aktivnost.tipId=idTip;
    aktivnost.danId=idDan;
    document.getElementById("demo").innerHTML =idPredmeta+"miki";

    dodajAktivnosti(aktivnost,false)

            }  
            if (ajax4.readyState == 4 && ajax4.status == 404){
            
            document.getElementById("demo").innerHTML = "Greska: nepoznat URL";}
            }
            
            ajax4.open("POST", "http://localhost:3000/v2/dan", true);
            ajax4.setRequestHeader("Content-Type", "application/json");
            ajax4.send(JSON.stringify(danJson));

    }  
    if (ajax3.readyState == 4 && ajax3.status == 404){
    
    document.getElementById("demo").innerHTML = "Greska: nepoznat URL";}
    }
    ajax3.open("POST", "http://localhost:3000/v2/tip", true);
    ajax3.setRequestHeader("Content-Type", "application/json");
    ajax3.send(JSON.stringify(tipJson));
    
    let ajax4 = new XMLHttpRequest();
    var danJson={};
    danJson.naziv=dan;

 //trauenje id dana

 
//{naziv:"RMA vjezbe",pocetak:9.0,kraj:10.5,grupa:1,dan:2,tip:1,predmet:3}


      
   
  
}

function dodajAktivnosti(JsonAktivnost,brisanje){
    let ajax1 = new XMLHttpRequest();
    ajax1.onreadystatechange = function() {// Anonimna funkcija
        if (ajax1.readyState == 4 && ajax1.status == 200){
            if(ajax1.responseText=="{\"message\":\"Uspješno dodana aktivnost!\"}"){
            document.getElementById("demo").innerHTML = ajax1.responseText;
        }
            else {
              
                document.getElementById("demo").innerHTML =ajax1.responseText;
        }
        }
        if (ajax1.readyState == 4 && ajax1.status == 404){
            
        document.getElementById("demo").innerHTML = "Greska: nepoznat URL";}

    }
    ajax1.open("POST", "http://localhost:3000/v2/aktivnost", true);
    ajax1.setRequestHeader("Content-Type", "application/json");
    ajax1.send(JSON.stringify(JsonAktivnost));
}




