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

jQuery(document).ready(function($) {
    updateCalendar();

    $("#prevMonthBtn").on("click", function () {
        moveDateByMonth(-1);
        updateCalendar();
    });
    
    $("#nextMonthBtn").on("click", function () {
        moveDateByMonth(1);
        updateCalendar();
    });
    
});

function updateCalendar() {
    let currentMonth = currentDate.getMonth() + 1;
    let currentYear = currentDate.getFullYear();

    if (currentMonth > 12) {
        currentMonth = 1;
        currentYear++;
    } else if (currentMonth < 1) {
        currentMonth = 12;
        currentYear--;
    }

    $("#currentMonth").text(currentYear + "-" + currentMonth);

    populateCalendarDays(currentYear, currentMonth);
}

function populateCalendarDays(year, month) {
    $("#calendarBody").empty();

    let firstDay = new Date(year, month - 1, 1);
    let lastDay = new Date(year, month, 0);
    let numDays = lastDay.getDate();
    let firstDayOfWeek = firstDay.getDay() || 7;
    let currentDay = 1;

    for (let i = 0; i < 6; i++) {
        let row = $("<tr>").appendTo("#calendarBody");

        for (let j = 1; j < 8; j++) {
            if (i === 0 && j < firstDayOfWeek) {
                row.append("<td></td>");
            } else if (currentDay <= numDays) {
                let cell = $("<td>").text(currentDay).appendTo(row);
                currentDay++;

                if (isDayClickable(year, month, currentDay)) {
                    cell.addClass("clickable");
                    cell.on("click", function () {
                        showTimeSlotsModal($(this).text());
                    });
                } else {
                    cell.addClass("disabled");
                }
            } else {
                //row.append("<td></td>");
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
    let availableTimeSlotsDe = ["08:00", "08:15", "08:30", "08:45", "09:00", "09:15", "09:30", "09:45", "10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45"];
    let availableTimeSlotsDu = ["13:00", "13:15", "13:30", "13:45", "14:00", "14:15", "14:30", "14:45", "15:00", "15:15", "15:30", "15:45", "15:00", "15:15", "15:30", "15:45"];

    // Clear modal body
    $("#timeSlotsModal .modal-body").empty();

    // Fügen Sie Radio-Buttons für "de" und "du" hinzu
    let deButton = $("<button>")
        .addClass("btn btn-primary m-2")
        .text("Vorm")
        //.css({"font-size": "small", "width": "12%"}) // Schriftgröße und Breite setzen
        .on("click", function () {
            showAvailableTimeSlots("de", availableTimeSlotsDe);
        });

    let duButton = $("<button>")
        .addClass("btn btn-primary m-2")
        .text("Nach")
        //.css({"font-size": "small", "width": "12%"}) // Schriftgröße und Breite setzen
        .on("click", function () {
            showAvailableTimeSlots("du", availableTimeSlotsDu);
        });

    // Fügen Sie "De" und "Du" Buttons zum Modal-Body hinzu
    $("#timeSlotsModal .modal-body").append(deButton, duButton);

    // Fügen Sie den Titel zum Modal hinzu
    let title = $("<h5>").addClass("modal-title text-center").text("Welcher Zeitraum passt Ihnen?");
    $("#timeSlotsModal .modal-body").append(title);

    // Erstellen Sie einen Container für die Zeitraumtyp-Buttons
    let timeTypeContainer = $("<div>").addClass("d-flex justify-content-center buttons");
    $("#timeSlotsModal .modal-body").append(timeTypeContainer);

    // Fügen Sie "De" und "Du" Buttons zum Container hinzu
    timeTypeContainer.append(deButton, duButton);

    // Erstellen Sie einen Container für die Zeitfenster
    let timeSlotsContainer = $("<div>").attr("id", "timeSlotsContainer");
    $("#timeSlotsModal .modal-body").append(timeSlotsContainer);

    // Zeigen Sie das Modal an
    $("#timeSlotsModal").modal("show");
}



function showAvailableTimeSlots(timeType, availableTimeSlots) {
    // Holen Sie sich den Container für die Zeitfenster
    let timeSlotsContainer = $("#timeSlotsContainer");

    // Leeren Sie den Container
    timeSlotsContainer.empty();

    // Zeigen Sie die gefilterten Zeitfenster an
    let buttonsPerRow = 4; // Az egy sorban megjelenő gombok száma
    for (let i = 0; i < availableTimeSlots.length; i++) {
        let timeSlot = availableTimeSlots[i];
        let button = $("<button>")
             .addClass("btn btn-primary m-3") // vagy m-4
             .text(timeSlot)
             .on("click", function () {
        alert("Ausgewählter Zeitraum: " + $(this).text());
    });

        // Fügen Sie jeden Zeitfenster-Button dem Container hinzu
        timeSlotsContainer.append(button);

        // Ha elértük a gombok számát a soron, akkor adjunk hozzá egy új sort
        if ((i + 1) % buttonsPerRow === 0) {
            timeSlotsContainer.append("<br>");
        }
    }

    // Fügen Sie eine leere div für den Abstand hinzu
    let spacerDiv = $("<div>").css({ "height": "1em" });
    timeSlotsContainer.append(spacerDiv);

    // Fügen Sie den "Akzeptieren" Button hinzu
    let acceptButton = $("<button>")
        .addClass("btn btn-secondary m-2")
        .text("Akzeptieren")
        .css({ "float": "right" })  // Rechtsausrichtung
        .on("click", function () {
            alert("Akzeptiert");
        });

    // Fügen Sie den Akzeptieren Button dem Container hinzu
    timeSlotsContainer.append(acceptButton);
}


