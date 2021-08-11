<?php
session_start();
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
    //$game->testCURL();
    if (isset ($_POST['clickedCell'])){
        echo $game->userMove($_POST['clickedCell']);
    }
    } catch (Exception $e) {
    $error  = $e->getMessage();
    }
    
?>
<form method="POST" action="">  
<table>
<caption>поле противника</caption>
        <?php 
        for($i = 0; $i <10 ; $i++){
            echo "<tr>";
            for($j=0;$j<10;$j++){
                $className = $game->getCssClass(10*$i + $j);
                if($className == "water"){
                    echo "<td class = 'water'> <input type='submit' class ='opacityFalse' name = 'clickedCell' value='".(10*$i + $j)."'></td>";
                }
                else{
                    echo "<td class = '" . $game->getCssClass(10*$i + $j) . "'><input type='submit' class ='visibleFalse' name = 'clickedCell' value='".(10*$i + $j)."'></td>";
                }
                
            }
            echo "</tr>";
        }


        ?>
        
</table>
<br><br>
<a href="./index.php?reset" >Начать сначала</a>

</form>

</body>

</html>
