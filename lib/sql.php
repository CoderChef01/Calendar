<?php

$configs = include(__DIR__ . '/../config.php');

class SQLMgr {
    private $connection;
    protected string $lastError;
    protected int $lastErrno;
    public function __construct()
    {
        global $configs;
        try {
            $this->connection = @mysqli_connect(
                $configs['host'],
                $configs['username'],
                $configs['password'],
                $configs['db'],
                $configs['port']
            );
        }catch (Exception $e) {
            //echo $e;
        }
    }

    /**
     * @return false|mysqli
     */
    public function getConnection()
    {
        return $this->connection;
    }

    public function getRow ($query) {
        if ($this->connection){
            $query = mysqli_query($this->connection, $query);
            if (!$query) {
                $this->lastErrno = mysqli_errno($this->connection);
                $this->lastError = mysqli_error($this->connection);
                return false;
            }
            if ($query === true){
                return true;
            }
            return mysqli_fetch_array($query);
        }
        return null;
    }

    public function get ($query) {
        $array = array();
        $query = mysqli_query($this->connection, $query);
        if (!$query) {
            $this->lastErrno = mysqli_errno($this->connection);
            $this->lastError = mysqli_error($this->connection);
            return false;
        }
        if ($query === true){
            return true;
        }
        while ($row = mysqli_fetch_array($query, MYSQLI_ASSOC))
        {
            $array[] = $row;
        }
        return $array;
    }

    /**
     * Get the last error of this Object (Usually SQL related issues)
     * @return array
     */
    public function GetLastError(): array
    {
        if(!isset($this->lastError)){
            return array(
                "error" => null,
                "errno" => null
            );
        }
        return array(
            "error" => $this->lastError,
            "errno" => $this->lastErrno
        );
    }
}