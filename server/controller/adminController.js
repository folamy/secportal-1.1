const Promise = require("bluebird");
const bcrypt = Promise.promisifyAll(require("bcrypt-nodejs"));
const mongoose = require("mongoose");
const config = require("../config/config");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const mime = require("mime");
const fs = require("fs");
const sharp = require("sharp");
const models = require("../models/schemas")(mongoose);
Promise.promisifyAll(mongoose)
mongoose.Promise = global.Promise
function jwtSignUser(user) {
    // const ONE_WEEK = 60 * 60 * 24 * 7
    return jwt.sign(user, config.authentication.jwtSecret, {
        expiresIn: '1d'
    })
}
function makeHashFileName(original, id) {
    const hash = crypto.createHmac('sha256', 'andsdff')
        .update(original.name)
        .digest('hex') + '_' + id + '.' + mime.getExtension(original.mimetype);
    return hash
}

module.exports = {
  async login(req, res) {
    try {
      await models.adminUser.findOne(
        { aid: req.body.aid.toUpperCase() },
        function(err, admin) {
          if (err) res.send(err);
          if (!admin) {
            return res.status(404).send({
              error: "User ID: This user ID was not found"
            });
          } else {
            if (
              !bcrypt.compareSync(
                req.body.password.toLowerCase(),
                admin.password
              )
            ) {
              return res.status(401).send({
                error: "Password: Incorrect password!"
              });
            }
            const userJson = admin.toJSON();
            const key = jwtSignUser(userJson);

            req.session.admin = userJson;
            req.session.Atoken = key;
            res.send({
              user: userJson,
              Atoken: key
            });
          }
        }
      );
    } catch (err) {
      res.send({
        error: "An error has occured trying to log in"
      });
    }
  },

  async allusers(req, res) {
    Promise.props({
      students: models.student.find({}).execAsync(),
      teachers: models.teacher.find({}).execAsync(),
      admins: models.adminUser.find({ superUser: false }).execAsync()
    })
      .then(users => {
        res.send(users);
      })
      .catch(err => {
        console.log(err);
      });
  },

  async usersInfo(req, res) {
    Promise.props({
      students: models.student.findOne({ studId: req.params.id }).execAsync(),
      teachers: models.teacher
        .findOne({ teacherID: req.params.id })
        .execAsync(),
      admins: models.adminUser.findOne({ aid: req.params.id }).execAsync()
    })
      .then(users => {
        res.send(users);
      })
      .catch(err => {
        console.log(err);
      });
  },
  async setTerm(req, res) {
    try {
      //reset old term to false
      models.allterm.findOne({ current: true }, function(err, doc) {
        if (err) return err;

        doc.set({
          current: false,
          ends: null
        });

        doc.save(function(err, term) {
          if (err) return err;
          //set new term
          models.allterm.findOne({ term: req.body.term }, (err, term) => {
            if (err) return err;
            term.set({
              current: true,
              ends: req.body.date
            });
            term.save(function(err, term) {
              if (err) return err;
              return res.send(term);
            });
          });
        });
      });
    } catch (err) {
      console.log(err);
    }
  },

  deleteUsers(req, res) {
    try {
      if (!req.session.admin && !req.session.admin.superUser) return res.status(401).send('Unauthorized Access')
			models.adminUser.remove({ aid: req.params.id }).exec();
			models.student.remove({ studId: req.params.id }).exec()
			models.studResult.remove({ studId: req.params.id }).exec();
			models.regsub.remove({ studId: req.params.id }).exec()
			models.teacherSub.remove({ teacherID: req.params.id }).exec();
			models.teacher.remove({ teacherID: req.params.id }).exec();
			return res.send("User has been deleted");
    } catch (err) {
      console.log(err)
    }
  },

  logout(req, res) {
    delete req.session.admin;
    res.json({ ok: true });
  }
};