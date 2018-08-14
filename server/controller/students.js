const Promise = require('bluebird')
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'))
const mongoose = require('mongoose')
const config = require('../config/config')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const mime = require('mime')
const fs = require('fs')
const sharp = require('sharp')
const models = require('../models/schemas')(mongoose)
const paystack = require('paystack-api')('sk_test_d3648e16bcf3b0d86f1b57431db6e8b92a8ea9f8');

function jwtSignUser (user) {
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

  async getTerm (req, res) {
    try {
      await models.allterm.find()
        .then((doc) => {
          req.session.allterms = doc
          return res.send(req.session.allterms);
        })
    } catch (err) {
      return res.send(err)
    }
  },

  async login (req, res) {
    try {
      const id = req.body.studId.toUpperCase()
      const bodyPassword = req.body.password.toUpperCase()
      const password = (id === bodyPassword) ? bodyPassword.toLowerCase() : req.body.password
      await models.student.findOne({studId: id},function(err, student) {
        if (err) res.send(err)
        if (!student) {
          return res.status(404).send({
            error: 'Student ID: This student ID was not found'
          })
        } else {
          if (!bcrypt.compareSync(password, student.password)) {
            return res.status(401).send({
              error: 'Password: Incorrect password! You can contact <b>Admin</b> to reset your password'
            })
          }
          const studentJson = student.toJSON()
          const key = jwtSignUser(studentJson)

          req.session.student = studentJson
          req.session.Stoken = key
          res.send({
            user: studentJson,
            Stoken: key
          })
        }
      })
    } catch (err) {
      res.send({
        error: 'An error has occured trying to log in'
      })
    }
  },

  logout (req, res) {
    delete req.session.student
    res.json({ ok: true })
  },

  async checkExist (req, res) {
    try {
      const data = req.body
      await models.student.find({
        lastname: data.lastname,
        firstname: data.firstname,
        dob: data.dob,
        email: data.email,
        stateOrigin: data.stateOrigin
      }).then((doc) => {
        if(doc.length) {
          return res.status(403).send({
            error: 'Your record was found! contact the <b>Admin</b> for your login details'
          })
        } else {
          res.send('null')
        }
      })
    } catch (err) {
        res.status(500).send({
          error: 'An error has occured trying to log in'
        })
    }
  },

  async getPassword (req, res) {
    try {
      // console.log(req.body);
      const id = req.params.id.toUpperCase()
      const newpass = bcrypt.hashSync(req.body.newPass, bcrypt.genSaltSync(10))
      
      await models.student.findOneAndUpdate({studId: id}, {password: newpass}, function (err, doc) {
        if (err) res.send(err)
        res.send(doc);
      })
    } catch (e) {
      res.send(e)
    }
  },

  async register (req, res) {
    try {

      const data = req.body
      // console.log(data);
      await models.student.find({
        lastname: data.lastname,
        firstname: data.firstname,
        dob: data.dob,
        email: data.email,
        stateOrigin: data.stateOrigin
      }).then((doc) => {
        if(doc.length) {
          return res.status(400).send({
            error: 'Your record was found! contact the <b>Admin</b> for your login details'
          })
        } else {
          req.session.registrationData = req.body
          return res.status(200).send('search was empty so you can continue your registration')
        }
      })

      } catch (err) {
        res.status(500).send({
          error: 'An error has occured trying to log in'
        })
      }
  },

  students (req, res) {
    try {
      models.student.find({})
        .then((doc) => {
            res.send(doc);
        })
      } catch (err) {
        res.status(500).send({
          error: 'An error has occured trying to log in'
        })
      }
  },
  getResult (req, res) {
    try {
      // console.log(req.body);
      
      models.studResult
        .find({
          studId: req.body.studId,
          class: req.body.class,
          term: req.body.term
        })
        .then(doc => {
          res.send(doc);
        });
      } catch (err) {
        res.status(500).send({
          error: 'An error has occured'
        })
      }
  },

  getTest (req, res) {
    try {
      // console.log(req.body);
      
      models.testResult
        .find({
          studId: req.body.studId,
          class: req.body.class,
          term: req.body.term
        })
        .then(doc => {
          res.send(doc);
        });
      } catch (err) {
        res.status(500).send({
          error: 'An error has occured'
        })
      }
  },

  async newIntakePayment (req, res, next) {
    try {
      await models.student.findByIdAndUpdate(req.params.id,
         { $set: { newIntake: false, returning: true, sch_fees: true } },
         { new: true }, function(err, student) {
        if (err) res.send(err)
        req.session.student = student

          let pay ={
            studId: student.studId,
            class: student.classLevel,
            term: req.session.term,
            reference: req.body.reference,
            purpose: req.body.purpose
          }
          models.payment.create(pay)
          .then((doc) => {
            // console.log(doc);
          })
        res.send(student);

      })
      } catch (err) {
        res.status(500).send({
          error: 'An error has occured trying to log in'
        })
      }
  },
  async otherPayments (req, res, next) {
    try {
      const student = req.session.student
      let pay ={
        studId: student.studId,
        class: student.classLevel,
        term: req.session.term,
        reference: req.body.reference,
        purpose: req.body.purpose
      }
      models.payment.create(pay)
      .then((doc) => {
        return res.send(doc)
      })

      } catch (err) {
        res.status(500).send({
          error: 'An error has occured trying to log in'
        })
      }
  },
  async returningPayment (req, res, next) {
    try {
      await models.student.findByIdAndUpdate(req.params.id,
         { $set: { sch_fees: true } },
         { new: true }, function(err, student) {
        if (err) res.send(err)
        req.session.student = student

          let pay ={
            studId: student.studId,
            class: student.classLevel,
            term: req.session.term,
            reference: req.body.reference,
            purpose: req.body.purpose
          }
          models.payment.create(pay)
          .then((doc) => {
            // console.log(doc);
          })
          res.send(student);
      })
      } catch (err) {
        res.status(500).send({
          error: 'An error has occured trying to log in'
        })
      }
  },

  async getPayments(req, res) {
    try {
      await models.payment.find({studId: req.params.id}, function(err, payment) {
        if(err) console.log(err);
        res.send(payment)
      })
    } catch (e) {
      console.log(e);
    }
  },

  async passPortUpload (req, res) {
    try {
      const studId = req.session.registrationData.studId
      const uploadfile = req.files.file
      const filename = makeHashFileName(uploadfile, studId)
      const tosave = new models.student(req.session.registrationData)
      tosave.passport = filename
      // console.log(tosave);

      await tosave.save(function(err, student) {
        if (err) res.send(err)
        const studentJson = student.toJSON()
        res.send({
          user: studentJson,
          Stoken: jwtSignUser(studentJson)
        })
      })

      await uploadfile.mv('static/uploads/students/originals/' + filename, function(err) {
      if (err)  console.log(err);
        sharp('static/uploads/students/originals/' + filename)
        .resize(200, 200)
        .sharpen()
        .toFile('static/uploads/students/finals/' + filename, function(err, info){
            if (err)  console.log(err);
            const toBeDeleted = 'static/uploads/students/originals/' + filename
            fs.unlinkSync(toBeDeleted);
        })
        return
      })
    } catch (err) {
      return res.status(500).send({
        error: 'An error has occured trying to upload passport'
      })
    }
  },

  async changePassport (req, res) {
    try {
      let oldStudData = req.session.student
      let uploadfile = req.files.file
      // let studId = req.params.studId.toUpperCase()
      let filename = makeHashFileName(uploadfile, oldStudData.studId)
      let oldPassport = 'static/uploads/students/finals/' + oldStudData.passport
      let toBeDeleted = 'static/uploads/students/originals/' + filename
      await uploadfile.mv('static/uploads/students/originals/' + filename, function(err) {
        if (err)  console.log(err);
          sharp('static/uploads/students/originals/' + filename)
          .resize(200, 200)
          .sharpen()
          .toFile('static/uploads/students/finals/' + filename, function(err, info){
              if (err)  console.log(err);
              fs.unlinkSync(toBeDeleted);
              fs.unlinkSync(oldPassport);
          })
        })

      await models.student.findById(req.session.student._id, function(err, stud) {
        if (err) console.log(err)
        stud.set({passport: filename})
        stud.save(function(err, student) {
          if (err) console.log()
          req.session.student = student
          res.send(student)
        })
      })

    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to upload passport'
      })
    }
  },


  purchaseItems(req, res) {
    try {
      models.purchaseItems.find({})
      .then((docs) => {
        res.send(docs)
      })
    } catch (e) {
      console.log(e);
    }
  },

  postRegSubs (req, res) {
    try {
      const data = req.body
      models.regsub.update({studId: data.studId, class: data.class},
        {subjects: data.subjects},
        {upsert:true})
      .then((doc) => {
        return res.send(doc);
      })
      .catch((err) => {
        if (err) res.send(err);
      })
    } catch (e) {
      if (e) return res.send(e)
    }
  },

  getRegSubs (req, res) {
    try {
      models.regsub.findOne({ studId: req.params.studId, class: req.params.class})
      .then ((doc) => {
        if (doc) {
          return res.send(doc)
        } else {
          return res.send(null)
        }
      })
    } catch (e) {
      if (e) return res.send(e)
    }
  },
}
