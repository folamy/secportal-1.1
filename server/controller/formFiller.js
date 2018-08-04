const Promise = require('bluebird')
const bcrypt = Promise.promisifyAll(require('bcrypt-nodejs'))
const mongoose = require('mongoose')
const models = require('../models/schemas')(mongoose)

module.exports = {

  async getState(req, res) {
    try {
      await models.state.find({})
        .then((doc) => {
          res.send(doc);
        })
      } catch (err) {
        res.status(500).send({
          error: 'An error has occured trying to log in'
        })
      }
  },
  async SSsubject(req, res) {
    try {
      await models.SSsubjects.find({})
        .then((doc) => {
          res.send(doc);
        })
      } catch (err) {
        res.status(500).send({
          error: 'An error has occured trying to log in'
        })
      }
  },
  async JSsubject(req, res) {
    try {
      await models.JSsubjects.find({})
        .then((doc) => {
          res.send(doc);
        })
      } catch (err) {
        res.status(500).send({
          error: 'An error has occured trying to log in'
        })
      }
  },

  async getOneState(req, res) {
    try {
      await models.state.findOne({stateID: req.params.stateID})
        .then((doc) => {
          res.send(doc);
        })
      } catch (err) {
        res.status(500).send({
          error: 'An error has occured trying to log in'
        })
      }
  },

  async getLga(req, res) {
    try {
      await models.localGov.find({stateID: parseInt(req.params.stateID)})
        .then((doc) => {
          res.send(doc);
        })
      } catch (err) {
        res.status(500).send({
          error: 'An error has occured trying to log in'
        })
      }
  },
  async allClass(req, res) {
    try {
      await models.allClasses.find({})
        .then((doc) => {
          res.send(doc);
        })
      } catch (err) {
        res.status(500).send({
          error: 'An error has occured trying to log in'
        })
      }
  },
  async studentClass(req, res) {
    try {
      await models.allClasses.findOne({classId: parseInt(req.params.classId)})
        .then((doc) => {
          res.send(doc);
        })
      } catch (err) {
        res.status(500).send({
          error: 'An error has occured trying to log in'
        })
      }
  },
  async SSClass(req, res) {
    try {
      await models.ssClasses.find({})
        .then((doc) => {
          res.send(doc);
        })
      } catch (err) {
        res.status(500).send({
          error: 'An error has occured trying to log in'
        })
      }
  },

}
