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
const csv = require('csv-streamify')
// const fs = require('fs')

function jwtSignUser (user) {
    // const ONE_WEEK = 60 * 60 * 24 * 7
  return jwt.sign(user, config.authentication.jwtSecret, {
    expiresIn: '30m'
  })
}
  function makeHashFileName(original, id) {
    const hash = crypto.createHmac('sha256', 'andsdff')
    .update(original.name)
    .digest('hex') +  '_' + id + '.' + mime.getExtension(original.mimetype);
    return hash
  }

module.exports = {
  async login (req, res) {
    try {
      await models.teacher.findOne({teacherID: req.body.teacherID})
      .then((teacher) => {
        if (!teacher) return res.status(404).send({
          error: 'Teacher ID was not found'
        })
        if (!bcrypt.compareSync(req.body.password.toLowerCase(), teacher.password)) {
          return res.status(401).send({
            error: 'Password: Incorrect password! You can contact <b>Admin</b> to reset your password'
          })
        }
        const teacherJson = teacher.toJSON()
        const key = jwtSignUser(teacherJson)

        req.session.teacher = teacher
        req.session.Ttoken = key
        res.send({
          user: teacherJson,
          Ttoken: key
        })
      })
      .catch((err) => {
        res.send('Server Error')
      })
    } catch (err) {
      res.send({
        error: 'An error has occured trying to log in'
      })
    }
  },

  async user (req, res) {
    try {
      if (req.session.teacher && req.session.Ttoken) return res.send({
        teacher: req.session.teacher,
        Ttoken: req.session.Ttoken
      })
      return res.status(404).send({
        error: 'Login required'
      })
    } catch (e) {
      return res.send(e)
    }
  },

  async register (req, res) {
    try {
      const data = req.body
      await models.teacher.find({
        lastname: data.lastname,
        firstname: data.firstname,
        dob: data.dob,
        email: data.email,
        stateOrigin: data.stateOrigin
      })
      .then((doc) => {
        if(doc.length) {
        return res.status(400).send({
            error: 'Your record was found! contact the <b>Admin</b> for your login details'
        })
        } else {
        req.session.teacherReg = req.body
        return res.status(200).send('search was empty so you can continue your registration')
        }
      })

    } catch (err) {
        res.status(500).send({
        error: 'Server Error'
      })
    }
  },

  async passPortUpload (req, res) {
    try {
      const uploadfile = req.files.file
      const studId = req.session.teacherReg.studId
      const filename = makeHashFileName(uploadfile, studId)
      const tosave = new models.teacher(req.session.teacherReg)
      tosave.passport = filename

      await tosave.save(function(err, teacher) {
        if (err) res.send(err)
        const teacherJson = teacher.toJSON()
        res.send({
          teacher: teacherJson,
          Ttoken: jwtSignUser(teacherJson)
        })
      })

      await uploadfile.mv('static/uploads/teachers/originals/' + filename, function(err) {
      if (err)  console.log(err);
        sharp('static/uploads/teachers/originals/' + filename)
        .resize(200, 200)
        .sharpen()
        .toFile('static/uploads/teachers/finals/' + filename, function(err, info){
            if (err)  console.log(err);
            const toBeDeleted = 'static/uploads/teachers/originals/' + filename
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
      // console.log(req.userData);

      let oldStudData = req.session.teacher
      let uploadfile = req.files.file
      // let studId = req.params.studId.toUpperCase()
      let filename = makeHashFileName(uploadfile, oldStudData.teacherID)
      let oldPassport = 'static/uploads/teachers/finals/' + oldStudData.passport
      let toBeDeleted = 'static/uploads/teachers/originals/' + filename
      await uploadfile.mv('static/uploads/teachers/originals/' + filename, function(err) {
        if (err)  console.log(err);
          sharp('static/uploads/teachers/originals/' + filename)
          .resize(200, 200)
          .sharpen()
          .toFile('static/uploads/teachers/finals/' + filename, function(err, info){
            if (err)  console.log(err);
            fs.unlinkSync(toBeDeleted);
            fs.unlinkSync(oldPassport);
          })
        })

      await models.teacher.findById(req.session.teacher._id, function(err, user) {
        if (err) console.log(err)
        user.set({passport: filename})
        user.save(function(err, teacher) {
          if (err) console.log(err)
          req.session.teacher = teacher
          return res.send( teacher )
        })
      })

    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to upload passport'
      })
    }
  },

  async changePassword (req, res) {
    try {
      console.log(req.body);
      const id = req.params.id
      const newpass = bcrypt.hashSync(req.body.newPass.toLowerCase(), bcrypt.genSaltSync(10))
      await models.teacher.findOneAndUpdate({teacherID: id}, {password: newpass}, function (err, doc) {
        if (err) res.send(err)
        res.send(doc);
      })
    } catch (e) {
      res.send(e)
    }
  },



  async addsubs (req, res) {
    try {
      const data = req.body
      const sub = new models.teacherSub(data)
      sub.save(data)
      .then((doc) => {
        if (doc) return res.send(doc)
      })
      .catch((err) => {
        console.log(err);
      })
    } catch (e) {
      res.send(e)
    }
  },

  async teacherSubs (req, res) {
    try {
      await models.teacherSub.find({})
      .then((docs) => {
        res.send(docs)
      })
      .catch((err) => {
        console.log(err);
      })
    } catch (error) {
      res.status(500).send(error)
    }
  },

  async mysubs (req, res) {
    try {
      await models.teacherSub.find({teacherID: req.params.id})
      .then((docs) => {
        res.send(docs)
      })
      .catch((err) => {
        console.log(err);
      })
    } catch (error) {
      res.status(500).send(error)
    }
  },

  async deletesub (req, res) {
    try {
      await models.teacherSub.findByIdAndRemove(req.params.id, function(err, doc) {
        if (err) return res.send(err)
        return res.json(doc)
      })
    } catch (error) {
      res.status(500).send(error)
    }
  },


  async oneTeacher (req,res) {
    try {
      await models.teacher.findOne({teacherID: req.params.id})
      .then((teacher) => {
        return res.send(teacher)
      })
      .catch((err) => {
        return res.send(err)
      })
    } catch (error) {
      return res.status(500).send(error)
    }
  },

  async studentSubs (req,res) {
    try {
      await models.regsub.find()
      .then((teacher) => {
        return res.send(teacher)
      })
      .catch((err) => {
        return res.send(err)
      })
    } catch (error) {
      return res.status(500).send(error)
    }
  },

  async getAllTerms (req,res) {
    try {
      await models.allterm.find()
      .then((terms) => {
        return res.send(terms)
      })
      .catch((err) => {
        return res.send(err)
      })
    } catch (error) {
      return res.status(500).send(error)
    }
  },

  logout (req, res) {
    delete req.session.teacher
    req.session.destroy();
    res.json({ ok: true })
  }
}
