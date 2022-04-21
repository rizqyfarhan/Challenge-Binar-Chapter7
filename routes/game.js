const express = require("express");
const router = express.Router();
const { Game } = require("../models");

router.get('/games', async (_, res) => {
    res.status(200).json(await Game.findAll());
});

router.post('/game', async (req, res) => {
    try {
        const game = await Game.create({
            username: req.body.user_name,
            password: req.body.pass
        });

        res.status(201).json(game);
    } catch (err) {
        res.send(err);
    }
});

router.put('/game/:id', async (req, res) => {
    try {
        const game = await Game.update({
            username: req.body.user_name,
            password: req.body.pass
        }, {
            where: {
                id: req.params.id
            }
        });

        res.status(201).json(game);
    } catch (err) {
        res.send(err);
    }
});

router.delete("/game", async (req, res) => {
    try {
        const game = await Game.destroy({
            where: {
                id: req.body.id
            }
        });

        res.status(204).json(game);
    } catch (err) {
        res.send(err);
    }
});

module.exports = router;