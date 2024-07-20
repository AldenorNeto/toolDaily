const fs = require("fs");
const path = require("path");
const jsdom = require("jsdom");
const { v4: uuidv4 } = require("uuid");
const { JSDOM } = jsdom;

const inputDir = path.join(__dirname, "indices");
const outputFile = path.join(__dirname, "../showD/agenda.json");

function processarHTML(inputFile) {
  return new Promise((resolve, reject) => {
    fs.readFile(inputFile, "utf8", (err, dataHTML) => {
      if (err) {
        console.error("Erro ao ler o arquivo:", err);
        reject(err);
        return;
      }

      const dom = new JSDOM(dataHTML);
      const document = dom.window.document;

      const activitiesContainer = document.querySelector(
        "#js-activities-container"
      );
      const subElement = activitiesContainer.querySelectorAll(".timeline-panel");
      const elementsArray = Array.from(subElement);

      const filtrosFinalizado = elementsArray.map((element) => {
        const title = element
          .querySelector("span")
          .textContent.trim()
          .split("    ")[0]
          .replaceAll(/\n/g, "");

        const arrayperiodos = Array.from(element.querySelectorAll("small"))[1]
          .textContent.trim()
          .split("    ");

        const subTitle = Array.from(element.querySelectorAll("small"))[0]
          .textContent.trim()
          .split("    ")[0]
          .replace("  ", " ");

        const periodo = arrayperiodos[arrayperiodos.length - 1]
          .trim()
          .replace("Período:", "")
          .trim();

        return { title, subTitle, id: uuidv4(), periodo };
      });

      const simplifiedHTML = {
        name: path.basename(inputFile, path.extname(inputFile)).split('-')[1].split('(')[0].trim(),
        task: filtrosFinalizado,
      };

      resolve(simplifiedHTML);
    });
  });
}

fs.readdir(inputDir, async (err, files) => {
  if (err) {
    console.error("Erro ao ler o diretório:", err);
    return;
  }

  const htmlFiles = files.filter((file) => path.extname(file) === ".html");
  const objetosArray = [];

  for (const file of htmlFiles) {
    const inputFile = path.join(inputDir, file);
    const processedData = await processarHTML(inputFile);
    objetosArray.push(processedData);
  }

  fs.writeFile(outputFile, JSON.stringify(objetosArray, null, 2), (err) => {
    if (err) {
      console.error("Erro ao salvar o arquivo:", err);
      return;
    }
    console.log("Arquivo processado e salvo com sucesso!");
  });
});
