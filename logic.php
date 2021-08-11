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
    public function testCURL(){
        $url = "localhost:3000/shoot";

        $post_data = array (
            "foo" => "bar",
            "query" => "Nettuts",
            "action" => "Submit"
        );
        $json = json_encode($post_data);
        echo $json;
        echo '<br>';
        echo $post_data;
        echo '<br>';
        $ch = curl_init();
        $json2 = '';
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_POST, 1);
        
        // Добавляем переменные
        //curl_setopt($ch, CURLOPT_POSTFIELDS, $json);
        $payload = json_encode( array( "customer"=> $post_data ) );
        $coord = '123';
        curl_setopt( $ch, CURLOPT_POSTFIELDS, $json );
        curl_setopt( $ch, CURLOPT_HTTPHEADER, array('Content-Type:application/json'));
        $output = curl_exec($ch);

        curl_close($ch);

        echo $output;
        echo '<br>';   
        $obj = json_decode($output, true);
        echo $obj['victory']; // успешно получает данные из запроса
    }
    protected function resetGame()
    {
        $_SESSION['curgame'] = array_fill(0, 100, 'water');
        if (!isset($_SESSION['name'])) {
            $_SESSION['name'] = uniqid();//дадим каждому по уникальному имени
        }

    }


    public function getCssClass(int $cellNum): string
    {
        return $_SESSION['curgame'][$cellNum];
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

        echo $output;
        echo '<br>вот выше резалт получается';   
        $obj = json_decode($output, true);
        //echo $obj['victory']; // успешно получает данные из запроса
        if($obj['shoot_result'] == 'hit'){
            $_SESSION['curgame'][$cellNum] = 'hit';
        }
        if($obj['shoot_result'] == 'miss'){
            $_SESSION['curgame'][$cellNum] = 'miss';
        }
        if($obj['shoot_result'] == 'kill'){
            $_SESSION['curgame'][$cellNum] = 'kill';
            for($i =0; $i<count($obj['cell']);$i++){
                $_SESSION['curgame'][$obj['cell'][$i]] = 'kill';
            }
        }
    }

   
}