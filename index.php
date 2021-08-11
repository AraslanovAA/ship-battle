<?php
session_start();
/*
файл logic.php определяет логику игры
при нажатии на клетку поля отправляется post запрос php с номером нажатой клетки $_POST['clickedCell']
php отправляет координаты выстрела на сервер node через post, результат выстрела записывается в данные сессии
при создании страницы php берёт данные из сессии и устанавливает стили ячеек в зависимости от состояния клетки
стилям соответствуют картинки с изображениями соответствующих состояний корабля
*/
?>

<!DOCTYPE html>
<html lang="ru">
<head>

<meta charset="UTF-8">
    <title>морской бой</title>
    <link href="./style3.css" rel="stylesheet" type="text/css" />

    </head>
<body>

<?php
try {
    include './logic.php';
    $game = new Logic();
    $game->setData($_GET);
    $game->reset();
    
    $checkWin = $game->checkWin();
    if($checkWin){
        if($game->getUserShips() == 0){
            echo 'Вы выиграли';
            }
            else{
                echo 'Вы проиграли';
            }
    }
    else{
    if (isset ($_POST['clickedCell'])){
        $game->userMove($_POST['clickedCell']);
    }}
    $checkWin = $game->checkWin();
    if($checkWin){
        if($game->getUserShips() == 0){
        echo 'Вы выиграли';
        }
        else{
            echo 'Вы проиграли';
        }
    }
    } catch (Exception $e) {
    $error  = $e->getMessage();
    }
    
?>
<div class="container">
<form method="POST" action="">  
<table>
<caption>кораблей противника: <?php echo $game->getUserShips() ?></caption>
        <?php 
        if(!$checkWin){
        for($i = 0; $i <10 ; $i++){
            echo "<tr>";
            for($j=0;$j<10;$j++){
                $className = $game->getUserCssClass(10*$i + $j);
                if($className == "water"){
                    echo "<td class = 'water'> <input type='submit' class ='opacityFalse' name = 'clickedCell' value='".(10*$i + $j)."'></td>";
                }
                else{
                    echo "<td class = '" . $game->getUserCssClass(10*$i + $j) . "'><input type='submit' class ='visibleFalse' name = 'clickedCell' value='".(10*$i + $j)."'></td>";
                }
                
            }
            echo "</tr>";
        }
        }
        else{
            for($i = 0; $i <10 ; $i++){
                echo "<tr>";
                for($j=0;$j<10;$j++){
                      echo "<td class = '" . $game->getUserCssClass(10*$i + $j) . "'><a href=" .'"./index.php?reset"'." ></a></td>";
                }
                echo "</tr>";
            }
        }

        ?>
        
</table>


</form>

<form method="POST" action="">  
<table>
<caption>ваших кораблей: <?php echo $game->getServerShips() ?></caption>
        <?php 
        for($i = 0; $i <10 ; $i++){
            echo "<tr>";
            for($j=0;$j<10;$j++){
                echo "<td class = '" . $game->getServerCssClass(10*$i + $j) . "'><input type='hidden' class ='visibleFalse'></td>";
              
            }
            echo "</tr>";
        }


        ?>
        
</table>

</form>













</div>
<?php
if ($checkWin){
echo '<a href="./index.php?reset" >Новая игра</a>';
} ?>
</body>

</html>
