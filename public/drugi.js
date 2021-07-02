


var grupe=[];
var x = document.getElementById("mySelect");

window.onload = function(){
    
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {// Anonimna funkcija
        if (ajax.readyState == 4 && ajax.status == 200){
            grupe=ajax.responseText;
           // document.getElementById("text").innerHTML = JSON.parse(grupe).lista[i].id;
            for(var i=0; i<JSON.parse(grupe).lista.length;i++){
                var option = document.createElement("option");
                option.text = JSON.parse(grupe).lista[i].naziv;
              
                x.add(option);
            }
            document.getElementById("text").innerHTML = "pocetno";
         
        }
        if (ajax.readyState == 4 && ajax.status == 404)
            document.getElementById("text").innerHTML = "Greska: nepoznat URL";
    }

    //console.log("grupe");
    ajax.open("GET","http://localhost:3000/v2/grupe", true);
    ajax.send();
}





function posaljiStudenta(){
    var grupa=document.getElementById('mySelect').value; // Tekstualno polje forme
    let idGrupe=0;

    var studenti =document.getElementById('w3review').value.split('\n');
   // document.getElementById("text").innerHTML = grupa;
    
   
    for (var i = 0; i < JSON.parse(grupe).lista.length; i++) {
         var naziv=JSON.parse(grupe).lista[i].naziv;
         var idGru=JSON.parse(grupe).lista[i].id;
       if(grupa==naziv){
            //document.getElementById("text").innerHTML =JSON.parse(grupe).lista[i].id;
           // document.getElementById("text").innerHTML = "JSON.parse(grupe).lista[i].naziv"; 
            idGrupe=Number(idGru);
           //document.getElementById("text").innerHTML = "idGrupe";
        }
    }
    
  
    var studentiJson= [];
    for (var i = 0; i < studenti.length-1; i++) {
        var elementi = studenti[i].split(",");



        var student = {
          ime: elementi[0],
          index: elementi[1],
          id: idGrupe
        };
        
        studentiJson.push(student);
      }
      document.getElementById("text").innerHTML = student.id;
    var lista ={"lista": studentiJson};
 let ajax1 = new XMLHttpRequest();
 ajax1.onreadystatechange = function() {// Anonimna funkcija
     if (ajax1.readyState == 4 && ajax1.status == 200){
       
         document.getElementById('w3review').value = ajax1.responseText;
     }
     if (ajax1.readyState == 4 && ajax1.status == 404){
     document.getElementById("text").innerHTML = "Greska: nepoznat URL";
    }

 }
 
 ajax1.open("POST", "http://localhost:3000/v2/studenti", true);
 ajax1.setRequestHeader("Content-Type", "application/json");  
 ajax1.send(JSON.stringify(lista));
}