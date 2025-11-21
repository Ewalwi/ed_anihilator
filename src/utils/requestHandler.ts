document.onkeydown = function (event) {
    if (event.code === "Enter") {
        enterCmd(document.getElementById('cmdInput').value)
        document.getElementById('cmdInput').value = "";
    }
}

async function enterCmd(text) {
    text = parse(text);
    document.getElementById('message').innerText += '\n' + await run(text[0], text.slice(1));
}

function parse(text) {
    return text.split(" ");
}

async function run(cmd, args) {
    if (cmd === "auth") {
        if (args[0] === "login") {
            return 'Auth by login is not implemented yet.'
        } else if (args[0] === "token") {
            return log(args[1], sessionStorage.getItem('id'), sessionStorage.getItem('type'))
        } else if (args[0] === "storage") {
            return log("save", sessionStorage.getItem('id'), sessionStorage.getItem('type'))
        } else {
            return 'Auth failed'
        }
        return 'Incorrect authentification method'
    } else if (cmd === "save") {
        localStorage.setItem('token', sessionStorage.getItem('token'))
        localStorage.setItem('id', sessionStorage.getItem('id'))
        localStorage.setItem('type', sessionStorage.getItem('type'))
        return 'Session saved.'
    } else if (cmd === "id") {
        sessionStorage.setItem('id', args[0])
        sessionStorage.setItem('type', args[1])
        return 'Established session as '+ args[1] + ' ' +args[0]
    }
    return "Unknown command"
}

async function log(token, id, type) {
    if (token === "save") {
        sessionStorage.setItem('token', localStorage.getItem('token'));
        sessionStorage.setItem('id', localStorage.getItem('id'));
        sessionStorage.setItem('type', localStorage.getItem('type'));
        log(sessionStorage.getItem('token'), sessionStorage.getItem('id'), sessionStorage.getItem('type'))
        return 'Opened session from saved data.'
    } else {
        let tokenValid = await testToken(token)
        if (tokenValid[0]) {
            print(tokenValid[1]);
            sessionStorage.setItem('token', token)
            return("Please give the ID and type of the account doing\nid [id] [type]");
        } else {
            return tokenValid[1]
        }
    }

}

async function testToken(token) {
    try {
        response = await fetch(`https://api.ecoledirecte.com/v3/groupesFlexibles.awp?verbe=get&idEleve=0&v=4.89.2`, {
            "headers": {
                "2fa-token": "",
                "accept": "application/json, text/plain, */*",
                "accept-language": "fr-FR,fr;q=0.9",
                "cache-control": "no-cache",
                "content-type": "application/x-www-form-urlencoded",
                "pragma": "no-cache",
                "priority": "u=1, i",
                "sec-ch-ua": "\"Chromium\";v=\"142\", \"Brave\";v=\"142\", \"Not_A Brand\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Linux\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-site",
                "sec-gpc": "1",
                "x-token": token
            },
            "referrer": "",
            "body": "data={}",
            "method": "POST",
            "mode": "cors",
            "credentials": "omit"
        })
        let data = await response.json()
        if (data.code !== 200) {
            return [false, "Error "+ data.code + ": " + data.message, token]
        }
        return [true, "Authentified with success", ""]
    } catch (error) {
        return [false, error, ""]
    }
}

function print(text) {
    document.getElementById('message').innerText += '\n' + text;
}

async function searchID() {
    let response = await fetch("https://api.ecoledirecte.com/v3/elevesDocuments.awp?archive=&verbe=get&v=4.89.2", {
        "credentials": "omit",
        "headers": {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:145.0) Gecko/20100101 Firefox/145.0",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3",
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Token": sessionStorage.getItem('token'),
            "2FA-Token": "400ecac8-44e1-4bf6-a4e2-e77d64d9acc5",
            "Sec-GPC": "1",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site"
        },
        "referrer": "https://www.ecoledirecte.com/",
        "body": "data={}",
        "method": "POST",
        "mode": "cors"
    });
    response = await response.json()
    console.log(response)
    profile = {}
    response.data.listesPiecesAVerser.personnes.forEach(person => {
        profile = person
    });
    if (profile.id) {
        print('Found an id: '+profile.id)
        sessionStorage.setItem('id', profile.id)
    }
    if (profile.type) {
        print('Found an id: '+profile.type)
        sessionStorage.setItem('type', profile.type)
    }
    log(sessionStorage.getItem('token'), sessionStorage.getItem('id'), sessionStorage.getItem('type'))
}