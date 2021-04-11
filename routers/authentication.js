require("dotenv").config();

const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/auth");
const Auth = require("../models/Auth");

module.exports = {
    config: function (app) {
        function generateTokens(payload) {
            const { id, username } = payload;
            const accessToken = jwt.sign(
                { id, username },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: "5m",
                }
            );

            const refreshToken = jwt.sign(
                { id, username },
                process.env.REFRESH_TOKEN_SECRET,
                {
                    expiresIn: "1h",
                }
            );

            return { accessToken, refreshToken };
        }

        function updateRefreshToken(infoUser, refreshToken) {
            Auth.where({ _id: infoUser.id }).update({ $set: { refreshToken: refreshToken } })
                .catch(err => console.log(error))
        }

        app.post("/token", (req, res) => {
            const refreshToken = req.body.refreshToken;
            if (!refreshToken) return res.sendStatus(401);

            Auth.find({ refreshToken: refreshToken })
                .then(data => {
                    if (data.length === 0) return res.sendStatus(403);
                    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                    const tokens = generateTokens({ username: data[0].username, id: data[0]._id });
                    updateRefreshToken({ username: data[0].username, id: data[0]._id }, tokens.refreshToken);
                    res.json(tokens);
                })
                .catch(error => {
                    console.log(error);
                    return res.sendStatus(403);
                })
        })

        app.post("/login", (req, res) => {
            Auth.find({ username: req.body.username, password: req.body.password })
                .then((data) => {
                    if (data.length === 0) return res.status(401);
                    const tokens = generateTokens({
                        username: data[0].username,
                        id: data[0]._id,
                    });
                    updateRefreshToken(
                        { username: data[0].username, id: data[0]._id },
                        tokens.refreshToken
                    );
                    return res.json(tokens);
                })
                .catch((error) => {
                    console.log(error);
                    return res.status(403);
                });
        })

        app.delete("/logout", verifyToken, (req, res) => {
            Auth.find({ id: req.body.username })
                .then((data) => {
                    if (data.length === 0) return res.status(401);
                    updateRefreshToken({ username: data[0].username, id: data[0]._id }, null);
                    res.sendStatus(204);
                })
                .catch((error) => {
                    console.log(error);
                    return res.status(403);
                });
        })
    }
}