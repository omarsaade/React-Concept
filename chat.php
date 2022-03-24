<?php include_once "header.php"; ?>


<body>
    <div class="wrapper">
        <section class="chat-area">
            <header>
                <a href="users.php" class="back-icon"><i class="fas fa-arrow-left"></i></a>
                <img src="download.jpg" alt="">
                <div class="details">
                    <span>
                        Coding Nepal
                    </span>
                    <p>
                        Active Now
                    </p>
                </div>
            </header>
            <div class="chat-box">
                <div class="chat outgoing">
                    <div class="details">
                        <p>abu 7meddd akhiiii</p>
                    </div>
                </div>
                <div class="chat incoming">
                    <img src="download.jpg" alt="">
                    <div class="details">
                        <p>ahla amuuraaa</p>
                    </div>
                </div>
                <div class="chat outgoing">
                    <div class="details">
                        <p>kifak akhiiii</p>
                    </div>
                </div>
                <div class="chat incoming">
                    <img src="download.jpg" alt="">
                    <div class="details">
                        <p>tamem</p>
                    </div>
                </div>
            </div>
            <form action="#" class="typing-area">
                <input type="text" class="incoming_id" name="incoming_id" value="" hidden>
                <input type="text" name="message" class="input-field" placeholder="Type a message here..." autocomplete="off">
                <button><i class="fab fa-telegram-plane"></i></button>
            </form>
        </section>
    </div>
    <script src="javascript/chat.js"></script>

</body>

</html>