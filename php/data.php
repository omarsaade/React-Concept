<?php
while ($row = mysqli_fetch_assoc($sql)) {
    //Using this id we'll identify the msg receiver user
    //using this id lets get the user image , name ,and status

    $output .= ' <a href="chat.php?user_id=' . $row['unique_id'] . '">
<div class="content">
    <img src="php/images/' . $row['img'] . '" alt="">
    <div class="details">
        <span>' . $row['fname'] . " " . $row['lname'] . '</span>
        <p>This is test message</p> 
    </div>
</div>
<div class="status-dot"><i class="fas fa-circle"></i></div>
</a>';
}
