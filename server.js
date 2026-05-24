const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

app.get("/auth/discord/callback", async (req, res) => {
    const { code } = req.query;
    if (!code) return res.status(400).send("Brak kodu");

    try {
        const params = new URLSearchParams({
            client_id: "1480598374024483012",
            client_secret: "lTuncHfyQxH36Hidc-dyCEVmpKFLXUsm",
            grant_type: "authorization_code",
            code: code,
            redirect_uri: "https://vast-roleplay-api.onrender.com/auth/discord/callback"
        });

        const tokenRes = await fetch("https://discord.com/api/oauth2/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params
        });
        const tokenData = await tokenRes.json();
        
        if (!tokenData.access_token) return res.status(500).send("Błąd autoryzacji");

        const userRes = await fetch("https://discord.com/api/users/@me", {
            headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });
        const user = await userRes.json();

        // Przekierowanie z danymi w URL
        res.redirect(`https://rickulinio.github.io/vastrp/?id=${user.id}&name=${encodeURIComponent(user.username)}`);
    } catch (err) {
        res.status(500).send("Błąd: " + err.message);
    }
});

app.listen(process.env.PORT || 3000, () => console.log("Serwer aktywny"));