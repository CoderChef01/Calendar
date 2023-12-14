let currentDate = new Date();
const CONSTANTS = {
    offsets: {
        min: 1,
        max: 1
    },
    now: new Date(),
    workLength: 90,
    timeSteps: 15,
    freeDays: Array.isArray(calendarData.feiertags) ?
        calendarData.feiertags.map(string => new Date(string)) : []
}

const LNG = {
    getText: (text) => window.calendarData && window.calendarData.translations &&
        window.calendarData.translations[text] ?
        window.calendarData.translations[text] : text,
    echoText: (text) => document.write(this.getText(text))
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

let currentModals = [];
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

    let backDropContainer = document.createElement('div');
    backDropContainer.className = "modal-backdrop fade show";
    if(!document.querySelector('.modal-backdrop.fade.show')) {
        document.body.appendChild(backDropContainer);
    } else {
        backDropContainer = null;
    }

    const closeBtn = node.querySelector('.modal-header .btn-close');

    const close = () => {
        node.style.opacity = '0';
        setTimeout(()=> {
            if (backDropContainer) {
                backDropContainer.outerHTML = '';
            }
            node.classList.remove('show');
            node.style.display = null;
        }, 150);
    };
    if (closeBtn) {
        closeBtn.onclick = close;
    }
    currentModals.push({
        close: close,
        id: node.id,
        node: node
    });
}

document.body.onclick = (e) => {
    if (currentModals.length) {
        let currentModal = null;
        currentModals = currentModals.filter((modal) => {
            if (modal && modal.node === e.target) {
                currentModal = modal;
                return false;
            } else {
                return true;
            }
        });
        if (currentModal) {
            currentModal.close();
        }
    }
}

function BSModal (options) {
    if (!options) options = {};
    let mainModal = document.querySelector('#bsModal');
    if (mainModal) {
        mainModal.outerHTML = '';
    }
    const modalClose = (button, index) => {
        if (currentModals.length) {
            const currentModal = currentModals.pop();
            if (currentModal) {
                currentModal.close();
            }
        }
        mainModal.outerHTML = '';
        if (typeof options.onclose === "function") {
            options.onclose(button, index);
        }
    };
    mainModal = document.createElement('div');
    mainModal.id = 'bsModal';
    mainModal.className = 'modal fade';

    const dialog = document.createElement('div');
    dialog.classList.add('modal-dialog');
    const content = document.createElement('div');
    content.classList.add('modal-content');
    content.style.width = 'auto';

    const header  = document.createElement('div');
    header.classList.add('modal-header');
    const title = document.createElement('h5');
    title.classList.add('modal-title');
    title.innerHTML = options.title || 'Modal';
    const close = document.createElement('button');
    close.setAttribute('type', 'button');
    close.classList.add('btn-close');
    close.onclick = ()=>modalClose();
    header.appendChild(title);
    header.appendChild(close);

    const body  = document.createElement('div');
    body.classList.add('modal-body');

    if (options.body instanceof Node || options.body instanceof Element) {
        body.appendChild(options.body);
    } else if (typeof options.body === "string") {
        body.innerHTML = options.body;
    }

    content.appendChild(header);
    content.appendChild(body);

    if (Array.isArray(options.buttons)) {
        const footer = document.createElement('div');
        footer.classList.add('modal-footer');

        options.buttons.forEach((button, index)=> {
            if (!button) {
                return;
            }
            const btn = document.createElement('button');
            btn.setAttribute('type', 'button');
            btn.classList.add('btn');
            btn.classList.add('btn-primary');
            if (typeof button === 'string') {
                btn.innerHTML = button;
                btn.onclick = ()=> modalClose(button, index);
            } else if (typeof button === 'object') {
                btn.innerHTML = button.innerHTML || button.value || button.text || 'OK';
                if (typeof button.onclick === 'function') {
                    btn.onclick = () => {
                        modalClose(button, index);
                        button.onclick(mainModal);
                    };
                } else {
                    btn.onclick = ()=> modalClose(button, index);
                }
                if (button.className) {
                    btn.className = button.className;
                }
            }

            footer.appendChild(btn);
        })
        content.appendChild(footer);
    }


    dialog.appendChild(content);

    mainModal.appendChild(dialog);
    document.body.appendChild(mainModal);

    showModalFor(mainModal);

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
            const dayString = currentDay.toString();
            const className = getTodayClass(year, month, currentDay);
            if (i === 0 && j < firstDayOfWeek) {
                calendar_content.appendChild(createDiv('blank'));
            } else if(currentDay === today && month === now.getMonth() + 1) {
                const todayDiv = createDiv('today');
                todayDiv.style.color =  "rgb(0, 189, 170)"
                todayDiv.innerHTML = currentDay.toString();
                todayDiv.classList.add(className);

                if (className === 'clickable') {
                    todayDiv.onclick = ()=>{
                        showTimeSlotsModal(year, month, dayString);
                    }
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
                div.classList.add(className);

                if (className === 'clickable') {
                    div.onclick = ()=>{
                        showTimeSlotsModal(year, month, dayString);
                    }
                }
                calendar_content.appendChild(div);
                currentDay++;
            } else {
                calendar_content.appendChild(createDiv('blank'))
            }
        }
    }
}

function isDayClickable(year, month, day) {
    let currentDay = new Date(year, month - 1, day);
    let dayOfWeek = currentDay.getDay();
    return dayOfWeek !== 0 && dayOfWeek !== 6;
}

function getTodayClass(year, month, day) {
    const currentDay = new Date(year, month - 1, day);
    const dateTo = new Date(calendarData.date_to);
    const dateFrom = new Date(calendarData.date_from);
    dateFrom.setHours(0);
    const dayOfWeek = currentDay.getDay();
    const isWeekday = dayOfWeek !== 0 && dayOfWeek !== 6;
    const isBefore = currentDay <= dateTo;
    const isAfter = currentDay >= dateFrom;
    const selectedDayShift = calendarData.monteuren[calendarData.monteur][dayOfWeek];
    const isFreeDay = CONSTANTS.freeDays.find(date=> {
        return date.getFullYear() === currentDay.getFullYear() &&
            date.getMonth() === currentDay.getMonth() &&
            date.getDate() === currentDay.getDate();
    });

    if (isWeekday && isBefore && selectedDayShift && !isFreeDay && isAfter) {
        return 'clickable';
    } else if (isWeekday && (!isBefore || !isAfter)) {
        return 'disabled';
    } else if (isWeekday && !selectedDayShift) {
        return 'disabled';
    } else if (isWeekday && isFreeDay) {
        return 'week_end';
    } else if (!isWeekday) {
        return 'week_end';
    }
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
 * getTimeFromDate
 * @param {Date} date
 * @returns {string}
 */
function getTimeFromDate (date) {
    return date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
}

function getBookedSlotsForDay (year, month, day) {
    const bookingArray = window.calendarData.bookings || [];
    const todayData = bookingArray.filter(booking => booking.wartdatum === year + "-" + month + "-" + day);

    const slots = [];

    todayData.forEach(function (booking) {
        const time = booking.wartzeit;

        const date = getTimedDate(time);
        let i = -90;
        addMinutes(date, i);

        if (!slots.includes(time)) {
            slots.push(time);
        }
        while (i < 90) {
            addMinutes(date, CONSTANTS.timeSteps);
            const pastTime = getTimeFromDate(date);
            if (!slots.includes(pastTime)) {
                slots.push(pastTime);
            }
            i += CONSTANTS.timeSteps;
        }
    });
    return slots;
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

function showTimeSlotsModal(year, month, day) {
    // Implementieren Sie die Logik zum Abrufen verfügbarer Zeitfenster für den ausgewählten Tag aus Ihrer Datenbank
    // Lassen Sie uns vorerst davon ausgehen, dass wir ein Array verfügbarer Zeitfenster haben
    const todaySlots = getBookedSlotsForDay(year, month, day);
    const currentDay = new Date(year, month - 1, day);
    const dayOfWeek = currentDay.getDay();
    const selectedDayShift = calendarData.monteuren[calendarData.monteur][dayOfWeek];
    let availableTimeSlotsDe = [],
        availableTimeSlotsDu = [];

    if (Array.isArray(selectedDayShift) && selectedDayShift.length > 1) {
        const dates = [getTimedDate(selectedDayShift[0]), getTimedDate(selectedDayShift[1])];
        addMinutes(dates[1], -1 * CONSTANTS.workLength);
        const startHour = Number(selectedDayShift[0].split(':')[0]),
            endHour = Number(getTimeFromDate(dates[1]).split(':')[0]);
        addMinutes(dates[1], CONSTANTS.timeSteps);

        if (startHour <= 12) {
            availableTimeSlotsDe = generateTimeSlots(todaySlots, [
                selectedDayShift[0],
                endHour < 12 ? getTimeFromDate(dates[1]) : '11:45'
            ]);
        }
        if (endHour > 12) {
            availableTimeSlotsDu = generateTimeSlots(todaySlots, [
                startHour > 13 ? selectedDayShift[0] : '13:00',
                getTimeFromDate(dates[1])
            ]);
        }
    }

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
    deButton.innerHTML = LNG.getText('morning');
    deButton.onclick = ()=> showAvailableTimeSlots("de", availableTimeSlotsDe, year, month, day);

    const duButton = document.createElement('button');
    duButton.className = "btn btn-primary";
    duButton.innerHTML = LNG.getText('evening');
    duButton.onclick = ()=> showAvailableTimeSlots("du", availableTimeSlotsDu, year, month, day);



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
function showAvailableTimeSlots(timeType, availableTimeSlots, year, month, day) {
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
    const getSummaryLine = (key, value)=> {
        const line = document.createElement('div');
        line.classList.add('line');
        line.innerHTML = '<div class="menu">'+key+'</div><div class="value">'+value+'</div>';

        return line;
    }
    const maintenance_time = getSummaryLine(LNG.getText('maintenance_time') + ':', '07:30 - 09:00');
    let selectedTime;
    // Zeigen Sie die gefilterten Zeitfenster an
    for (let i = 0; i < availableTimeSlots.length; i++) {
        const timeSlot = availableTimeSlots[i];
        const button = document.createElement('button');
        button.id = "time_b_" + i;
        button.classList.add('btn');
        button.classList.add('btn-primary');
        if (timeSlot.booked) {
            button.classList.add('booked');
        } else {
            button.classList.add('free');
        }
        button.innerHTML = timeSlot.time;
        button.onclick = ()=> {
            if (timeSlot.booked) {
                return;
            }
            selectedTime = timeSlot.time;

            const value = maintenance_time.querySelector('.value');
            if (value) {
                // const minTime = timeSlot.time;
                const minDate = getTimedDate(timeSlot.time);
                const maxDate = addMinutes(getTimedDate(timeSlot.time),
                    CONSTANTS.workLength)
                const maxTime = getTimeFromDate(maxDate);
                value.innerHTML = timeSlot.time + " - " + maxTime;
                for (let j = 0; j < availableTimeSlots.length; j++) {
                    const slotTime = availableTimeSlots[j];
                    const slotDate = getTimedDate(slotTime.time);
                    const slotButton = slotsNode.querySelector('#time_b_' + j);

                    if (slotButton && minDate <= slotDate && slotDate <= maxDate) {
                        slotButton.classList.add('planned');
                    } else if (slotButton) {
                        slotButton.classList.remove('planned');
                    }
                }
            }
            //alert(LNG.getText("selected_period") + ": " + timeSlot.time)
        };

        slotsNode.appendChild(button);
    }

    for (let j = 0; j < 4 - (availableTimeSlots.length % 4); j++) {
        const div = document.createElement('div');
        div.style.flex = '1 0 22%';
        div.style.boxSizing = 'border-box'
        div.style.margin = '4px'
        div.style.padding = '2px 8px'
        slotsNode.appendChild(div);
    }

    timeSlotsContainer.appendChild(slotsNode);

    const noteContainer = document.createElement('div');
    noteContainer.classList.add('slot-note-wrapper');

    const notes = document.createElement('textarea');
    notes.classList.add('slot-note');
    notes.setAttribute('rows', '3');
    notes.setAttribute('placeholder', LNG.getText('note'));
    noteContainer.appendChild(notes);
    timeSlotsContainer.appendChild(noteContainer);

    // Fügen Sie eine leere div für den Abstand hinzu
    const spacerDiv = document.createElement('div');
    spacerDiv.style.height = "1em";
    timeSlotsContainer.appendChild(spacerDiv);


    const summary = document.createElement('div');
    summary.classList.add('summary');


    summary.appendChild(getSummaryLine(LNG.getText('maintenance_date') + ':', day + '-' + month + '-' + year));
    summary.appendChild(maintenance_time);

    timeSlotsContainer.appendChild(summary);


    const buttons = document.createElement('div');
    buttons.classList.add('buttons-wrapper');


    // Fügen Sie den "Akzeptieren" Button hinzu
    const acceptButton = document.createElement('button');
    acceptButton.className = "btn btn-secondary";
    acceptButton.innerHTML = LNG.getText('back');
    acceptButton.onclick = ()=>alert(LNG.getText('cancelled'));

    // Fügen Sie den "Akzeptieren" Button hinzu
    const backButton = document.createElement('button');
    backButton.className = "btn btn-primary";
    backButton.innerHTML = LNG.getText('book');
    backButton.onclick = () => {
        if (!selectedTime) {
            alert(LNG.getText('please_select'));
            return;
        }
        //alert(LNG.getText('accepted'))
        const modalConfig = {
            title: 'Confirmation',
            body: LNG.getText('are_you_sure'),
            buttons: [{
                innerHTML: LNG.getText('yes'),
                onclick: () => {
                    console.info('Executing booking...');
                    book({
                        wartzeit: selectedTime,
                        wartdatum: year + "-" + month + "-" + day,
                        notes: notes.value,
                        aufid: window.calendarData.aufid
                    })
                }
            }, {
                innerHTML: LNG.getText('back'),
                className: 'btn btn-secondary'
            }]
        };
        BSModal(modalConfig);

    };

    // Fügen Sie den Akzeptieren Button dem Container hinzu
    buttons.appendChild(acceptButton);
    buttons.appendChild(backButton);
    timeSlotsContainer.appendChild(buttons);
}

/**
 * @typedef {Object} BookingData
 * @property {string} wartdatum
 * @property {string} wartzeit
 * @property {string} aufid
 */

/**
 * books
 * @param {BookingData} data
 */
function book (data) {
    const formData = new URLSearchParams();
    for (const [key, value] of Object.entries(data)) {
        formData.append(key, value);
    }
    const modalConfig = {
        title: 'Result',
        body: null,
        buttons: ['OK']
    }
    fetch('#', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData,
    })
        .then(async response => {
            const value = await response.text();
            switch (response.status) {
                case 200:
                    modalConfig.body = LNG.getText('successful_booking');
                    BSModal(modalConfig);
                    break;
                default:
                    modalConfig.body = LNG.getText('booking_issue') + '<br />'+value;
                    BSModal(modalConfig);
            }
        })
        .catch(error => {
            modalConfig.body = LNG.getText('booking_issue') + '<br />'+error.message;
            BSModal(modalConfig);
            console.error('Error:', error);
        });
}