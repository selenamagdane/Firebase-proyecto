import { 
    createTask,
    onGetTask,
    updateTask,
    deleteTask, 
    getTask} from "./firebase.js";

const taskForm = document.getElementById("create-form");
const tasksContainer = document.getElementById("tasks-container");

let id = "";
let editStatus = false;

window.addEventListener("DOMContentLoaded", () => {
    onGetTask((querySnapshot) => {
        let html = '';

        querySnapshot.forEach(doc => {
            const data = doc.data();

            html += `
                <div class="card mb-3">
                    <div class="card-body">
                        <h4 class="card-title">${data.title}</h4>
                        <p class="card-text">${data.description}</p>
                        <div class="row">
                            <button class='btn btn-danger btn-delete-custom mx-auto col-5' data-id='${doc.id}'>Delete</button>
                            <button class='btn btn-info btn-edit-custom mx-auto col-5' data-id='${doc.id}'>Edit</button>
                        </div>
                    </div>
                </div>
            `;
        });

        tasksContainer.innerHTML = html;

        //delete

        const btssDelete = document.querySelectorAll(".btn-delete-custom");

        btssDelete.forEach(btn => {
            btn.addEventListener("click", ({target: {dataset}}) => deleteTask(dataset.id));
        });

        const btsEdit = document.querySelectorAll(".btn-edit-custom");

        btsEdit.forEach(btn => {
            btn.addEventListener("click", async ({target: {dataset}}) => {
                const doc = await getTask(dataset.id);
                const task = doc.data();

                taskForm["task-title"].value = task.title;
                taskForm["task-content"].value = task.description;

                editStatus = true;
                id = doc.id;

                taskForm['btn-task-save'].innerHTML = 'Update';
            });
        });
    });
});

taskForm.addEventListener("submit", (e) => {
    // Evitamos que recargue la pagina
    e.preventDefault();

    const title = taskForm["task-title"].value;
    const description = taskForm["task-content"].value;

    if (!editStatus){
        createTask(title, description);
    }
    else{
        updateTask( id, ({
            title: title,
            description: description
        }));

        editStatus = false;
        
        taskForm['btn-task-save'].innerHTML ='create';
    }

    taskForm.reset();
});