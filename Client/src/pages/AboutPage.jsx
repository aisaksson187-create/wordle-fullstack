export default function AboutPage() {
  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Om projektet</h1>

      <p>
        Det här projektet är ett Wordle spel som är skapat för fullstack kursen.
      </p>

      <p>
        Spelet hämtar ett slumpmässigt ord från servern. Användaren kan välja
        ordets längd och om ordet får innehålla upprepade bokstäver.
      </p>

      <p>
        När du som spelare gissat ett ord skickas det till backend, där kontrolleras svaret om det är rätt, 
        fel eller innehåller rätt bokstäver men på fel plats.
      </p>

      <p>
        När spelaren vunnit så kan hen spara sitt namn i en highscore lista genom att fylla i fältet.
        Highscore-datan lagras i SQLite och visas på en server-side renderad sida.
      </p>

      <p>
        Projektet är skapat med hjälp av React, Vite, Express, EJS och SQLite.
      </p>
    </div>
  );
}