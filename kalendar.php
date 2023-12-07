<?php
?>
<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kalender</title>
    <link rel="stylesheet" href="./vendors/bootstrap-5.3.2-dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="./vendors/fontawesome-free-5.15.4-web/css/all.min.css">
    <link rel="stylesheet" href="./style.css">
    <link rel="icon" href="./favicon.ico" type="image/x-icon">
    <link rel="shortcut icon" href="./favicon.ico" type="image/x-icon">
</head>

<body>

    <main class="container">
        <div class="row">
            <div class="col-md-12">
                <h2 class="mt-5 text-center text-primary head-title">Kalender</h2>

                <div id="calendar_first" class="calendar calendar-first">
                    <div class="calendar_header">
                        <button id="prevMonthBtn" class="switch-month switch-left"> <i class="fa fa-chevron-left"></i></button>
                        <h2 id="currentMonth"></h2>
                        <button id="nextMonthBtn" class="switch-month switch-right"> <i class="fa fa-chevron-right"></i></button>
                    </div>
                    <div class="calendar_weekdays">
                        <div style="color: rgb(68, 68, 68);">Mo</div>
                        <div style="color: rgb(68, 68, 68);">Di</div>
                        <div style="color: rgb(68, 68, 68);">Mi</div>
                        <div style="color: rgb(68, 68, 68);">Do</div>
                        <div style="color: rgb(68, 68, 68);">Fr</div>
                        <div style="color: rgb(68, 68, 68);">Sa</div>
                        <div style="color: rgb(68, 68, 68);">So</div>
                    </div>
                    <div class="calendar_content">

                    </div>
                </div>
            </div>
        </div>
    </main>

    <!-- Bootstrap Modal zum Anzeigen von Zeitfenstern -->
    <div class="modal fade" id="timeSlotsModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Freie Termine</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Schließen"></button>
                </div>
                <div class="modal-body">
                    <!-- Fügen Sie hier Ihre Formularelemente hinzu -->
                    <form id="appointmentForm">
                        <div class="mb-3">
                            <label for="timeType" class="form-label">Wählen Sie die Uhrzeit:</label>
                            <select class="form-select" id="timeType" required>
                                <option value="" selected disabled>Wählen Sie die Uhrzeit</option>
                                <option value="de">Vorm.</option>
                                <option value="du">Nachm.</option>
                            </select>
                        </div>
                        <div class="mb-3" id="timeSlotsContainer">
                            <!-- Zeitfenster werden hier dynamisch hinzugefügt -->
                        </div>
                        <button type="button" class="btn btn-primary" onclick="submitAppointment()">Senden</button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <script src="./vendors/jquery/jquery-3.7.1.min.js"></script>
    <script src="./vendors/bootstrap-5.3.2-dist/js/bootstrap.min.js"></script>
    <script src="./script.js"></script>
</body>

</html>
