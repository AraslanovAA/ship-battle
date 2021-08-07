<?php


class Logic//класс с логикой игры
{

    public function __construct() {
        if (!isset($_SESSION['curgame'])) {
            $this->resetGame();
        }
        
    }

    protected function resetGame()
    {
        $_SESSION['curgame'] = array_fill(0, 100, 'water');
        $_SESSION['curgame'][2] = "kill";
        $_SESSION['curgame'][20] = "miss";
        $_SESSION['curgame'][22] = "hit";

    }


    public function getCssClass(int $cellNum): string
    {
        return $_SESSION['curgame'][$cellNum];
    }        

}