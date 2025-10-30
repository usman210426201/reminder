const API = "http://127.0.0.1:7000";

// ✅ Add new task
document.getElementById("savebtn").addEventListener("click", async () => {
  const taskInput = document.getElementById("taskid");
  const task = taskInput.value.trim();

  if (task === "") {
    alert("Please enter a task!");
    return;
  }

  try {
    const res = await fetch(`${API}/add_task`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ task_text: task })
    });

    const data = await res.json();
    alert(data.message);
    taskInput.value = "";

    loadTasks(); // refresh after adding
  } catch (err) {
    console.error("Error:", err);
    alert("Something went wrong. Please try again!");
  }
});

// ✅ Load tasks and display them in table
async function loadTasks() {
  const res = await fetch(`${API}/get_tasks`);
  const tasks = await res.json();

  let rows = "";
  tasks.forEach(task => {
    if (task.status === "task") {
      rows += `
        <tr>
          <td class="taskdescription">${task.description}
            <button class="startbtn" onclick="updateStatus(${task.id}, 'pending')">Start</button>
          </td>
          <td></td>
          <td></td>
        </tr>`;
    }
    else if (task.status === "pending") {
      rows += `
        <tr>
          <!-- Task column: show strike-through version -->
          <td class="taskdescription"><span style="text-decoration: line-through; color: gray;">
            ${task.description}
          </span></td>

          <!-- Pending column: actual pending view -->
          <td class="taskdescription">${task.description}
            <button class="startbtn" id="finishbtn" onclick="updateStatus(${task.id}, 'complete')">Finish</button>
          </td>
          <td></td>
        </tr>`;
    }
    else if (task.status === "complete") {
      rows += `
        <tr>
          <td class="taskdescription"><span style="text-decoration: line-through; color: gray;">
            ${task.description}
          </span></td>
          <td class="taskdescription"><span style="text-decoration: line-through; color: gray;">
            ${task.description}
          </span></td>
          <td class="taskdescription">${task.description} ✅</td>
        </tr>`;
    }
  });

  document.getElementById("taskdata").innerHTML = rows;
}

// ✅ Update task status
async function updateStatus(id, new_status) {
  await fetch(`${API}/update_status/${id}?new_status=${new_status}`, {
    method: "PUT",
  });
  loadTasks();
}

// Load tasks on page start
loadTasks();
