const app = require("../prvi");
const chai = require("chai");
const chaiHttp = require("chai-http");
var assert = chai.assert;
var expect = chai.expect;
chai.use(chaiHttp);
var should=chai.should();
const bodyParser = require("body-parser");
const { json } = require("express");
const fs = require('fs');

let tests;

let zahtjevi=fs.readFileSync('./testniPodaci.txt', 'utf-8');
tests=zahtjevi.toString().split("\n");

for(var i=0; i<tests.length-1; i++){
 
  let elementi=tests[i].split(",");

  if(elementi[0]=="GET"){
    let p=elementi[3].replace(/\\/g, "");
    let s="";
    if(elementi.length>4){
      s=","+s;
    for(var j=4; j<elementi.length; j++)
    if(j==elementi.length-1)
    s+=elementi[j].replace(/\\/g, "");
    else
   s+=elementi[j].replace(/\\/g, "")+",";
   
    }
  
describe('Testiranje ruta', function () {

describe('', function () {

 it('GET '+ elementi[1], function () {
  
 chai.request('http://localhost:3000')
 .get(elementi[1])
 .end(function (err, res) {
 
  assert.equal(JSON.stringify(res.body)+"\r",p+s);
 

 });

 });

});
}); 
}else if(elementi[0]=="POST"){
 

  let zahtjev2;
  let izlaz2;

  if(elementi[1]=="/aktivnost"){
  zahtjev2=elementi[2].replace(/\\/g, "")+","+ elementi[3].replace(/\\/g, "")+","+elementi[4].replace(/\\/g, "")+","+elementi[5].replace(/\\/g, "")+","+elementi[6].replace(/\\/g, "");
  izlaz2=elementi[7].replace(/\\/g, "");

}else{
  zahtjev2=elementi[2].replace(/\\/g, "");
  izlaz2=elementi[3].replace(/\\/g, "");
}

  describe('Testiranje ruta', function () {
     
    describe('', function () {
 
  it('POST '+elementi[1], function () {
    chai.request('http://localhost:3000')
    .post(elementi[1])
    .send(JSON.parse(zahtjev2))
    .end(function (err, res) {
     assert.equal(JSON.stringify(res.body)+"\r",izlaz2);
    });
   });
  });
});

}else{
  describe('Testiranje ruta', function () {

    describe('', function () {


  it('DELETE '+elementi[1], function () {
    chai.request('http://localhost:3000')
    .delete(elementi[1])
    .end(function (err, res) {

     assert.equal(JSON.stringify(res.body)+"\r",elementi[3].replace(/\\/g, ""));
    });
   });
  });
});
}

}
