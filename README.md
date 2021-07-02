SPIRALA 4
GET tute servera za imam u dvije varijante za svaku tabelu:
               -prva vraca sve vrijednosti iz tabele a rute glase tako sto nativ tabele stavitmo u mnozinu (npr. GET /v2/predmeti, GET /v2/grupe..)
			   -druga vraca samo jedan red tabele gdje u saljemo id elementa tj reda kojeg zelimo (nrp. GET /v2/predmet/:id)

Kako unosim podatke u tabele primjeri:
  naziv predmeta: WT
  naziv grupa: WTGrupa1
  naziv aktivnosti: WT
  
Treći zadatak ima mogucnost dodavanja aktivnosti samo za one PREDEMETE koji postoje u bazi kao i za one GRUPE koje postoje u bazi. Prikioom pokretanja forme studenti.html
popune se forme sa podacima koji se nalaze u bazi te s tim omogućavamo da mozemo izabrati samo ispravne grupe i predmete.

testove pokrećem tako sto u Commant Promt pozovem kao npm test