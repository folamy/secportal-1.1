const mongoose = require('mongoose')
const fs = require('fs')
const models = require('../models/schemas')(mongoose)
const csv = require('csv-streamify')
const Json2csvParser = require('json2csv').Parser

module.exports = {
  async batchUpload (req, res) {
    try {
      // console.log(req.files);
      const existResult = []
      const allStudID = []
      let allStudRegsubs = null
      const csvfile = req.files.csvfile
      const path = 'static/uploads/teachers/results/' + csvfile.name

      // ensure file is available for processing
      // move csvfile to the stated path
      await csvfile.mv(path)
      .then(success => {})
      .catch(error => {
        return res.status(500).send({
          error: 'Result file was not uploaded'
        })
      })
      //get all existing result
      await models.studResult.find({})
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
                    existing.term === term && subs
                ) {

                  treated.push(studId)
                  
                  newResult.push(makeResult);
                  models.studResult.findOneAndUpdate({
                    studId: studId,
                    class: Rclass,
                    term: term
                  }, { subjects: newResult})
                  .then(success => {
                    // console.log(success);
                  }).catch(err => {
                    // console.log(err);
                  })

                }
              })
            })
          } else {
            const newResult = []
            newResult.push(makeResult);
            models.studResult.findOneAndUpdate({
              studId: studId,
              class: Rclass,
              term: term
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
            
            allStudRegsubs.forEach(regsub => {
              let subs = regsub.subjects.some((val, i) => {
                if (regsub.studId === studId && val.name === result.subject) return true;
                return false;
              })
              if (treated.indexOf(result.studId) === -1 && subs) {
                newResult.push(makeResult);
                models.studResult.findOneAndUpdate({
                  studId: studId,
                  class: Rclass,
                  term: term
                }, { subjects: newResult }, { upsert: true }
                )
                .then(success => {
                  // console.log(success);
                }).catch(err => {
                  // console.log(err);
                })
              }
            })
          })
        }
        fs.unlinkSync(path)
        return res.send('Upload was successful')
      })
      fs.createReadStream(path).pipe(parser)
    } catch (e) {
      return res.status(500).send({
        error: 'There was an error trying to upload result file'
      })
    }
  },

  async format (req, res) {
    try {
      const classLevel = [
        {name: 'JSS 1', id: 1},
        {name: 'JSS 2', id: 2},
        {name: 'JSS 3', id: 3},
        {name: 'SS 1', id: 4},
        {name: 'SS 2', id: 5},
        {name: 'SS 3', id: 6}
      ]

      function getclass(cls) {
        let cid = null
        classLevel.forEach(s => {
          if (cls === s.name) {
            cid =  s.id
          }
        })
        return cid
      }
      // console.log(req.body);
      const subject = req.body.sub
      const term = req.body.term
      const teacherID = req.body.tid
      const type = req.body.type
      const CAType = req.body.CAType
      const studentIds = []
      const sclass = getclass(req.body.sclass)

      function Student(arr){
        let data = {};
        
        data.lastname = arr.lastname
        data.othername = arr.othername
        data.studId = arr.studId
        data.subject = subject
        data.class = req.body.sclass
        data.term  = term
        if (type === "test") {
          data.CAtype = CAType
        }
        data.type  = type
        data.score = ''
        return data
      }

      const csvfields = ['surname','othername', 'subject', 'studId', 'term', 'class','score']
      const path = 'static/uploads/teachers/results/' + subject + "_" + req.body.sclass + "_" + term + "_term_" + type +".csv"
      const csvData = []

      let allregsub = null
      await models.regsub.find({})
      .then(docs => {
        allregsub = docs
      })

      let allstudents = null
      await models.student.find({})
      .then(stud => {
        allstudents = stud
      })

      let tsubs = null
      await models.teacherSub.find({})
      .then(subs => {
        tsubs = subs
      })

      allregsub.forEach(studSub => {
        let subs = studSub.subjects.some((val, i) => {
          if (val.name === subject) return true;
          return false
        })
        console.log(subs);
        
        if (subs && sclass === studSub.class) {
          studentIds.push(studSub.studId)
        }
      })

      console.log(studentIds)

      allstudents.forEach(student => {
        if (studentIds.indexOf(student.studId) !== -1) {
          csvData.push(Student(student));
        }
      })
      
      const json2csvParser = new Json2csvParser({ csvfields })
      const csvfile = json2csvParser.parse(csvData)
      fs.writeFile(path, csvfile, function(err) {
        if (err) throw err;
        // console.log('file saved');
        res.download(path, (err)=>{
          if (err) {
            console.log("this download",err);
          }
          //delete immediately after downloaad
          fs.unlinkSync(path, (err)=>{
            if (err) {
              console.log("this unlink",err);
            }
          });
        });

      });

    } catch (e) {
      console.error(e)
      res.status(500).send(e)
    }
  },


  async singleUpload (req, res) {
    const studId = req.body.studId
    const subject = req.body.sub
    const term = req.body.term
    const score = req.body.score
    const sclass = req.body.sclass

    const existResult = []

    await models.studResult.find({})
    .then(allresults => {
      allresults.forEach(item => {
        existResult.push(item)
      })
    })

    const resultData = {
      name: subject,
      score: score
    }

    let counter = 0;
    let uploaded = false;

    if (existResult.length) {
      existResult.forEach(result => {
        
        counter++;

        let subs = result.subjects.some((val, i) => {
          if (val.name === subject) return true
        })

        if (result.studId === studId && result.term === term &&
            result.class === sclass) {
          uploaded = true
          const newResult = result.subjects.filter(e => e.name !== subject)
          newResult.push(resultData)
          models.studResult.findOneAndUpdate(
            {
              studId: studId,
              term: term,
              class: sclass
            }, {subjects: newResult},
          )
          .then(success => {
            console.log(success)
          })
          .catch(error => {
            console.log(error);
          })
          // console.log(newResult);
          return true
        } 
          // console.log(result);
      })

      if (counter === existResult.length && !uploaded) {
        const newResult = []
        newResult.push(resultData)
        models.studResult.findOneAndUpdate(
          {
            studId: studId,
            term: term,
            class: sclass
          }, { subjects: newResult }, {upsert: true}
        )
          .then(success => {
            console.log(success)
          })
          .catch(error => {
            console.log(error);
          })
        // console.log(newResult);
        return true
      
      }

      return res.send('Result uploaded successfully')

    } else {
      const newResult = []
      newResult.push(resultData)
      const savedata = new models.studResult({
        class: sclass,
        term: term,
        studId: studId,
        subjects: newResult
      });
      savedata.save()
      return res.send('Result uploaded successfully')
    }
  }
}
