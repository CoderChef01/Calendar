<?php


class Lang
{
    private $languagesPath;
    private $accepted;

    protected $language;
    protected $translations;

    public function __construct()
    {
        $this->languagesPath = __DIR__ . '/../languages/';
        $this->accepted = $this->acceptedLanguages();

        if (isset($_GET['language']) && $_GET['language']) {
            $lang = trim(stripcslashes($_GET['language']));
        } else {
            $lang = substr($_SERVER['HTTP_ACCEPT_LANGUAGE'], 0, 2);
        }
        if (!$lang) {
            $lang = 'en';
        }

        $this->language = in_array($lang, $this->accepted) ? $lang : 'en';

        $this->translations = $this->loadLanguage() ?? array();
    }

    private function acceptedLanguages (): array
    {
        $jsonFiles = glob($this->languagesPath . '*.json');

        $languageList = [];
        foreach ($jsonFiles as $jsonFile) {
            $languageList[] = pathinfo($jsonFile, PATHINFO_FILENAME);
        }

        return $languageList;
    }

    public function loadLanguage() {
        if ($this->languagesPath && $this->language) {
            $filePath = $this->languagesPath . $this->language . '.json';
            if (file_exists($filePath)) {
                $jsonContent = file_get_contents($filePath);
                return json_decode($jsonContent, true);
            }
        }
        return null;
    }

    public function getText($text) {
        if (isset($this->translations[$text])) {
            return $this->translations[$text];
        }
        return $text;
    }

    public function echoText($text) {
        echo $this->getText($text);
    }

    public function getTranslations() {
        return $this->translations;
    }
}