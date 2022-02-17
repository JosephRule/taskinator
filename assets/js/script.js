var taskIdCounter = 0;
var tasks = [];
var formEl = document.querySelector("#task-form");
var pageContentEl = document.querySelector("#page-content");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");

var taskFormHandler = function(event) {
    event.preventDefault();
    taskNameInput = document.querySelector("input[name='task-name']").value
    taskTypeInput = document.querySelector("select[name='task-type']").value

    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form.");
        return false;
    }
    formEl.reset();

    var isEdit = formEl.hasAttribute("data-task-id");
    if (isEdit) {


    }
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");


        completeEditTask(taskNameInput, taskTypeInput, taskId);
        // get task id and call function to complete
    }
    else {
        var taskDataObj = {
            name:  taskNameInput,
            type:  taskTypeInput,
            status: "to do"
        };
        createTaskEl(taskDataObj);
    }
};

var createTaskEl = function(taskDataObj) {
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    listItemEl.setAttribute("data-task-id", taskIdCounter);

    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl)
    tasksToDoEl.appendChild(listItemEl);

    taskDataObj.id = taskIdCounter;
    tasks.push(taskDataObj);
    taskIdCounter++;
    saveTasks();
};

var createTaskActions = function(taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId)

    actionContainerEl.appendChild(deleteButtonEl);

    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(statusSelectEl);

    var statusChoices = ["To Do", "In Progress", "Completed"];
    for (i=0; i<statusChoices.length; i++) {
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
};

var deleteTaskEl = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    var updatedTaskArr = [];
    for (var i =0; i<tasks.length; i++) {
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i])
        }
    }

    tasks = updatedTaskArr;
    saveTasks();
};

var editTask = function(taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='"+taskId+"']");
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;

    document.querySelector("input[name=task-name").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";

    formEl.setAttribute("data-task-id", taskId);
};



var completeEditTask = function(taskName, taskType, taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    for (var i =0; i<tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name = taskName;
            tasks[i].type = taskType;
        }
    };
    saveTasks();
    alert("Task Updated!");
    formEl.reset();
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent = "Add Task";



    // I need to change the data-task-id in some way (delete? make 0?)
    // the is

};

var taskButtonHandler = function(event) {
    var targetEl = event.target;

    if (targetEl.matches(".delete-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTaskEl(taskId);
    }

    else if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }
};

var taskStatusChangeHandler = function(event) {
    var taskId = event.target.getAttribute("data-task-id");
    var statusValue = event.target.value.toLowerCase();
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    }
    else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    }
    else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    }

    for (var i =0; i<tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].status = statusValue;
        }
    }

    saveTasks();
};

var saveTasks = function() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

var loadTasks = function() {
    var savedTasks = localStorage.getItem("tasks");

    if (!savedTasks ){
        return false
    }

    savedTasks = JSON.parse(savedTasks);

    for (var i=0; i<savedTasks.length; i++) {
        createTaskEl(savedTasks[i]);
        var taskSelected = document.querySelector(".task-item[data-task-id='" + savedTasks[i].id + "']");

        if (savedTasks[i].status === "to do") {
            taskSelected.querySelector("select[name='status-change']").selectedIndex = 0
            tasksToDoEl.appendChild(taskSelected);
        }
        else if (savedTasks[i].status === "in progress") {
            taskSelected.querySelector("select[name='status-change']").selectedIndex = 1
            tasksInProgressEl.appendChild(taskSelected);
        }
        else if (savedTasks[i].status === "completed") {
            taskSelected.querySelector("select[name='status-change']").selectedIndex = 2
            tasksCompletedEl.appendChild(taskSelected);
        }

    };

};

formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);
loadTasks();
