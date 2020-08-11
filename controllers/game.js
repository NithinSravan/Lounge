const scoreCard = require("../models/scoreCard");
const Game = require("../models/game");
const unzipper = require("unzipper");
const fs = require("fs");
exports.addGame = async (req, res) => {
  try {
    const filename = req.file.filename;
    const ogfilename = req.file.originalname;
    const gamename = req.body.gamename;
    fs.createReadStream(`backend/allgameszip/${filename}`).pipe(
      unzipper.Extract({ path: "backend/allgames" })
    );
    const url =
      req.protocol + "://" + req.get("host") + "/" + ogfilename + "/index.html";
    const game = new Game({
      url: url,
      gamename: gamename,
    });
    await game.save();
    res.status(200).json(game);
  } catch (e) {
    res.status(500).send(e);
  }
};
exports.games = async (req, res) => {
  try {
    const games = await Game.find();
    res.status(200).json({ games });
  } catch (e) {
    res.status(400).send(e);
  }
};
exports.gameScore = async (req, res) => {
  try {
    const game = await Game.findOne({ gamename: req.params.gamename });
    const scores = await scoreCard
      .find({ gameId: game._id })
      .sort({ best: -1 });
    res.status(200).json({ scores });
  } catch (e) {
    res.status(400).send(e);
  }
};
exports.updateScore = async (req, res) => {
  try {
    const game = await Game.findOne({ gamename: req.body.gamename });
    let score = await scoreCard.findOne({
      player: req.userData.userId,
      gameId: game._id,
    });
    // console.log(score)
    if (!score) {
      score = new scoreCard({
        gameId: game._id,
        best: req.body.score,
        player: req.userData.userId,
        playername: req.userData.username,
      });
      // console.log(game)
      await score.save();
    } else if (score.best < req.body.score) {
      score.best = req.body.score;
      await score.save();
    }
    const scorecard = {
      id: score._id,
      gameId: score.gameId,
      best: score.best,
      player: score.player,
      playername: score.playername,
    };
    res.status(201).json({ message: "Score added!", scorecard });
  } catch (e) {
    res.status(400).send(e);
  }
};
