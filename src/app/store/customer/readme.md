Customer strategy:

check if the user has medusaId property;
    if there is no medusa user;
        create medusa user;
    if there is medusa user;
        login and get session token
            once gotten medusa session
                make customer edit addresses available;
    loop();
