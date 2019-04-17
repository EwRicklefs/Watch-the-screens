var db = require("../models");

module.exports = function(app) {
  //
  //
  // Overview view routes

  // Returns games table relevant information
  app.get("/:gameid/overviewGame", function(req, res) {
    db.game
      .findAll({
        attributes: ["terror", "rioters", "current_round"]
      })
      .then(function(overviewData) {
        res.json(overviewData);
      });
  });

  app.get("/:gameid/newOverviewArticle", function(req, res) {
    db.article
      .findAll({
        limit: 1,
        where: {
          gameId: req.params.gameid
        },
        order: [["createdAt", "DESC"]],
        include: [db.network]
      })
      .then(function(articleResult) {
        res.json(articleResult);
      });
  });

  //
  //
  // Reporter view routes

  app.post("/api/addArticle", function(req, res) {
    console.log(req.body);
    db.article.create(req.body).then(function(data) {
      console.log(data);
      res.json(data);
    });
  });

  //
  //
  // Article view routes

  app.get("/:gameid/allArticles", function(req, res) {
    db.game
      .findById(req.params.gameid, {
        include: [
          {
            model: db.article,
            where: {
              is_hidden: false
            },
            include: [db.network]
          }
        ]
      })
      .then(function(articleResult) {
        res.json(articleResult);
      });
  });

  //
  //
  // Admin view routes

  //Used by the admin createGame view
  app.post("/api/createGame", function(req, res) {
    //TODO: Return the gameId and use that to redirect to /<game.id>/admin.
    console.log(req.body);
    db.game.create(req.body).then(function(dbgame) {
      console.log(dbgame.id);
      res.redirect("/1/admin");
    });
  });

  //Used by the admin view. Pauses the timer and sets Time Remaining.
  app.put("/api/pauseTimer", function(req, res) {
    db.game
      .update(
        {
          time_remaining: req.body.time_remaining,
          is_paused: req.body.is_paused
        },
        { where: { id: req.body.id } }
      )
      .then(function(pauseData) {
        res.json(pauseData);
      });
  });

  //Used by the admin view. Ends a game.
  app.put("/api/endGame", function(req, res) {
    db.game
      .update({ is_complete: true }, { where: { id: req.body.id } })
      .then(function(endData) {
        res.json(endData);
      });
    //TODO: Make a put call to the db to switch the is_complete flag to true. Then on success handle end of game
    console.log(req.body);
  });

  //Used by the admin view. Updates the terror level.
  app.put("/api/updateTerror", function(req, res) {
    db.game
      .update({ terror: req.body.terror }, { where: { id: req.body.id } })
      .then(function(dbterror) {
        res.json(dbterror);
      });

    //TODO: if the response is good, send update to overview views with updated terror level.
  });

  // Rioters update put route
  app.put("/api/updateRioters", function(req, res) {
    db.game
      .update({ rioters: req.body.rioters }, { where: { id: req.body.id } })
      .then(function(dbRiot) {
        res.json(dbRiot);
      });

    //TODO: if the response is good, send update to overview views with updated terror level.
  });

  // Article hide put route
  app.put("/api/hideArticle", function(req, res) {
    console.log(req.body);
    db.article
      .update({ is_hidden: req.body.is_hidden }, { where: { id: req.body.id } })
      .then(function(hidden) {
        res.json(hidden);
      });

    //TODO: if the response is good, send update to overview views with updated article array
  });

  //Used by the admin view. Sends a message to all overview screens the pops a modal with a global message for the specified duration.
  app.post("/api/postGlobal", function(req, res) {
    //TODO: push this data to the overview screen (which should trigger the modal to pop).
    console.log(req.body);
    res.json(req.body);
  });

  //Used by the admin view. Updates the time that a round starts out with (should not affect current round).
  app.put("/api/updateDefaultTime", function(req, res) {
    //TODO: make a put call to the db to update the round_duration value in the game table
    console.log(req.body);
  });

  app.put("/api/toggleArticle", function(req, res) {
    //TODO: make a put call to the db to update the is hidden status of the article. Then, on success, update admin and overview views with article data.
    console.log(req.body);
  });
};
