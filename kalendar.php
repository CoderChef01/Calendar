<?php
?>
<!DOCTYPE html>
<html lang="de">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kalender</title>
    <link rel="stylesheet" href="./bootstrap-5.3.2-dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="./style.css">
    <link rel="icon" href="http://www.noio.nl/favicon.ico" type="image/x-icon">
    <link rel="shortcut icon" href="http://www.noio.nl/favicon.ico" type="image/x-icon">
    <script src="https://kit.fontawesome.com/27c1c24334.js" crossorigin="anonymous"></script>
</head>

<body>

    <main class="container">
        <header>
            <div class="container-fluid container-md">
                <h2 class="mt-5 text-center text-primary">Kalender</h2>
                <div class="m-2">
                    <button class="btn" id="prevMonthBtn"><i class="fas fa-angle-double-left"></i></button>
                    <span id="currentMonth"></span>
                    <button class="btn" id="nextMonthBtn"><i class="fas fa-angle-double-right"></i></button>
                </div>
            </div>
        </header>
        <section class="container-fluid container-md">
            <table class="table table-bordered">
                <thead>
                    <tr class="text-center">
                        <th class="text" style="color: #FFFFFF; background-color: #0d6efd;">Mo</th>
                        <th class="text" style="color: #FFFFFF; background-color: #0d6efd;">Di</th>
                        <th class="text" style="color: #FFFFFF; background-color: #0d6efd;">Mi</th>
                        <th class="text" style="color: #FFFFFF; background-color: #0d6efd;">Do</th>
                        <th class="text" style="color: #FFFFFF; background-color: #0d6efd;">Fr</th>
                        <th class="text-danger" style="background-color: #0d6efd;">Sa</th>
                        <th class="text-danger" style="background-color: #0d6efd;">So</th>
                    </tr>
                </thead>
                <tbody id="calendarBody">
                    <!-- Kalender-Tage werden dynamisch hier hinzugefügt -->
                </tbody>
            </table>
        </section>
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

    <script src="../terminbuchungs/js/jquery-3.7.1.min.js"></script>
    <script src="../terminbuchungs/bootstrap-5.3.2-dist/js/bootstrap.bundle.min.js"></script>
    <script src="script.js"></script>
</body>

</html>
