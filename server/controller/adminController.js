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

  async saveEdit(req, res) {
    try {
      let dbData = null
      let bodyData = req.body
      Promise.props({
        student: models.student.findOne({ studId: req.body.studId }).execAsync(),
        teacher: models.teacher.findOne({ teacherID: req.body.teacherID }).execAsync(),
      })
      .then(users => {
        users.student ? dbData = users.student : dbData = users.teacher
        if (dbData.studId) {
          models.student.findOneAndUpdate({ studId: bodyData.studId }, bodyData, { overwrite: true })
          .then(updated => {
            console.log(updated);
            return res.send('user updated successfully')
          })
          
        } else if (dbData.teacherID){
          models.teacher.findOneAndUpdate({ teacherID: bodyData.teacherID }, bodyData, { overwrite: true })
          .then (updated => {
            console.log(updated);
            return res.send('user updated successfully')
          })
        }
      })
    } catch (error) {
      console.log(error);
      return res.send(error)
    }
  },

  async addUser(req, res) {
    try {
      // console.log(req.body);
      const tosave = new models.adminUser(req.body)
      await tosave.save(function (err, user) {
        if (err) res.send(err)
        res.send({
          success: "User Added Successfully"
        })
      })
    } catch (err) {
      console.log(err)
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
			return res.send({
        success: "User has been deleted"
      });
    } catch (err) {
      console.log(err)
    }
  },

  deleteSubject(req, res) {
    try {
      if (!req.session.admin) return res.status(401).send('Unauthorized Access')
      models.JSsubjects.findByIdAndRemove(req.params.id).exec()
      models.SSsubjects.findByIdAndRemove(req.params.id).exec()
      
      Promise.props({
        ss: models.SSsubjects.find({}).execAsync(),
        js: models.JSsubjects.find({}).execAsync()
      })
      .then(subs => {
        return res.send({
          success: "Subject deleted",
          subs: subs
        });
      })
    } catch (err) {
      console.log(err)
    }
  },

  async saveSubject(req, res) {
    try {
      let tosave = null
      if (req.body.school === 'SS') {
        tosave = new models.SSsubjects(req.body)
        await tosave.save(function (err, sub) {
          if (err && err.code === 11000) return res.status(403).send(`whoops! ${req.body.name} already exist!!`)
          res.send(`${req.body.name} Added Successfully`)
          console.log(sub)
          // console.log(err)
        })
      } else {
        tosave = new models.JSsubjects(req.body)
        await tosave.save(function (err, sub) {
          if (err && err.code === 11000) return res.status(403).send(`whoops! ${req.body.name} already exist!!`)
          res.send(`${req.body.name} Added Successfully`)
          console.log(sub)
          // console.log(err)
        })
      }
    } catch (err) {
      console.log(err)
    }
  },

  deleteUserSubs(req, res) {
    try {
      const userID = req.body.userID
      const level = req.body.level
      const tlevel = req.body.tclass
      const tsub = req.body.tsub
      const subjects = req.body.subjects

      if (!req.session.admin) return res.status(401).send('Unauthorized Access')
      Promise.props({
        studSubs: models.regsub.findOne({ studId: userID, class: level }).execAsync(),
        tsubs: models.teacherSub.findOne({ teacherID: userID }).execAsync(),
      })
      .then(subs => {
        if (subs.studSubs) {
          models.regsub.findOne({ studId: userID, class: level }, (err, doc) => {
            if (err) console.log(err)
            
            doc.set({ subjects: subjects })
            doc.save(function (err, updated) {
              if (err) console.log(err);
              // console.log(updated);
              return res.send(updated.subjects)
            })
          })
        } else if (subs.tsubs) {
          console.log(req.body);
          models.teacherSub.remove({ teacherID: userID, class: tlevel, name: tsub })
          .then(() => {
            models.teacherSub.find({ teacherID: userID })
            .then((docs) => {
             return res.send(docs)
            })
            .catch((err) => {
              console.log(err);
            })
          })
        }
      })
    } catch (err) {
      console.log(err)
    }
  },

  logout(req, res) {
    delete req.session.admin;
    res.json({ ok: true });
  }
};