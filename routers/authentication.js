require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");
// const verifyToken = require("./middleware/auth");
const Auth = require("../models/Auth");

const app = express();

app.use(express.json());

// app
const generateTokens = (payload) => {
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
};

const updateRefreshToken = (username, refreshToken) => {
    users = users.map((user) => {
        if (user.username === username)
            return {
                ...user,
                refreshToken,
            };

        return user;
    });
};

app.post("/login", (req, res) => {
    Auth.find({ username: req.body.username, password: req.body.password })
        .then((data) => {
            if (data.length === 0) res.status(401);
            else {
                const tokens = generateTokens({
                    username: data.username,
                    id: data._id,
                });
                updateRefreshToken(
                    { username: data.username, id: data._id },
                    tokens.refreshToken
                );
                res.json(tokens);
            }
        })
        .catch((error) => {
            res.status(403);
            console.log(error);
        });
});

// app.post("/token", (req, res) => {
//     const refreshToken = req.body.refreshToken;
//     if (!refreshToken) return res.sendStatus(401);

//     const user = users.find((user) => user.refreshToken === refreshToken);
//     if (!user) return res.sendStatus(403);

//     try {
//         jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

//         const tokens = generateTokens(user);
//         updateRefreshToken(user.username, tokens.refreshToken);

//         res.json(tokens);
//     } catch (error) {
//         console.log(error);
//         res.sendStatus(403);
//     }
// });

// app.delete("/logout", verifyToken, (req, res) => {
//   const user = users.find((user) => user.id === req.id);
//   updateRefreshToken(user.username, null);

//   res.sendStatus(204);
// });


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));