<?php


class Logic//класс с логикой игры
{
    protected $data_inside;
    public function __construct() {
        if (!isset($_SESSION['curgame'])) {
            $this->resetGame();
        }
        
    }
    public function setData(array $data)
    {
        $this->data_inside = $data;
    }

    public function reset() {
        if (isset($this->data_inside['reset'])) {
            $this->resetGame();
            header('Location: ./index.php');
            exit;
        }

    }
    protected function resetGame()
    {
        $_SESSION['curgame'] = array_fill(0, 100, 'water');
    }


    public function getCssClass(int $cellNum): string
    {
        return $_SESSION['curgame'][$cellNum];
    }        

    public function userMove(int $cellNum) {//имитируем обращение к серверу пока
        if(rand(0,1) == 0){
            $_SESSION['curgame'][$cellNum] = 'hit';
        }
        else{
            $_SESSION['curgame'][$cellNum] = 'miss';
        }
    }

   
}