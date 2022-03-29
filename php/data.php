<?php
while ($row = mysqli_fetch_assoc($sql)) { // he row lal ne2at el 5
    $sql2 = "SELECT * FROM messages WHERE (incoming_msg_id = {$row['unique_id']}
            OR outgoing_msg_id = {$row['unique_id']}) AND (outgoing_msg_id = {$outgoing_id} 
            OR incoming_msg_id = {$outgoing_id}) ORDER BY msg_id DESC LIMIT 1";

    $query2 = mysqli_query($conn, $sql2); //lal offline , lal you , trimming
    $row2 = mysqli_fetch_assoc($query2);
    if (mysqli_num_rows($query2) > 0) {
        $result = $row2['msg']; //tayeb ya tayeb
    } else {
        $result = "No message available";
    }

    //trimming message if word are more than 28
    (strlen($result) > 28) ? $msg = substr($result, 0, 15) . '...' : $msg = $result;
    //adding you: text before msg if login id send msg
    ($outgoing_id == isset($row2['outgoing_msg_id'])) ? $you = "You: " : $you = "";
    // if ($outgoing_id == isset($row2['outgoing_msg_id'])) {
    //     $you = "You: ";
    // } else {
    //     $you = "";
    // } 
    //check user is online or ofline
    ($row['status'] == "Offline now") ? $offline = "offline" : $offline = "";

    //outgoing_id = ali saade 119
    $output .= '<a href="chat.php?user_id=' . $row['unique_id'] . '">
                <div class="content">
                <img src="php/images/' . $row['img'] . '" alt="">
                <div class="details">
                    <span>' . $row['fname'] . " " . $row['lname'] . '</span>
                    <p>' . $you . $msg . '</p> 
                </div>
                </div>
                <div class="status-dot ' . $offline . '"><i class="fas fa-circle"></i></div>
                </a>';
}
