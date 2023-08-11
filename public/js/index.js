import "@babel/polyfill";
import { showAlert } from "./alerts";
import axios from "../../node_modules/axios/index";
import { login, logout, updateSettings } from "./login";

const change = document.querySelector(".change");
const form = document.querySelector(".form-login");
const newTask = document.querySelector(".add-task");
const columns = document.querySelectorAll(".column");
const newMember = document.querySelector(".newMember");
const newProject = document.querySelector(".add-card");
const createTask = document.querySelector(".taskForm");
const formNewTask = document.querySelector(".formTask");
const background = document.querySelector(".background");
const formSingup = document.querySelector(".formSignup");
const logOutBtn = document.querySelectorAll(".btnLogout");
const settingsBtn = document.querySelector("#settingsBtn");
const information = document.querySelector(".information");
const deleteUser = document.querySelectorAll(".deleteUser");
const changeName = document.querySelector(".projectChange");
const createProject = document.querySelector(".projectform");
const formNewProject = document.querySelector(".formProject");
const changePassword = document.querySelector(".changePassword");
const containerSettingsBtn = document.querySelector(".user-container");
const settingsContainer = document.querySelector(".setting-container");
const containerTask = document.querySelectorAll(".container-completed");
const containerDelete = document.querySelector(".containerDelete");
if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    login({ email, password }, "login");
  });
}

if (containerSettingsBtn) {
  containerSettingsBtn.addEventListener("click", () => {
    settingsContainer.classList.toggle("setting-container-btn");

    if (settingsContainer.classList.contains("setting-container-btn")) {
      settingsBtn.innerHTML =
        '<span class="material-symbols-outlined">keyboard_control_key</span>';
    } else {
      settingsBtn.innerHTML =
        '<span class="material-symbols-outlined">expand_more</span>';
    }
  });
}

if (logOutBtn) logOutBtn.forEach((e) => e.addEventListener("click", logout));

if (change) {
  change.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = e.target[1].value;
    const name = e.target[0].value;

    updateSettings({ name, email }, "data");
  });
}

if (changePassword) {
  changePassword.addEventListener("submit", async (e) => {
    e.preventDefault();

    document.querySelector(".btn--save-password").textContent = "Updating...";

    const passwordCurrent = e.target[0].value;
    const password = e.target[1].value;
    const passwordConfirm = e.target[2].value;

    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      "password"
    );
    document.querySelector(".btn--save-password").textContent = "Save password";
    e.target[0].value = "";
    e.target[1].value = "";
    e.target[2].value = "";
  });
}

if (formSingup) {
  formSingup.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const passwordConfirm = e.target[3].value;

    login({ name, email, password, passwordConfirm }, "signup");
  });
}

if (newProject) {
  newProject.addEventListener("click", () => {
    formNewProject.classList.add("active");
  });
}

if (newTask) {
  newTask.addEventListener("click", () => {
    formNewTask.classList.add("active");
  });
}

if (background) {
  background.addEventListener("click", () => {
    if (formNewProject) formNewProject.classList.remove("active");
    else if (formNewTask) formNewTask.classList.remove("active");
  });
}

if (columns.length != 0) {
  document.addEventListener("dragstart", (e) => {
    e.target.classList.add("dragging");
  });
  document.addEventListener("dragend", async (e) => {
    try {
      const res = await axios({
        method: "PATCH",
        url: `/api/v1/tasks/${e.target.id}`,
        data: {
          status: e.target.parentElement.id,
        },
      });
    } catch (err) {
      showAlert("error", err.response.data.message);
    }
    e.target.classList.remove("dragging");
  });

  columns.forEach((items) => {
    items.addEventListener("dragover", async (e) => {
      const dragging = document.querySelector(".dragging");
      items.insertAdjacentElement("beforeend", dragging);
    });
  });
}

if (createProject) {
  createProject.addEventListener("submit", async (e) => {
    try {
      e.preventDefault();

      const name = e.target[0].value;
      const description = e.target[1].value;

      const res = await axios({
        method: "POST",
        url: `/api/v1/projects`,
        data: {
          name,
          description,
        },
      });

      if (res.data.status === "success") {
        showAlert("success", `project created successfully!`);

        window.setTimeout(() => {
          location.reload(true);
        }, 800);
      }
    } catch (err) {
      showAlert("error", err.response.data.message);
    }
  });
}

if (createTask) {
  createTask.addEventListener("submit", async (e) => {
    try {
      e.preventDefault();

      const formData = new FormData(e.target);
      formData.append("project", window.location.href.split("/")[4]);
      const data = Object.fromEntries(formData);

      const res = await axios({
        method: "POST",
        url: `/api/v1/tasks`,
        data,
      });

      if (res.data.status === "success") {
        showAlert("success", `Task created successfully!`);

        window.setTimeout(() => {
          location.reload(true);
        }, 800);
      }
    } catch (err) {
      showAlert("error", err.response.data.message);
    }
  });
}

if (changeName) {
  changeName.addEventListener("submit", async (e) => {
    try {
      e.preventDefault();

      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);

      const res = await axios({
        method: "PATCH",
        url: `/api/v1/projects/${window.location.href.split("/")[4]}`,
        data,
      });

      if (res.data.status === "success") {
        showAlert("success", `project created successfully!`);

        window.setTimeout(() => {
          location.reload(true);
        }, 800);
      }
    } catch (err) {
      showAlert("error", err.response.data.message);
    }
  });
}

if (newMember) {
  newMember.addEventListener("submit", async (e) => {
    try {
      e.preventDefault();

      const member = e.target[0].value;

      const res = await axios({
        method: "PATCH",
        url: `/api/v1/projects/updateMembers/${
          window.location.href.split("/")[4]
        }`,
        data: {
          member,
        },
      });

      if (res.data.status === "success") {
        showAlert("success", `project created successfully!`);

        window.setTimeout(() => {
          location.reload(true);
        }, 800);
      }
    } catch (err) {
      showAlert("error", err.response.data.message);
    }
  });
}

if (deleteUser) {
  deleteUser.forEach((e) => {
    e.addEventListener("click", async (e) => {
      try {
        const member = e.target.id;

        const res = await axios({
          method: "PATCH",
          url: `/api/v1/projects/deleteMembers/${
            window.location.href.split("/")[4]
          }`,
          data: {
            member,
          },
        });

        if (res.data.status === "success") {
          showAlert("success", `successfully deleted user!`);

          window.setTimeout(() => {
            location.reload(true);
          }, 800);
        }
      } catch (err) {
        showAlert("error", err.response.data.message);
      }
    });
  });
}

if (containerTask) {
  containerTask.forEach((e) => {
    e.addEventListener("click", async () => {
      if (!e.classList.contains("taskSettings")) {
        const res = await axios({
          method: "GET",
          url: `/api/v1/tasks/${e.id}`,
        });

        const data = res.data.data.data;

        information.innerHTML = "";
        information.innerHTML += `
        <div class="taskInformation" id=${e.id}>
          <div class="background"> </div>
          <div class="informationContainer">
            <span class="material-symbols-outlined taskSettings">more_horiz</span>
              <h3>Name</h3>
              <h2>${data.name}</h2>
              <h3>Description</h3>
              <p>${data.description ? data.description : ""}</p>
              <div>
                  <h3>Difficult</h3>
                  <h5 class="${data.difficult}">${data.difficult}</h5>
                  <h3>Status</h3>
                  <h5 class="${data.status}">${data.status}</h5>
              </div>
      </div>
  </div>`;

        document
          .querySelector(".background")
          .addEventListener("click", () => (information.innerHTML = ""));
      }

      document
        .querySelector(".taskSettings")
        .addEventListener("click", async (e) => {
          const res = await axios({
            method: "GET",
            url: `/api/v1/tasks/${e.target.parentElement.parentElement.id}`,
          });

          const data = res.data.data.data;

          information.innerHTML = "";
          information.innerHTML += `
        <div class="formTask active">
            <div class="background"></div>
                <form class="taskForm" id=${data.id}>
                    <h2>${data.name}</h2>
                    <label for="taskName">Name</label>
                    <input id="taskName" type="text" name="name" value=${
                      data.name
                    }>
                    <label for="taskDescription">Description</label>
                    <textarea id="taskDescription" name="description" cols="30" rows="4">${
                      data.description ? data.description : ""
                    }</textarea>
                    <label for="taskDate">Due date</label>
                    <input id="taskDate" type="date" name="dueDate">
                    <label>Difficult</label>
                    <div class="formDiv">
                        <input type="radio" id="easy" name="difficult" value="Easy" ${
                          data.difficult === "Easy" && "checked"
                        }>
                        <label for="easy">Easy</label>
                        <input type="radio" id="medium" name="difficult" value="Medium" ${
                          data.difficult === "Medium" && "checked"
                        }>
                        <label for="medium">Medium</label>
                        <input type="radio" id="hard" name="difficult" value="Hard" ${
                          data.difficult === "Hard" && "checked"
                        }>
                        <label for="hard">Hard</label>
                    </div>
                    <label>Status</label>
                    <div class="formDiv">
                        <input type="radio" id="review" name="status" value="Review" ${
                          data.status === "Review" && "checked"
                        }>
                        <label for="review">Review</label>
                        <input type="radio" id="progress" name="status" value="Progress" ${
                          data.status === "Progress" && "checked"
                        }>
                        <label for="progress">Progress</label>
                        <input type="radio" id="completed" name="status" value="Completed"  ${
                          data.status === "Completed" && "checked"
                        }>
                        <label for="completed">Completed</label>
                        <input type="radio" id="deferred" name="status" value="Deferred"  ${
                          data.status === "Deferred" && "checked"
                        }>
                        <label for="deferred">Deferred</label>
                    </div>
                    <div class="containerButton">
                    <button>Update</button>
                    <div class="deleteTask">Delete Task</div>
                    </div>
                </form>
        </div>`;

          document
            .querySelector(".background")
            .addEventListener("click", () => (information.innerHTML = ""));

          document
            .querySelector(".deleteTask")
            .addEventListener("click", async (e) => {
              try {
                const res = await axios({
                  method: "DELETE",
                  url: `/api/v1/tasks/${e.target.parentElement.parentElement.id}`,
                });

                showAlert("success", `Task deleted successfully!`);

                window.setTimeout(() => {
                  location.assign(
                    `/project/${window.location.href.split("/")[4]}`
                  );
                }, 800);
              } catch (err) {
                showAlert("error", err.response.data.message);
              }
            });

          document
            .querySelector(".taskForm")
            .addEventListener("submit", async(e) => {
              try {
                e.preventDefault();
                const formData = new FormData(e.target);
                const data = Object.fromEntries(formData);
                const res = await axios({
                  method: "PATCH",
                  url: `/api/v1/tasks/${e.target.id}`,
                  data,
                });

                if (res.data.status === "success") {
                  showAlert("success", `successfully update task!`);
        
                  window.setTimeout(() => {
                    location.reload(true);
                  }, 800);
                }

              } catch (err) {
                showAlert("error", err.response.data.message);
              }
            });
        });
    });
  });
}
document.querySelector(".deleteProject").addEventListener("click", () => {
  containerDelete.classList.add("deleteActive");
});
document.querySelector(".deleteBackground").addEventListener("click", () => {
  containerDelete.classList.remove("deleteActive");
});

document.querySelector(".no").addEventListener("click", () => {
  containerDelete.classList.remove("deleteActive");
});

document.querySelector(".yes").addEventListener("click", async () => {
  try {
    const res = await axios({
      method: "DELETE",
      url: `/api/v1/projects/${window.location.href.split("/")[4]}`,
    });

    showAlert("success", `successfully deleted Project!`);

    window.setTimeout(() => {
      location.assign("/projects");
    }, 800);
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
});
