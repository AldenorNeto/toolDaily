const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 5550;

app.use(express.json());
app.use(express.static("."));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/data", (req, res) => {
  fs.readFile("./agenda.json", "utf8", (err, data) => {
    if (err) {
      console.error("Erro ao ler o arquivo JSON:", err);
      return res.status(500).json({ error: "Erro ao ler o arquivo JSON" });
    }
    res.json(JSON.parse(data));
  });
});

app.post("/checked", (req, res) => {
  const { id, done } = req.body;

  fs.readFile("./agenda.json", "utf8", (err, data) => {
    if (err) {
      console.error("Erro ao ler o arquivo JSON:", err);
      return res.status(500).json({ error: "Erro ao ler o arquivo JSON" });
    }

    let agenda = JSON.parse(data);

    for (let course of agenda) {
      for (let task of course.task) {
        if (task.id === id) {
          task.done = done;
        }
      }
    }

    fs.writeFile(
      "./agenda.json",
      JSON.stringify(agenda, null, 2),
      "utf8",
      (err) => {
        if (err) {
          console.error("Erro ao escrever no arquivo JSON:", err);
          return res
            .status(500)
            .json({ error: "Erro ao escrever no arquivo JSON" });
        }
        res.json(agenda);
      }
    );
  });
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/`);
});
