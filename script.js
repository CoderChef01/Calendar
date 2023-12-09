let currentDate = new Date();
const CONSTANTS = {
    offsets: {
        min: 1,
        max: 1
    },
    now: new Date()
}

/**
 * moveDateByMonth
 * @param {number} offset
 */
function moveDateByMonth (offset) {
    const newMonth = currentDate.getMonth() + (offset || 0);
    const calcMonth = newMonth < 0 ? 12 + newMonth : newMonth > 12 ? newMonth - 12 : newMonth;

    if (CONSTANTS.now.getMonth() - CONSTANTS.offsets.min <= calcMonth &&
        calcMonth <= CONSTANTS.now.getMonth() + CONSTANTS.offsets.max) {
        currentDate.setMonth(newMonth);
    }
}

let currentModal;
function showModalFor(node) {
    if(!node) {
        return;
    }
    node.classList.add('show');
    node.style.display = 'block';
    node.style.opacity = '0';
    setTimeout(()=>{
        node.style.opacity = '1';
    },20);

    const backDropContainer = document.createElement('div');
    backDropContainer.className = "modal-backdrop fade show";
    if(!document.querySelector('.modal-backdrop.fade.show')) {
        document.body.appendChild(backDropContainer);
    }

    const closeBtn = node.querySelector('.modal-header .btn-close');

    const close = () => {
        node.style.opacity = '0';
        setTimeout(()=> {
            backDropContainer.outerHTML = '';
            node.classList.remove('show');
            node.style.display = null;
        }, 150);
    };
    if (closeBtn) {
        closeBtn.onclick = close;
    }
    currentModal = {
        close: close,
        id: node.id,
        node: node
    }
}

document.body.onclick = (e) =>{
    if (currentModal && currentModal.node === e.target) {
        currentModal.close();
    }
}

updateCalendar();

const prevMonthBtn = document.getElementById('prevMonthBtn');
if (prevMonthBtn) {
    prevMonthBtn.onclick = () => {
        moveDateByMonth(-1);
        updateCalendar();
    }
}

const nextMonthBtn = document.getElementById('nextMonthBtn');
if (nextMonthBtn) {
    nextMonthBtn.onclick = () => {
        moveDateByMonth(1);
        updateCalendar();
    }
}

function updateCalendar() {
    let month = currentDate.getMonth() + 1,
        year = currentDate.getFullYear();

    if (month > 12) {
        month = 1;
        year++;
    } else if (month < 1) {
        month = 12;
        year--;
    }

    const currentMonth = document.getElementById('currentMonth');
    if (currentMonth) {
        currentMonth.innerHTML = year + "-" + month;
    }

    populateBTCalendar(year, month);
}

function populateBTCalendar(year, month) {
    const calendar_content = document.querySelector('.calendar_content');
    if(!calendar_content) {
        return;
    }
    calendar_content.innerHTML = '';

    let firstDay = new Date(year, month - 1, 1),
        lastDay = new Date(year, month, 0),
        numDays = lastDay.getDate(),
        firstDayOfWeek = firstDay.getDay() || 7,
        currentDay = 1;
    const now = new Date(),
        today = now.getDate();

    const createDiv = (className) => {
        const div = document.createElement('div');
        div.className = className;
        return div;
    };
    for (let i = 0; i < 6; i++) {
        for (let j = 1; j < 8; j++) {
            if (i === 0 && j < firstDayOfWeek) {
                calendar_content.appendChild(createDiv('blank'));
            } else if(currentDay === today && month === now.getMonth() + 1) {
                const todayDiv = createDiv('today');
                todayDiv.style.color =  "rgb(0, 189, 170)"
                todayDiv.innerHTML = currentDay.toString();
                if (isDayClickable(year, month, currentDay)) {
                    todayDiv.classList.add('clickable');
                    todayDiv.onclick = ()=>{
                        showTimeSlotsModal(currentDay);
                    }
                } else {
                    todayDiv.classList.add('disabled');
                }
                calendar_content.appendChild(todayDiv);
                currentDay++;
            } else if(currentDay < today && month === now.getMonth() + 1) {
                const todayDiv = createDiv('past-date');
                todayDiv.innerHTML = currentDay.toString();

                calendar_content.appendChild(todayDiv);
                currentDay++;
            } else if (currentDay <= numDays) {
                const div = document.createElement('div');
                div.innerHTML = currentDay.toString();

                currentDay++;

                if (isDayClickable(year, month, currentDay)) {
                    div.classList.add('clickable');
                    div.onclick = ()=>{
                        showTimeSlotsModal(currentDay);
                    }
                } else {
                    div.classList.add('disabled');
                }
                calendar_content.appendChild(div);

            }
        }
    }
}

function isDayClickable(year, month, day) {
    let currentDay = new Date(year, month - 1, day);
    let dayOfWeek = currentDay.getDay();
    return dayOfWeek !== 0 && dayOfWeek !== 6;
}

function showTimeSlotsModal(day) {
    // Implementieren Sie die Logik zum Abrufen verfügbarer Zeitfenster für den ausgewählten Tag aus Ihrer Datenbank
    // Lassen Sie uns vorerst davon ausgehen, dass wir ein Array verfügbarer Zeitfenster haben
    const availableTimeSlotsDe = ["08:00", "08:15", "08:30", "08:45", "09:00", "09:15", "09:30", "09:45", "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45"];
    const availableTimeSlotsDu = ["13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30", "15:45", "15:00", "15:15", "15:30", "15:45"];

    const timeSlotsModal = document.getElementById('timeSlotsModal');
    if (!timeSlotsModal) {
        console.error('#timeSlotsModal is not found in DOM');
        return;
    }

    const modal = timeSlotsModal.querySelector("#timeSlotsModal .modal-body");
    if (!modal) {
        console.error('#timeSlotsModal .modal-body is not found in DOM');
        return;
    }
    // Clear modal body
    modal.innerHTML = '';

    const deButton = document.createElement('button');
    deButton.className = "btn btn-primary m-2";
    deButton.innerHTML = "Vorm";
    deButton.onclick = ()=> showAvailableTimeSlots("de", availableTimeSlotsDe);

    const duButton = document.createElement('button');
    duButton.className = "btn btn-primary m-2";
    duButton.innerHTML = "Nach";
    duButton.onclick = ()=> showAvailableTimeSlots("du", availableTimeSlotsDu);



    const title = document.createElement('h5');
    title.className = "modal-title text-center";
    title.innerHTML = "Welcher Zeitraum passt Ihnen?";

    // Fügen Sie den Titel zum Modal hinzu
    modal.appendChild(title);

    // Erstellen Sie einen Container für die Zeitraumtyp-Buttons
    const timeTypeContainer = document.createElement('div');
    timeTypeContainer.className = "d-flex justify-content-center buttons";
    timeTypeContainer.appendChild(deButton);
    timeTypeContainer.appendChild(duButton);

    modal.appendChild(timeTypeContainer);

    // Erstellen Sie einen Container für die Zeitfenster
    const timeSlotsContainer = document.createElement('div');
    timeSlotsContainer.id = "timeSlotsContainer";
    modal.appendChild(timeSlotsContainer);

    showModalFor(timeSlotsModal);
}



function showAvailableTimeSlots(timeType, availableTimeSlots) {
    // Holen Sie sich den Container für die Zeitfenster
    const timeSlotsContainer = document.getElementById('timeSlotsContainer');
    if (!timeSlotsContainer) {
        console.error('#timeSlotsContainer is not found in DOM');
        return;
    }
    // Leeren Sie den Container
    timeSlotsContainer.innerHTML = '';

    // Zeigen Sie die gefilterten Zeitfenster an
    let buttonsPerRow = 4; // Az egy sorban megjelenő gombok száma
    for (let i = 0; i < availableTimeSlots.length; i++) {
        const timeSlot = availableTimeSlots[i];
        const button = document.createElement('button');
        button.className = "btn btn-primary m-3";
        button.innerHTML = timeSlot;
        button.onclick = ()=>alert("Ausgewählter Zeitraum: " + timeSlot);

        timeSlotsContainer.appendChild(button);

        // Ha elértük a gombok számát a soron, akkor adjunk hozzá egy új sort
        if ((i + 1) % buttonsPerRow === 0) {
            timeSlotsContainer.appendChild(document.createElement("br"));
        }
    }

    // Fügen Sie eine leere div für den Abstand hinzu
    const spacerDiv = document.createElement('div');
    spacerDiv.style.height = "1em";
    timeSlotsContainer.appendChild(spacerDiv);

    // Fügen Sie den "Akzeptieren" Button hinzu
    const acceptButton = document.createElement('button');
    acceptButton.className = "btn btn-secondary m-2";
    acceptButton.innerHTML = "Akzeptieren";
    acceptButton.style.float = "right";
    acceptButton.onclick = ()=>alert("Akzeptiert");

    // Fügen Sie den Akzeptieren Button dem Container hinzu
    timeSlotsContainer.appendChild(acceptButton);
}


