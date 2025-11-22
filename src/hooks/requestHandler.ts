"use client";

import { encodeBase64 } from "../utils/base64";

async function testToken(token: string): Promise<[boolean, string, string]> {
    try {
      const response = await fetch(
        `https://api.ecoledirecte.com/v3/groupesFlexibles.awp?verbe=get&idEleve=0&v=4.89.2`,
        {
          headers: {
            "2fa-token": "",
            accept: "application/json, text/plain, */*",
            "accept-language": "fr-FR,fr;q=0.9",
            "cache-control": "no-cache",
            "content-type": "application/x-www-form-urlencoded",
            pragma: "no-cache",
            priority: "u=1, i",
            "sec-ch-ua":
              '"Chromium";v="142", "Brave";v="142", "Not_A Brand";v="99"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Linux"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "sec-gpc": "1",
            "x-token": token,
          },
          referrer: "",
          body: "data={}",
          method: "POST",
          mode: "cors",
          credentials: "omit",
        }
      );
      const data = await response.json();
      if (data.code !== 200) {
        return [false, "Error " + data.code + ": " + data.message, token];
      }
      return [true, "Authentified with success", ""];
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return [false, errorMessage, ""];
    }
  }

export async function log(token: string, print: (text: string) => void): Promise<string | void> {
    if (token === "save") {
      sessionStorage.setItem("token", localStorage.getItem("token") || "");
      sessionStorage.setItem("id", localStorage.getItem("id") || "");
      sessionStorage.setItem("type", localStorage.getItem("type") || "");
      await log(sessionStorage.getItem("token") || "", print);
      return "Opened session from saved data.";
    } else {
      const tokenValid = await testToken(token);
      if (tokenValid[0]) {
        print(tokenValid[1]);
        sessionStorage.setItem("token", token);
        return "Please give the ID and type of the account doing\nid [id] [type]";
      } else {
        return tokenValid[1];
      }
    }
  }

export async function searchID(print: (text: string) => void) {
    try {
      const res = await fetch(
        "https://api.ecoledirecte.com/v3/elevesDocuments.awp?archive=&verbe=get&v=4.89.2",
        {
          credentials: "omit",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (X11; Linux x86_64; rv:145.0) Gecko/20100101 Firefox/145.0",
            Accept: "application/json, text/plain, */*",
            "Accept-Language": "fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3",
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Token": sessionStorage.getItem("token") || "",
            "2FA-Token": "400ecac8-44e1-4bf6-a4e2-e77d64d9acc5",
            "Sec-GPC": "1",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site",
          },
          referrer: "https://www.ecoledirecte.com/",
          body: "data={}",
          method: "POST",
          mode: "cors",
        }
      );
      const data = await res.json();
      console.log(data);
      type Profile = {
        id?: number | string;
        type?: string;
        [k: string]: unknown;
      };
      let profile: Profile = {};
      if (
        data &&
        data.data &&
        data.data.listesPiecesAVerser &&
        data.data.listesPiecesAVerser.personnes
      ) {
        data.data.listesPiecesAVerser.personnes.forEach((person: Profile) => {
          profile = person;
        });
      }
      if (profile.id) {
        print("Found an id: " + profile.id);
        sessionStorage.setItem("id", profile.id.toString());
      }
      if (profile.type) {
        print("Found a type: " + profile.type);
        sessionStorage.setItem("type", profile.type);
      }
      await log(sessionStorage.getItem("token") || "", print);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      print("Error during searchID: " + msg);
    }
  }

export async function message(targetID: number, type: string, subject: string, content: string, print: (text: string) => void): Promise<void> {
  try {
    const res = await fetch("https://api.ecoledirecte.com/v3/eleves/5988/messages.awp?verbe=post&v=4.89.3", {
        "credentials": "omit",
        "headers": {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:145.0) Gecko/20100101 Firefox/145.0",
            "Accept": "application/json, text/plain, */*",
            "Accept-Language": "fr,fr-FR;q=0.8,en-US;q=0.5,en;q=0.3",
            "Content-Type": "application/x-www-form-urlencoded",
            "X-Token": "37402abe-9197-4a28-98e6-fa72ab148b65",
            "2FA-Token": "80a0ca14-5b7c-41fa-a178-7a916af43a33",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-site"
        },
        "referrer": "https://www.ecoledirecte.com/",
        "body": `data={\n    "message": {\n        "subject": "${subject}",\n        "content": "${encodeBase64(content)}",\n        "groupesDestinataires": [\n            {\n                "destinataires": [\n                    {\n                        "civilite": "",\n                        "nom": "z",\n                        "prenom": "z",\n                        "particule": "",\n                        "type": "${type}",\n                        "id": ${targetID},\n                        "sexe": "",\n                        "matiere": "",\n                        "classe": {\n                            "id": 49,\n                            "libelle": "Première A",\n                            "code": "1°A"\n                        },\n                        "photo": "",\n                        "badge": "",\n                        "etablissements": [],\n                        "responsable": {\n                            "id": 0,\n                            "typeResp": "",\n                            "versQui": "",\n                            "contacts": []\n                        },\n                        "fonction": {\n                            "id": 0,\n                            "libelle": ""\n                        },\n                        "isPP": false,\n                        "isSelected": true,\n                        "uniqID": "5988_E_0_0",\n                        "to_cc_cci": "to",\n                        "idRegime": 0\n                    }\n                ],\n                "selection": {\n                    "type": "W"\n                }\n            }\n        ],\n        "transfertFiles": [],\n        "files": [],\n        "date": "2025-11-22 14:01:29",\n        "read": true,\n        "from": {\n            "role": "E",\n            "id": 5988,\n            "read": true\n        },\n        "brouillon": false\n    },\n    "anneeMessages": ""\n}`,
        "method": "POST",
        "mode": "cors"
    });
    const data = await res.json();
    if (data.code === 200) {
      print("message sent successfully to ID " + targetID);
    }
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    print("Error during message sending: " + msg);
  }
}
