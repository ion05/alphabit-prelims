var notyf = new Notyf();

async function indexSignup() {
    let full_name, username, email, password, confirm_password, type_of_user;

    full_name = window.document.getElementById('signup-index-fullname').value
    username = window.document.getElementById('signup-index-username').value
    email = window.document.getElementById('signup-index-email').value
    password = window.document.getElementById('signup-index-password').value
    confirm_password = window.document.getElementById('signup-index-confirm-password').value
    type_of_user = window.document.getElementById('type_of_user').checked

    if (full_name.length != 0 && username.length != 0 && email.length != 0 && password.length != 0 &&
        confirm_password.length != 0) {
        if (password.length >= 6) {
            if (password == confirm_password) {
                try {
                    const response = await (
                        await fetch(
                            window.location.origin + `/register`, {
                            method: "POST",
                            redirect: 'follow',
                            body: JSON.stringify({
                                name: full_name,
                                username: username,
                                email: email,
                                password: password,
                                type_of_user: type_of_user
                            }),
                            headers: {
                                "Content-Type": "application/json; charset=utf-8"
                            },
                        }).then(response => {
                            if (response.redirected) {
                                window.location.href = response.url;
                            } else {
                                return response.json()
                            }
                        })
                    )

                    //if register was successfull, we try automatic login and go whereever it redirects us.
                    if (response.success === true) {
                        notyf.success(response.message)
                        notyf.success('Trying To Login')
                        await fetch(
                            window.location.origin + `/login`, {
                            method: "POST",
                            redirect: 'follow',
                            body: JSON.stringify({
                                email: email,
                                password: password,
                            }),
                            headers: {
                                "Content-Type": "application/json; charset=utf-8"
                            },
                        }
                        ).then(response => {
                            if (response.redirected) {
                                notyf.success('Login Successful, Redirecting To Dashboard')
                                window.location.href = response.url;
                            }
                        })

                    }
                    else {
                        notyf.error(response.message)
                    }
                } catch (e) {
                    console.log(e)
                }

            } else {
                notyf.error("Password's do not match");
            }
        } else {
            notyf.error("Password has to be at minimum of 6 letters.");
        }
    } else {
        notyf.error("Please Fill All The Fields");
    }
}
