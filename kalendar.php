<?php
 $kuname = "Ügyfél neve";
 $objekt = "Objekt";
 $wartdatumvon = "idő kezdete";
 $wartdatumbis = "idő vége";
 $kalkzeit = "munka hossza";
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
<div class="container">
    <main class="row">
        <div class="col-md-12">
            <!-- Kopfzeile Anfang -->
            <ul class="nav nav-pills nav-fill gap-2 p-1 small bg-primary rounded-5 shadow-sm" id="pillNav2" role="tablist" style="--bs-nav-link-color: var(--bs-white); --bs-nav-pills-link-active-color: var(--bs-primary); --bs-nav-pills-link-active-bg: var(--bs-white); height: 50px;">
                <li class="nav-item">
                    <span class="nav-link text-white"><?php echo $kuname; ?></span>
                </li>
                <?php if ($objekt !== $kuname): ?>
                    <li class="nav-item">
                        <span class="nav-link text-white"><?php echo $objekt; ?></span>
                    </li>
                <?php endif; ?>
                <li class="nav-item">
                    <span class="nav-link text-white"><?php echo $wartdatumvon . ' - ' . $wartdatumbis; ?></span>
                </li>
                <li class="nav-item">
                    <span class="nav-link text-white"><?php echo $kalkzeit; ?></span>
                </li>
            </ul>
            <!-- Kopfzeile Ende -->

            <!-- Kalender Anfang -->
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
                    <!-- Inhalt des Kalenders -->
                </div>
            </div>
            <!-- Kalender Ende -->
        </div>
    </main>
</div>


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
