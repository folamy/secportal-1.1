const Promise = require('bluebird')
const mongoose = require('mongoose')
const fs = require('fs')
const models = require('../models/schemas')(mongoose)
const csv = require('csv-streamify')
const Json2csvParser = require('json2csv').Parser

module.exports = {
  async batchUpload(req, res) {
    try {
      // console.log(req.files);
      const existResult = []
      const allStudID = []
      let allStudRegsubs = null
      const csvfile = req.files.csvTest
      const path = 'static/uploads/teachers/results/test/' + csvfile.name

      // ensure file is available for processing
      // if (!csvfile) return res.
      // move csvfile to the stated path
      await csvfile.mv(path)
        .then(success => { })
        .catch(error => {
          return res.status(500).send({
            error: 'Result file was not uploaded'
          })
        })
      //get all existing result
      await models.testResult.find({})
        .then(allresults => {
          allresults.forEach(item => {
            existResult.push(item)
          })
        })
      // get current term // i dont really need this for now
      await models.allterm.find({})
        .then(terms => {
          terms.forEach(item => {
            if (item.current) req.session.term = item.term
          })
        })

      await models.student.find({})
        .then(students => {
          students.forEach(stud => {
            allStudID.push(stud.studId)
          })
        })

      await models.regsub.find({})
        .then(regsub => {
          allStudRegsubs = regsub
        })

      let counter = 0
      const treated = []
      let vArr = null
      // console.log(allStudRegsubs);
      const parser = csv({ objectMode: true, columns: true }, function (err, result) {
        if (err) return res.send(err)
        vArr = result
        result.forEach(result => {

          const makeResult = {
            name: result.subject,
            score: result.score
          }

          const studId = result.studId
          const Rclass = result.class
          const term = result.term
          const ca = result.CAtype
          const type = result.type

          counter++

          if (existResult.length) {
            existResult.forEach(existing => {
              allStudRegsubs.forEach(regsub => {
                let subs = regsub.subjects.some((val, i) => {
                  if (regsub.studId === studId && val.name === result.subject) return true;
                  return false;
                });

                const newResult = existing.subjects.filter(e => e.name !== result.subject);

                if (studId === existing.studId &&
                  Rclass === existing.class &&
                  studId === regsub.studId &&
                  ca === existing.ca &&
                  type === 'test' &&
                  existing.term === term && subs
                ) {

                  treated.push(studId)

                  newResult.push(makeResult);
                  models.testResult.findOneAndUpdate({
                    studId: studId,
                    class: Rclass,
                    term: term,
                    ca : ca
                  }, { subjects: newResult })
                  .then(success => {
                    // console.log(success);
                  }).catch(err => {
                    // console.log(err);
                  })

                }
              })
            })
          } else if (result.type === 'test'){
            const newResult = []
            newResult.push(makeResult);
            models.testResult.findOneAndUpdate({
              studId: studId,
              class: Rclass,
              term: term,
              ca: ca
            }, { subjects: newResult }, { upsert: true }
            )
            .then(success => {
              // console.log(success);
            }).catch(err => {
              // console.log(err);
            })
          }
        })

        if (counter === vArr.length) {
          vArr.forEach(result => {
            const makeResult = {
              name: result.subject,
              score: result.score
            }

            const newResult = []
            const studId = result.studId
            const Rclass = result.class
            const term = result.term
            const ca = result.CAtype
            const type = result.type

            allStudRegsubs.forEach(regsub => {
              let subs = regsub.subjects.some((val, i) => {
                if (regsub.studId === studId && val.name === result.subject) return true;
                return false;
              })
              if (treated.indexOf(result.studId) === -1 &&
               subs && type === "test") {
                newResult.push(makeResult);
                models.testResult
                  .findOneAndUpdate({ studId: studId, class: Rclass, term: term, ca: ca }, { subjects: newResult }, { upsert: true })
                  .then(success => {
                    // console.log(success);
                  })
                  .catch(err => {
                    // console.log(err);
                  });
              }
            })
          })
        }
        return res.send('Upload was successful')
      })
      fs.createReadStream(path).pipe(parser)
    } catch (e) {
      return res.status(500).send({
        error: 'There was an error trying to upload result file'
      })
    }
  },

  async singleTest (req, res) {
    const studId = req.body.studId
    const subject = req.body.sub
    const term = req.body.term
    const score = req.body.score
    const sclass = req.body.sclass
    const CAtype = req.body.ca

    const existResult = []

    await models.testResult.find({})
    .then(allresults => {
      allresults.forEach(item => {
        existResult.push(item)
      })
    })

    const resultData = {
      name: subject,
      score: score
    }
    let counter = 0
    let uploaded = false

    if (existResult.length) {
      existResult.forEach(result => {

        counter++

        let subs = result.subjects.some((val, i) => {
          if (val.name === subject) return true
        })

        if (result.studId === studId && result.term === term &&
          result.class === sclass && result.ca === CAtype) {
          uploaded = true
          const newResult = result.subjects.filter(e => e.name !== subject)
          newResult.push(resultData)
          models.testResult.findOneAndUpdate(
            {
              studId: studId,
              term: term,
              class: sclass,
              ca: CAtype
            }, {subjects: newResult},
          )
          .then(success => {
            console.log(success);
          })
          .catch(error => {
            console.log(error);
          })
          // console.log(newResult);
          return true
        } 
      })

      if (counter === existResult.length && !uploaded) {
        const newResult = []
        newResult.push(resultData)
        models.testResult.findOneAndUpdate(
          {
            studId: studId,
            term: term,
            class: sclass,
            ca: CAtype
          }, { subjects: newResult }, { upsert: true}
        )
          .then(success => {
            console.log('new result uploaded');
          })
          .catch(error => {
            console.log(error);
          })
      }
      return res.send('Result uploaded successfully')

    } else {
      const newResult = []
      newResult.push(resultData)
      const savedata = new models.testResult({
        class: sclass,
        term: term,
        ca: CAtype,
        studId: studId,
        subjects: newResult
      });
      savedata.save()
      return res.send('Result uploaded successfully')
    }
  }
}
