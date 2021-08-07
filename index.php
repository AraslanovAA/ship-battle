<!DOCTYPE html>
<html lang="ru">
<head>
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
?>

<table>
<caption>поле противника</caption>
        <?php 
        for($i = 0; $i <10 ; $i++){
            echo "<tr>";
            for($j=0;$j<10;$j++){
                echo "<td class = '" . $game->getCssClass(10*$i + $j) . "'><a href='./index.php?move=" . (10*$i + $j) ."'></a></td>";
            }
            echo "</tr>";
        }


        ?>
        
</table>


</body>

</html>
