let currentDate = new Date();
const CONSTANTS = {
    offsets: {
        min: 1,
        max: 1
    },
    now: new Date(),
    workLength: 90,
    timeSteps: 15
}

/**
 * @typedef {Object} TimeSlot
 * @property {boolean} booked = Is it booked
 * @property {string} time -
 * @property {number} size -
 */

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


/**
 * addMinutes
 * @param {Date} date - The Date object we want to modify
 * @param {number} minutes - The minutes we want to add for the date object
 */
function addMinutes (date, minutes) {
    date.setTime(date.getTime() + minutes * 60000);
    return date;
}
/**
 * getTimedDate
 * @param {string} time - Time format like '8:00'
 * @returns {Date}
 */
function getTimedDate (time) {
    const parts = time.trim().split(':');
    const date = new Date();
    date.setHours(Number(parts.shift()));
    date.setMinutes(Number(parts.shift()));
    return date;
}


/**
 * generateTimeSlots
 * @param {string[]} bookedSlots - All currently booked 1.5 hour slots
 * @param {string[]} shift - The current work shift, for example ['8:00', '12:00']
 * @returns {TimeSlot[]}
 */
function generateTimeSlots (bookedSlots, shift) {
    const shiftDates = [getTimedDate(shift[0]), getTimedDate(shift[1])];

    if (shiftDates[0] > shiftDates[1]) {
        // switch them if the first one is later
        const _temp = shiftDates[0];
        shiftDates[0] = shiftDates[1];
        shiftDates[1] = _temp;
    }

    /**
     * slots
     * @type {TimeSlot[]}
     */
    const slots = [];

    while (shiftDates[0] < shiftDates[1]) {
        const time = shiftDates[0].getHours().toString().padStart(2, '0') + ":" +
            shiftDates[0].getMinutes().toString().padStart(2, '0');
        const booked = bookedSlots.includes(time);
        /**
         * @type {TimeSlot}
         */
        const slot = {
            time: time,
            booked: booked,
            size: CONSTANTS.workLength
        }
        slots.push(slot);

        addMinutes(shiftDates[0], CONSTANTS.timeSteps);
    }

    return slots;
}

function showTimeSlotsModal(day) {
    // Implementieren Sie die Logik zum Abrufen verfügbarer Zeitfenster für den ausgewählten Tag aus Ihrer Datenbank
    // Lassen Sie uns vorerst davon ausgehen, dass wir ein Array verfügbarer Zeitfenster haben
    const availableTimeSlotsDe = generateTimeSlots([], ['7:00', '12:00']);
    const availableTimeSlotsDu = generateTimeSlots([], ['13:00', '16:00']);

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
    deButton.className = "btn btn-primary";
    deButton.innerHTML = "Vormittag";
    deButton.onclick = ()=> showAvailableTimeSlots("de", availableTimeSlotsDe);

    const duButton = document.createElement('button');
    duButton.className = "btn btn-primary";
    duButton.innerHTML = "Nachmittag";
    duButton.onclick = ()=> showAvailableTimeSlots("du", availableTimeSlotsDu);



    /*const title = document.createElement('h5');
    title.className = "modal-title text-center";
    title.innerHTML = "Welcher Zeitraum passt Ihnen?";*/

    // Fügen Sie den Titel zum Modal hinzu
    // modal.appendChild(title);

    // Erstellen Sie einen Container für die Zeitraumtyp-Buttons
    const timeTypeContainer = document.createElement('div');
    timeTypeContainer.className = "time-type d-flex justify-content-between buttons";
    timeTypeContainer.appendChild(deButton);
    timeTypeContainer.appendChild(duButton);

    modal.appendChild(timeTypeContainer);

    // Erstellen Sie einen Container für die Zeitfenster
    const timeSlotsContainer = document.createElement('div');
    timeSlotsContainer.id = "timeSlotsContainer";
    modal.appendChild(timeSlotsContainer);

    showModalFor(timeSlotsModal);
}


/**
 *
 * @param {'de'|'du'} timeType - Current Type of the Time
 * @param {TimeSlot[]} availableTimeSlots - List of available time slots for the calendar
 */
function showAvailableTimeSlots(timeType, availableTimeSlots) {
    // Holen Sie sich den Container für die Zeitfenster
    const timeSlotsContainer = document.getElementById('timeSlotsContainer');
    if (!timeSlotsContainer) {
        console.error('#timeSlotsContainer is not found in DOM');
        return;
    }
    // Leeren Sie den Container
    timeSlotsContainer.innerHTML = '';

    const slotsNode = document.createElement('div');
    slotsNode.classList.add('slot-parent');

    // Zeigen Sie die gefilterten Zeitfenster an
    for (let i = 0; i < availableTimeSlots.length; i++) {
        const timeSlot = availableTimeSlots[i];
        const button = document.createElement('button');
        button.classList.add('btn');
        button.classList.add('btn-primary');
        if (timeSlot.booked) {
            button.classList.add('booked');
        } else {
            button.classList.add('free');
        }
        button.innerHTML = timeSlot.time;
        button.onclick = ()=>alert("Ausgewählter Zeitraum: " + timeSlot.time);

        slotsNode.appendChild(button);
    }

    timeSlotsContainer.appendChild(slotsNode);

    const noteContainer = document.createElement('div');
    noteContainer.classList.add('slot-note-wrapper');

    const notes = document.createElement('textarea');
    notes.classList.add('slot-note');
    notes.setAttribute('rows', '3');
    notes.setAttribute('placeholder', 'Bemerkung für Monteur!');
    noteContainer.appendChild(notes);
    timeSlotsContainer.appendChild(noteContainer);

    // Fügen Sie eine leere div für den Abstand hinzu
    const spacerDiv = document.createElement('div');
    spacerDiv.style.height = "1em";
    timeSlotsContainer.appendChild(spacerDiv);


    const summary = document.createElement('div');
    summary.classList.add('summary');
    const getSummaryLine = (key, value)=> {
        const line = document.createElement('div');
        line.classList.add('line');
        line.innerHTML = '<div class="menu">'+key+'</div><div class="value">'+value+'</div>';

        return line;
    }

    summary.appendChild(getSummaryLine('Wartungs datum:', '21-12-2023'));
    summary.appendChild(getSummaryLine('Wartungs zeitraum:', '07:30 - 09:00'));

    timeSlotsContainer.appendChild(summary);


    const buttons = document.createElement('div');
    buttons.classList.add('buttons-wrapper');


    // Fügen Sie den "Akzeptieren" Button hinzu
    const acceptButton = document.createElement('button');
    acceptButton.className = "btn btn-secondary";
    acceptButton.innerHTML = "Zurück";
    acceptButton.onclick = ()=>alert("Zurücked");

    // Fügen Sie den "Akzeptieren" Button hinzu
    const backButton = document.createElement('button');
    backButton.className = "btn btn-primary";
    backButton.innerHTML = "Buchung";
    backButton.onclick = ()=>alert("Akzeptiert");

    // Fügen Sie den Akzeptieren Button dem Container hinzu
    buttons.appendChild(acceptButton);
    buttons.appendChild(backButton);
    timeSlotsContainer.appendChild(buttons);
}


