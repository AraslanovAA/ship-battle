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
   
    } catch (Exception $e) {
    $error  = $e->getMessage();
    }

    if (isset ($_POST['clickedCell'])){
        echo $_POST['clickedCell'];
    }
?>
<form method="POST" action="">  
<table>
<caption>поле противника</caption>
        <?php 
        for($i = 0; $i <10 ; $i++){
            echo "<tr>";
            for($j=0;$j<10;$j++){
                echo "<td class = '" . $game->getCssClass(10*$i + $j) . "'> <input type='submit' name = 'clickedCell' value='".(10*$i + $j)."'></td>";
            }
            echo "</tr>";
        }


        ?>
        
</table>
</form>

</body>

</html>
