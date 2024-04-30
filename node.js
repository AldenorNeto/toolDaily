const fs = require("fs");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const name = "Engenharia de Software";

function processarHTML(inputFile, outputFile) {
  fs.readFile(inputFile, "utf8", (err, dataHTML) => {
    if (err) {
      console.error("Erro ao ler o arquivo:", err);
      return;
    }

    fs.readFile(outputFile, "utf8", (err, dataJSON) => {
      if (err) {
        console.error("Erro ao ler o arquivo:", err);
        return;
      }

      const objetosArray = JSON.parse(dataJSON);
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

        return { title, subTitle, periodo };
      });

      const simplifiedHTML = [
        { name, task: filtrosFinalizado },
        ...objetosArray,
      ];
      const htmlString = JSON.stringify(simplifiedHTML);

      fs.writeFile(outputFile, htmlString, (err) => {
        if (err) {
          console.error("Erro ao salvar o arquivo:", err);
          return;
        }
        console.log("Arquivo processado e salvo com sucesso!");
      });
    });
  });
}

processarHTML("fonte.html", "agenda.json");
