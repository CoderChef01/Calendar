<?php


return array(
    'host' => 'localhost',
    'username' => 'root',
    'password' => '',
    'port' => 3306,
    'db' => 'dinkel',
    'monteuren' => array(
        "Monteur1" => array(
            null, // Sunday
            array("07:30", "16:45"), // Monday
            array("07:30", "16:45"), // Tuesday
            array("07:30", "16:45"), // Wednesday
            array("07:30", "16:45"), // Thursday
            array("07:30", "15:15"), // Friday
            null, // Saturday
        ),
        "Monteur2" => array(
            null,
            array("07:30", "18:00"),
            array("07:30", "18:00"),
            array("07:30", "18:00"),
            array("07:30", "18:00"),
            null,
            null,
        ),
        "Kessel1" => array(
            null,
            array("07:30", "16:45"),
            array("07:30", "16:45"),
            array("07:30", "16:45"),
            array("07:30", "16:45"),
            array("07:30", "15:15"),
            null,
        ),
        "Kessel2" => array(
            null,
            array("07:30", "18:00"),
            array("07:30", "18:00"),
            array("07:30", "18:00"),
            array("07:30", "18:00"),
            null,
            null,
        ),
        "default" => array(
            null,
            array("07:30", "16:45"),
            array("07:30", "16:45"),
            array("07:30", "16:45"),
            array("07:30", "16:45"),
            array("07:30", "15:15"),
            null,
        ),
    )
);