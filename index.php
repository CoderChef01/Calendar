<?php
require(__DIR__ . '/lib/lang.php');
require(__DIR__ . '/lib/sql.php');
$lng = new Lang();
$sqlMGR = new SQLMgr();

$bookings = $sqlMGR->get('SELECT `impdatum`, `kalkzeit` FROM `kunden`');

$globalCalendarData = array(
    'bookings' => $bookings,
    'translations' => $lng->getTranslations()
);

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
    <title><?php $lng->echoText('calendar'); ?></title>
    <link rel="stylesheet" href="./vendor/bootstrap-5.3.2-dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="./vendor/fontawesome-free-5.15.4-web/css/all.min.css">
    <link rel="stylesheet" href="./style.css">
    <link rel="icon" href="./favicon.ico" type="image/x-icon">
    <link rel="shortcut icon" href="./favicon.ico" type="image/x-icon">
    <script type="application/javascript">
        /**
         * Global Data from SQL
         */
        window.calendarData = <?php echo json_encode($globalCalendarData); ?>;
    </script>
</head>

<body>
<div class="container">
    <main class="row">
        <div class="col-md-12">
            <div class="head-image">
                <div class="image-wrapper">
                    <img src="./images/dinkel_logo_pur.png" alt="Dinkel Bader Warme Klima"/>
                </div>
            </div>
            <!-- Kopfzeile Anfang -->
            <ul class="hidden nav nav-pills nav-fill gap-2 p-1 small bg-primary rounded-5 shadow-sm" id="pillNav2" role="tablist" style="--bs-nav-link-color: var(--bs-white); --bs-nav-pills-link-active-color: var(--bs-primary); --bs-nav-pills-link-active-bg: var(--bs-white); height: 50px;">
                <li class="nav-item">
                    <span class="nav-link text-white"><?php $lng->echoText('client_name'); ?></span>
                </li>
                <?php if ($objekt !== $kuname): ?>
                    <li class="nav-item">
                        <span class="nav-link text-white"><?php echo $objekt; ?></span>
                    </li>
                <?php endif; ?>
                <li class="nav-item">
                    <span class="nav-link text-white"><?php echo $lng->getText('start_time') . ' - ' . $lng->getText('end_time'); ?></span>
                </li>
                <li class="nav-item">
                    <span class="nav-link text-white"><?php $lng->echoText('work_length'); ?></span>
                </li>
            </ul>
            <!-- Kopfzeile Ende -->
            <div class="head-menu">
                <div class="separator"></div>
                <div class="line"><div class="menu"><?php $lng->echoText('client_name'); ?>:</div><div class="value">Thomas Braun</div></div>
                <div class="line"><div class="menu"><?php $lng->echoText('object'); ?>:</div><div class="value">Festen Wohnung</div></div>
                <div class="line"><div class="menu"><?php $lng->echoText('date'); ?>:</div><div class="value">11-12-2023 - 29-12-2023</div></div>
                <div class="line"><div class="menu"><?php $lng->echoText('time'); ?>:</div><div class="value">10:00 - 11:30</div></div>
            </div>

            <!-- Kalender Anfang -->
            <div id="calendar_first" class="calendar calendar-first">
                <div class="calendar_header">
                    <button id="prevMonthBtn" class="switch-month switch-left"> <i class="fa fa-chevron-left"></i></button>
                    <h2 id="currentMonth"></h2>
                    <button id="nextMonthBtn" class="switch-month switch-right"> <i class="fa fa-chevron-right"></i></button>
                </div>
                <div class="calendar_weekdays">
                    <div><?php $lng->getText('mo'); ?></div>
                    <div><?php $lng->getText('tu'); ?></div>
                    <div><?php $lng->getText('we'); ?></div>
                    <div><?php $lng->getText('th'); ?></div>
                    <div><?php $lng->getText('fr'); ?></div>
                    <div class="weekend"><?php $lng->getText('sa'); ?></div>
                    <div class="weekend"><?php $lng->getText('so'); ?></div>
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
                    <h5 class="modal-title"><?php $lng->echoText('choose_a_free_appointment'); ?></h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="<?php $lng->echoText('close'); ?>"></button>
                </div>
                <div class="modal-body">
                </div>
            </div>
        </div>
    </div>

    <script src="./script.js"></script>
</body>

</html>
