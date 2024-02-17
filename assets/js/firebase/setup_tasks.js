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
let userGlobal;

export default function setupTasks(user) {
    userGlobal = user;

    onGetTask((querySnapshot) => {
        let html = '';

        querySnapshot.forEach(doc => {
            const data = doc.data();
           

            html += `
                <div class="card mb-3">
                    <div class="card-body">
                    <h6>${data.userName}</h6>
                        <h4 class="card-title">${data.title}</h4>
                        <p class="card-text">${data.description}</p>
                        <h6>${data.date}</h6>
                        <p>${data.time}</p>
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
};

taskForm.addEventListener("submit", (e) => {
    // Evitamos que recargue la pagina
    e.preventDefault();

    const fullDate = new Date();

    const date = getFormattedDate(fullDate);
    
    const time = getFormattedHour(fullDate);

    const userName = userGlobal.displayName

    const title = taskForm["task-title"].value;
    const description = taskForm["task-content"].value;

    if (!editStatus){
        createTask(title, description, userName, date, time);
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

function getFormattedDate(date) {
    var year = date.getFullYear();
  
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
  
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    
    return month + '/' + day + '/' + year;
  }

function getFormattedHour(date) {
   var hours = date.getHours();
   var minutes = date.getMinutes();

   if (hours < 10) {
    hours = '0' + minutes;
   }

   if (minutes < 10) {
    minutes = '0' + minutes;
   }

   return hours + ':'  + minutes;
}