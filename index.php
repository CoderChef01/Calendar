<?php
require(__DIR__ . '/lib/lang.php');
require(__DIR__ . '/lib/sql.php');
$lng = new Lang();
$sqlMGR = new SQLMgr();
$aufid = false;

$bookings = $sqlMGR->get('SELECT `wartdatum`, `wartzeit` FROM `kunden`');

$globalCalendarData = array(
    'bookings' => $bookings,
    'translations' => $lng->getTranslations(),
    'loaded' => false,
    'client' => 'No data',
    'subject' => 'No data',
    'date_from' => '11-12-2023',
    'date_to' => '29-12-2023',
    'work_length' => '90',
    'wartdatum' => null,
    'wartzeit' => null,
    'post' => ''
);
if (isset($_POST['aufid'])) {

    if (!$_POST['aufid']) {
        http_response_code(400);
        echo $lng->getText('http_400');
        exit(400);
    }

    if(isset($_POST['wartdatum']) && isset($_POST['wartzeit'])) {
        $aufid = mysqli_real_escape_string($sqlMGR->getConnection(), $_POST['aufid']);
        if (!$aufid || $aufid === 'undefined') {
            http_response_code(400);
            echo $lng->getText('http_400');
            exit(400);
        }
        $data = $sqlMGR->getRow('SELECT aufid, wartdatum, wartzeit FROM `kunden` WHERE aufid = ' . $aufid);
        if (!is_array($data)) {
            http_response_code(404);
            echo $lng->getText('http_404');
            exit(404);
        }

        if (trim($data['wartzeit'])) {
            http_response_code(410);
            echo $lng->getText('http_410');
            exit(410);
        }

        $wartdatum = mysqli_real_escape_string($sqlMGR->getConnection(), $_POST['wartdatum']);
        $wartzeit = mysqli_real_escape_string($sqlMGR->getConnection(), $_POST['wartzeit']);
        // TODO: Notes are here if you need
        $notes = mysqli_real_escape_string($sqlMGR->getConnection(), isset($_POST['notes']) ? $_POST['notes'] : '');
        // We can proceed
        if ($sqlMGR->getRow('UPDATE `kunden` SET wartdatum=\''.$wartdatum.'\', wartzeit=\''.$wartzeit.'\', mailzust=\'3\' WHERE aufid = '.$aufid)) {
            // Done
            http_response_code(201);
            echo $lng->getText('http_201');
            exit(201);

        } else {
            http_response_code(500);
            echo $lng->getText('http_500') . " ID: ".$sqlMGR->lastErrno." Msg: ".$sqlMGR->lastError;
            exit(500);
        }
    } else {
        http_response_code(400);
        echo $lng->getText('http_400');
        exit(400);
    }
}

if (isset($_GET['aufid']) && $_GET['aufid']) {
    $aufid = mysqli_real_escape_string($sqlMGR->getConnection(), $_GET['aufid']);
}

if ($aufid) {
    $globalCalendarData['aufid'] = $aufid;
    $data = $sqlMGR->getRow('SELECT * FROM `kunden` WHERE aufid = ' .
        mysqli_real_escape_string($sqlMGR->getConnection(), $_GET['aufid']));

    if (is_array($data)) {
        $globalCalendarData['client'] = $data['kuname'];
        $globalCalendarData['subject'] = $data['objekt'];
        $globalCalendarData['date_from'] = $data['wartdatumvon'];
        $globalCalendarData['date_to'] = $data['wartdatumbis'];
        $globalCalendarData['wartzeit'] = $data['wartzeit'];
        $globalCalendarData['wartdatum'] = $data['wartdatum'];
        $globalCalendarData['loaded'] = true;
    }
}

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
            <!-- Kopfzeile Ende -->
            <div class="head-menu">
                <div class="separator"></div>
                <div class="line">
                    <div class="menu"><?php $lng->echoText('client_name'); ?>:</div>
                    <div class="value"><?php echo $globalCalendarData['client']; ?></div>
                </div>
                <div class="line">
                    <div class="menu"><?php $lng->echoText('object'); ?>:</div>
                    <div class="value"><?php echo $globalCalendarData['subject']; ?></div>
                </div>
                <div class="line">
                    <div class="menu"><?php $lng->echoText('date'); ?>:</div>
                    <div class="value"><?php echo $globalCalendarData['date_from'] . " - " . $globalCalendarData['date_to']; ?></div>
                </div>
                <div class="line">
                    <div class="menu"><?php $lng->echoText('time'); ?>:</div>
                    <div class="value">
                    <?php
                        if ($globalCalendarData['wartdatum'] && $globalCalendarData['wartzeit']) {
                            echo$globalCalendarData['wartdatum'] . " " . $globalCalendarData['wartzeit'];
                        } else {
                            echo '90 ' . $lng->getText('minutes');
                        }
                     ?></div>
                </div>
            </div>

            <!-- Kalender Anfang -->
            <div id="calendar_first" class="calendar calendar-first">
                <div class="calendar_header">
                    <button id="prevMonthBtn" class="switch-month switch-left"> <i class="fa fa-chevron-left"></i></button>
                    <h2 id="currentMonth"></h2>
                    <button id="nextMonthBtn" class="switch-month switch-right"> <i class="fa fa-chevron-right"></i></button>
                </div>
                <div class="calendar_weekdays">
                    <div><?php $lng->echoText('mo'); ?></div>
                    <div><?php $lng->echoText('tu'); ?></div>
                    <div><?php $lng->echoText('we'); ?></div>
                    <div><?php $lng->echoText('th'); ?></div>
                    <div><?php $lng->echoText('fr'); ?></div>
                    <div class="weekend"><?php $lng->echoText('sa'); ?></div>
                    <div class="weekend"><?php $lng->echoText('su'); ?></div>
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
