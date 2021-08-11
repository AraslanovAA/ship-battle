<?php


class Logic//класс с логикой игры
{
    protected $data_inside;
    public function __construct() {
        if (!isset($_SESSION['player_field'])) {
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
        $_SESSION['player_field'] = array_fill(0, 100, 'water');
        $_SESSION['server_field'] = array_fill(0, 100, 'water');
        $_SESSION['server_ships'] = 10;
        $_SESSION['player_ships'] = 10;
        $_SESSION['stopGame'] = false;
        if (!isset($_SESSION['name'])) {
            $_SESSION['name'] = uniqid();//дадим каждому по уникальному имени
        }

    }
    public function checkWin() : bool {
        return  $_SESSION['stopGame'];
    }
    public function getUserShips() : int
    {
        return $_SESSION['player_ships'];
    }
    public function getServerShips() : int
    {
        return $_SESSION['server_ships'];
    }

    public function getUserCssClass(int $cellNum): string
    {
        return $_SESSION['player_field'][$cellNum];
    }        

    public function getServerCssClass(int $cellNum): string
    {
        return $_SESSION['server_field'][$cellNum];
    }        

    

    public function userMove(int $cellNum) {//имитируем обращение к серверу пока
//функ должна вернуть по сути количество кораблей оставшихся, и результат попадания 

        $url = "localhost:3000/shoot";

        $post_data = array (
            "user" => $_SESSION['name'],
            "cell" => $cellNum
        );
        $json = json_encode($post_data);

        $ch = curl_init();
        curl_setopt( $ch, CURLOPT_POSTFIELDS, $json );
                
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt( $ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
                
        $output = curl_exec($ch);
        curl_close($ch);
 
        $obj = json_decode($output, true);

        if(array_key_exists('shoot_result', $obj)){
        if($obj['shoot_result'] == 'hit'){
            $_SESSION['player_field'][$cellNum] = 'hit';
        }
        if($obj['shoot_result'] == 'miss'){
            $_SESSION['player_field'][$cellNum] = 'miss';
        }
        if($obj['shoot_result'] == 'kill'){
            //$_SESSION['player_field'][$cellNum] = 'kill'      
            for($i =0; $i<count($obj['cell']);$i++){
                $_SESSION['player_field'][$obj['cell'][$i]] = 'kill';
            }
            $this->postNumShips();
            
        }
        }

        if(array_key_exists('server_shoot', $obj)){
            if($obj['server_shoot'] == 'hit'){
                $_SESSION['server_field'][$obj['server_cell']] = 'hit';
            }
            if($obj['server_shoot'] == 'miss'){
                $_SESSION['server_field'][$obj['server_cell']] = 'miss';
            }
            if($obj['server_shoot'] == 'kill'){
                for($i =0; $i<count($obj['server_cell']);$i++){
                    $_SESSION['server_field'][$obj['server_cell'][$i]] = 'kill';
                }
                $this->postNumShips();
            }
        }


    }
    public function postNumShips(){
        $url = "localhost:3000/numShips";
            
            $post_data = array (
                "user" => $_SESSION['name']
            );
            $json = json_encode($post_data);
            $ch = curl_init();
            
            curl_setopt( $ch, CURLOPT_POSTFIELDS, $json );
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt( $ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
                    
            $output = curl_exec($ch);
            curl_close($ch);
            $obj2 = json_decode($output, true);
            $_SESSION['server_ships'] = $obj2['NumServerShips'];
            $_SESSION['player_ships'] = $obj2['numUserShips'];
            if(($_SESSION['server_ships'] == 0) || ($_SESSION['player_ships'] == 0)){
                $_SESSION['stopGame'] = true;//если у одного из игроков законились корабли поднимаем флажок конца игры
            }

   }
   
}