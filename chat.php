<?php session_start();
// as u know , session will be set when user login or signup
//if session not set then we'll redirect user to login page
if (!isset($_SESSION['unique_id'])) {
    header("location: login.php");
}
?>
<?php include_once "header.php"; ?>

<body>
    <div class="wrapper">
        <section class="chat-area">
            <header>
                <?php
                include_once "php/config.php";
                $user_id = mysqli_real_escape_string($conn, $_GET['user_id']);
                $sql = mysqli_query($conn, "SELECT * FROM users WHERE unique_id = {$user_id}");
                if (mysqli_num_rows($sql) > 0) {
                    $row = mysqli_fetch_assoc($sql);
                } ?>
                <a href="users.php" class="back-icon"><i class="fas fa-arrow-left"></i></a>
                <img src="php/images/<?php echo $row['img']; ?>" alt="">
                <div class="details">
                    <span>
                        <?php echo $row['fname'] . " " . $row['lname'] ?>
                    </span>
                    <p>
                        <?php echo $row['status']; ?>
                    </p>
                </div>
            </header>
            <div class="chat-box"></div>

            <form class="typing-area" action="#" autocomplete="off">
                <input type="text" name="outgoing_id" value="<?php echo $_SESSION['unique_id']; ?>" hidden>
                <input type="text" name="incoming_id" value="<?php echo $user_id; ?>" hidden>
                <input type="text" name="message" class="input-field" placeholder="Type a message here...">
                <button><i class="fab fa-telegram-plane"></i></button>
            </form>
            <!-- msg_sender_id : $_SESSION'unique_id'///===// msg_receiver_id : $user_id -->
        </section>
    </div>
    <script src="javascript/chat.js"></script>

</body>

</html>