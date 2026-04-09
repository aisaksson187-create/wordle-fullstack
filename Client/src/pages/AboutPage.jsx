export default function AboutPage() {
  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Om projektet</h1>

      <p>
        Det här projektet är ett Wordle-inspirerat spel byggt med React i frontend
        och Node/Express i backend.
      </p>

      <p>
        Spelet hämtar ett slumpmässigt ord från servern. Användaren kan välja
        ordlängd och om ordet får innehålla upprepade bokstäver.
      </p>

      <p>
        När spelaren gissar ett ord skickas det till backend, där feedback räknas ut.
        Bokstäver visas sedan som rätt placerade, felplacerade eller felaktiga.
      </p>

      <p>
        När spelet är vunnet kan spelaren spara sitt namn i en highscore-lista.
        Highscore-datan lagras i SQLite och visas på en server-renderad sida.
      </p>

      <p>
        Tekniker som används i projektet är React, Vite, Express, EJS och SQLite.
      </p>
    </div>
  );
}