function downloadPage() {
  const content = document.documentElement.outerHTML;
  const blob = new Blob([content], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const getTimeSlice = String(new Date().getTime()).slice(0, 10);
  a.href = url;
  a.download = `CronoUNOPAR${getTimeSlice}.html`;
  a.click();
  URL.revokeObjectURL(url);
}

function clearTaskLists() {
  document.getElementById("futureTasks").innerHTML = "";
  document.getElementById("currentTasks").innerHTML = "";
  document.getElementById("pastTasks").innerHTML = "";
  document.getElementById("scheduleContainer").innerHTML = "";
}

async function carregarDados() {
  try {
    const resposta = await fetch(`/data`);
    const data = await resposta.json();
    processTasks(data);
    generateCards(data);
  } catch (erro) {
    console.error("Falha ao carregar os dados da rota /data", erro);
  }
}

function processTasks(data) {
  const futureTasksList = document.getElementById("futureTasks");
  const currentTasksList = document.getElementById("currentTasks");
  const pastTasksList = document.getElementById("pastTasks");

  const flatTasks = data.flatMap((v) =>
    v.task.map((j) => ({ ...j, contentLabel: v.name, courseId: v.id }))
  );
  const futureTasks = flatTasks.filter((task) => isFutureDate(task.periodo));
  const currentTasks = flatTasks.filter((task) => isCurrentDate(task.periodo));
  const pastTasks = flatTasks.filter((task) => isPastDate(task.periodo));

  appendTasksToList(futureTasks, futureTasksList, true);
  appendTasksToList(currentTasks, currentTasksList);
  appendTasksToList(pastTasks, pastTasksList, false, true);
}

function appendTasksToList(
  tasks,
  listElement,
  isFuture = false,
  isPast = false
) {
  tasks.sort(
    (a, b) => new Date(startDate(a.periodo)) - new Date(startDate(b.periodo))
  );
  tasks.forEach((task) => {
    const taskItem = document.createElement("li");
    const datePart = isFuture
      ? task.periodo.split(" - ")[0]
      : isPast
      ? task.periodo.split(" - ")[1]
      : task.periodo;
    const contentLabel = `${task.contentLabel} - ${task.title} - ${datePart}`;
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done || false;
    const statusTag = document.createElement("span");
    statusTag.textContent = task.done ? "Concluído" : "";
    statusTag.style.color = "green";
    statusTag.style.marginLeft = "10px";

    checkbox.addEventListener("change", (event) => {
      enviarRequisicao(task, event.target.checked);
    });
    taskItem.appendChild(checkbox);
    taskItem.appendChild(document.createTextNode(contentLabel));
    taskItem.appendChild(statusTag);

    taskItem.addEventListener("click", (event) => {
      if (event.target !== checkbox) {
        checkbox.checked = !checkbox.checked;
        enviarRequisicao(task, checkbox.checked);
      }
    });

    listElement.appendChild(taskItem);
  });
}

function generateCards(data) {
  const container = document.getElementById("scheduleContainer");
  container.innerHTML = "";

  data.forEach((course) => {
    const courseDiv = document.createElement("div");
    courseDiv.classList.add("card");

    const title = document.createElement("h2");
    title.textContent = course.name;
    courseDiv.appendChild(title);

    const taskList = document.createElement("ul");
    course.task.forEach((task) => {
      if (isCurrentOrFutureDate(task.periodo)) {
        const taskItem = document.createElement("li");
        taskItem.innerHTML = `
        <strong>${task.title}</strong>
        <br>
        ${task.subTitle}
        <br>
        <em>${task.periodo}</em>`;
        taskList.appendChild(taskItem);
      }
    });
    courseDiv.appendChild(taskList);

    container.appendChild(courseDiv);
  });
}

function startDate(dateString) {
  const [day, month, year] = dateString.split(" - ")[0].split("/");
  return new Date(
    parseInt(year, 10) + 2000,
    parseInt(month, 10) - 1,
    parseInt(day, 10)
  );
}

function endDate(dateString) {
  const [day, month, year] = dateString.split(" - ")[1].split("/");
  return new Date(
    parseInt(year, 10) + 2000,
    parseInt(month, 10) - 1,
    parseInt(day, 10)
  );
}

function isFutureDate(periodo) {
  const currentDate = new Date().setHours(0, 0, 0, 0);
  return startDate(periodo) > currentDate;
}

function isCurrentDate(periodo) {
  const currentDate = new Date().setHours(0, 0, 0, 0);
  return startDate(periodo) <= currentDate && endDate(periodo) >= currentDate;
}

function isCurrentOrFutureDate(periodo) {
  const currentDate = new Date().setHours(0, 0, 0, 0);
  return endDate(periodo) >= currentDate;
}

function isPastDate(periodo) {
  const currentDate = new Date().setHours(0, 0, 0, 0);
  return endDate(periodo) < currentDate;
}

async function enviarRequisicao(task, done) {
  const { id } = task;
  try {
    const resposta = await fetch("/checked", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, done }),
    });
    if (!resposta.ok) {
      throw new Error("Falha ao enviar requisição para o backend");
    }

    clearTaskLists();
    carregarDados();
  } catch (erro) {
    console.error("Erro ao enviar requisição para o backend:", erro);
  }
}

function createScheduleHTML() {
  const body = document.body;

  const h1 = document.createElement('h1');
  h1.innerHTML = `Cronograma UNOPAR <button class="download-button" onclick="downloadPage()">Baixar Página</button>`;

  const futureTasksDiv = document.createElement('div');
  futureTasksDiv.className = 'task-list';
  futureTasksDiv.innerHTML = '<h2>Tarefas Futuras</h2><ol id="futureTasks"></ol>';

  const currentTasksDiv = document.createElement('div');
  currentTasksDiv.className = 'task-list';
  currentTasksDiv.innerHTML = '<h2>Tarefas Atuais</h2><ol id="currentTasks"></ol>';

  const pastTasksDiv = document.createElement('div');
  pastTasksDiv.className = 'task-list';
  pastTasksDiv.innerHTML = '<h2>Tarefas Passadas</h2><ol id="pastTasks"></ol>';

  const scheduleWrapperDiv = document.createElement('div');
  scheduleWrapperDiv.className = 'schedule-container-wrapper';
  scheduleWrapperDiv.innerHTML = '<h2>Cronograma</h2><div class="container" id="scheduleContainer"></div>';

  body.appendChild(h1);
  body.appendChild(futureTasksDiv);
  body.appendChild(currentTasksDiv);
  body.appendChild(pastTasksDiv);
  body.appendChild(scheduleWrapperDiv);
}

createScheduleHTML();
carregarDados();
