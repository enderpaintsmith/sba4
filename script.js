
// ============================================
// TASK MANAGEMENT APP
// ============================================

// Get saved tasks from localStorage
let tasks = [];

const savedTasks = localStorage.getItem("tasks");

if (savedTasks) {
    try {
        tasks = JSON.parse(savedTasks);
    } catch (error) {
        tasks = [];
        localStorage.removeItem("tasks");
    }
}


// --------------------------------------------
// 2. GET HTML ELEMENTS
// --------------------------------------------

const taskName = document.getElementById("taskName");
const taskCategory = document.getElementById("taskCategory");
const taskDeadline = document.getElementById("taskDeadline");
const taskStatus = document.getElementById("taskStatus");

const addTaskButton = document.getElementById("addTaskButton");

const taskList = document.getElementById("taskList");

const statusFilter = document.getElementById("statusFilter");
const categoryFilter = document.getElementById("categoryFilter");


// --------------------------------------------
// 3. ADD A NEW TASK
// --------------------------------------------

function addTask() {

    // Get the values entered by the user
    const name = taskName.value.trim();
    const category = taskCategory.value.trim();
    const deadline = taskDeadline.value;
    const status = taskStatus.value;


    // Make sure the user filled everything out
    if (name === "" || category === "" || deadline === "") {

        alert("Please fill out all fields.");

        return;
    }


    // Create a task object
    const newTask = {

        id: Date.now(),

        name: name,

        category: category,

        deadline: deadline,

        status: status
    };


    // Add the task object to the tasks array
    tasks.push(newTask);


    // Save the array to local storage
    saveTasks();


    // Clear the input fields
    taskName.value = "";
    taskCategory.value = "";
    taskDeadline.value = "";

    taskStatus.value = "In Progress";


    // Update the task list
    displayTasks();

    updateCategoryFilter();
}


// --------------------------------------------
// 4. CHECK FOR OVERDUE TASKS
// --------------------------------------------

function checkOverdueTasks() {

    // Get today's date
    const today = new Date();

    today.setHours(0, 0, 0, 0);


    // Check every task
    tasks.forEach(function (task) {

        // Convert the deadline into a Date object
        const deadline = new Date(task.deadline + "T00:00:00");


        // If deadline has passed and task isn't completed
        if (
            deadline < today &&
            task.status !== "Completed"
        ) {

            task.status = "Overdue";
        }

    });


    // Save updated tasks
    saveTasks();
}


// --------------------------------------------
// 5. DISPLAY TASKS
// --------------------------------------------

function displayTasks() {

    // Clear the current list
    taskList.innerHTML = "";


    // Get the selected filters
    const selectedStatus = statusFilter.value;

    const selectedCategory = categoryFilter.value;


    // Filter the tasks
    const filteredTasks = tasks.filter(function (task) {

        const statusMatches =
            selectedStatus === "All" ||
            task.status === selectedStatus;


        const categoryMatches =
            selectedCategory === "All" ||
            task.category === selectedCategory;


        return statusMatches && categoryMatches;
    });


    // If there are no tasks
    if (filteredTasks.length === 0) {

        const message = document.createElement("li");

        message.textContent = "No tasks found.";

        taskList.appendChild(message);

        return;
    }


    // Create an HTML element for each task
    filteredTasks.forEach(function (task) {

        const listItem = document.createElement("li");


        // Task name
        const taskTitle = document.createElement("h3");

        taskTitle.textContent = task.name;


        // Category
        const categoryText = document.createElement("p");

        categoryText.textContent =
            "Category: " + task.category;


        // Deadline
        const deadlineText = document.createElement("p");

        deadlineText.textContent =
            "Deadline: " + task.deadline;


        // Status
        const statusText = document.createElement("p");

        statusText.textContent =
            "Status: " + task.status;


        // ------------------------------------
        // Status dropdown
        // ------------------------------------

        const statusSelect = document.createElement("select");


        const statuses = [
            "In Progress",
            "Completed",
            "Overdue"
        ];


        statuses.forEach(function (status) {

            const option = document.createElement("option");

            option.value = status;

            option.textContent = status;


            // Select the task's current status
            if (status === task.status) {

                option.selected = true;
            }


            statusSelect.appendChild(option);
        });


        // When status is changed
        statusSelect.addEventListener("change", function () {

            task.status = statusSelect.value;

            saveTasks();

            displayTasks();
        });


        // ------------------------------------
        // Delete button
        // ------------------------------------

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete Task";


        deleteButton.addEventListener("click", function () {

            // Remove this task from the array
            tasks = tasks.filter(function (currentTask) {

                return currentTask.id !== task.id;
            });


            // Save the updated array
            saveTasks();


            // Update the category filter
            updateCategoryFilter();


            // Display the updated list
            displayTasks();
        });


        // ------------------------------------
        // Put everything into the task
        // ------------------------------------

        listItem.appendChild(taskTitle);

        listItem.appendChild(categoryText);

        listItem.appendChild(deadlineText);

        listItem.appendChild(statusText);

        listItem.appendChild(statusSelect);

        listItem.appendChild(deleteButton);


        // Put the task into the <ul>
        taskList.appendChild(listItem);

    });
}


// --------------------------------------------
// 6. UPDATE CATEGORY FILTER
// --------------------------------------------

function updateCategoryFilter() {

    // Remember the current category
    const currentCategory = categoryFilter.value;


    // Get all unique categories
    const categories = [];


    tasks.forEach(function (task) {

        if (!categories.includes(task.category)) {

            categories.push(task.category);
        }
    });


    // Clear the category dropdown
    categoryFilter.innerHTML = "";


    // Add "All"
    const allOption = document.createElement("option");

    allOption.value = "All";

    allOption.textContent = "All";

    categoryFilter.appendChild(allOption);


    // Add each category
    categories.forEach(function (category) {

        const option = document.createElement("option");

        option.value = category;

        option.textContent = category;

        categoryFilter.appendChild(option);
    });


    // Restore the previous selection
    if (categories.includes(currentCategory)) {

        categoryFilter.value = currentCategory;

    } else {

        categoryFilter.value = "All";
    }
}


// --------------------------------------------
// 7. SAVE TASKS TO LOCAL STORAGE
// --------------------------------------------

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}


// --------------------------------------------
// 8. EVENT LISTENERS
// --------------------------------------------


// Add Task button
addTaskButton.addEventListener(
    "click",
    addTask
);


// Status filter
statusFilter.addEventListener(
    "change",
    displayTasks
);


// Category filter
categoryFilter.addEventListener(
    "change",
    displayTasks
);


// --------------------------------------------
// 9. START THE APP
// --------------------------------------------


// Check for overdue tasks
checkOverdueTasks();


// Create category options
updateCategoryFilter();


// Display the tasks
displayTasks();

