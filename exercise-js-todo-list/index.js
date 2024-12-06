document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("task-input");
  const taskList = document.getElementById("task-list");
  const todoForm = document.getElementById("todo-form");

  // Load tasks from localStorage
  let tasks = JSON.parse(localStorage.getItem("tasks"));

  // If tasks is null or not properly structured, initialize it as an empty array
  if (!Array.isArray(tasks)) {
    console.warn(
      "LocalStorage data is malformed or empty. Initializing an empty task list."
    );
    tasks = [];
  }

  // Render tasks
  function renderTodos() {
    taskList.innerHTML = ""; // Clear the list before re-rendering
    tasks.forEach((task, index) => {
      // Check if task has valid properties before rendering
      if (!task || !task.text || task.completed === undefined) {
        console.error("Malformed task data:", task);
        return; // Skip invalid tasks
      }

      const li = document.createElement("li");
      li.classList.add("task-item");
      li.innerHTML = `
        <span class="task-text ${task.completed ? "completed" : ""}">
          ${task.text}
        </span>
        <button class="remove-btn" data-index="${index}">Remove</button>
        <button class="move-up" data-index="${index}">↑</button>
        <button class="move-down" data-index="${index}">↓</button>
        <input type="checkbox" class="completed-checkbox" data-index="${index}" ${
        task.completed ? "checked" : ""
      } />
      `;
      taskList.appendChild(li);
    });
  }

  // Save tasks to localStorage
  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Add a new task
  todoForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const taskText = taskInput.value.trim();

    if (taskText) {
      const newTask = {
        text: taskText,
        completed: false,
      };
      tasks.push(newTask);
      taskInput.value = ""; // Clear input field
      saveTasks();
      renderTodos();
    }
  });

  // Task list interactions (complete, remove, move up/down)
  taskList.addEventListener("click", (event) => {
    const index = event.target.dataset.index;

    if (event.target.classList.contains("remove-btn")) {
      tasks.splice(index, 1); // Remove task from array
      saveTasks();
      renderTodos();
    }

    if (event.target.classList.contains("move-up")) {
      if (index > 0) {
        [tasks[index], tasks[index - 1]] = [tasks[index - 1], tasks[index]];
        saveTasks();
        renderTodos();
      }
    }

    if (event.target.classList.contains("move-down")) {
      if (index < tasks.length - 1) {
        [tasks[index], tasks[index + 1]] = [tasks[index + 1], tasks[index]];
        saveTasks();
        renderTodos();
      }
    }
  });

  // Mark a task as completed or not
  taskList.addEventListener("change", (event) => {
    if (event.target.classList.contains("completed-checkbox")) {
      const index = event.target.dataset.index;
      tasks[index].completed = event.target.checked;
      saveTasks();
      renderTodos();
    }
  });

  // Initial render
  renderTodos();
});
