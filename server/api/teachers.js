const formFiller = require('../controller/formFiller')
const tController = require('../controller/teachers')
const rController = require('../controller/resultupload')
const testController = require('../controller/testResult')
const checkToken = require('../authenticationPolicy/policies')

module.exports = (router) => {
  router.post('/t-register',
    tController.register
  )


  router.post('/t-login',
    tController.login
  )
  router.get('/tuser',
    // checkToken.validateT,
    tController.user
  )

  router.put('/t-upload-passport',
    checkToken.validateT,
    tController.passPortUpload
  )

  router.post('/t-changepassword/:id',
    checkToken.validateT,
    tController.changePassword
  )

  router.put('/t-change-passport/:id',
    checkToken.validateT,
    tController.changePassport
  )

  router.post('/t-addsubs/:id',
    checkToken.validateT,
    tController.addsubs
  )

  router.get('/teacher-subjects/',
    checkToken.validateT,
    tController.teacherSubs
  )

  router.get('/my-subs/:id',
    checkToken.validateT,
    tController.mysubs
  )

  router.delete('/deletesubs/:id',
    checkToken.validateT,
    tController.deletesub
  )

  router.post('/result-batch-upload/',
    checkToken.validateT,
    rController.batchUpload
  )
  router.post('/test-batch-upload/',
    checkToken.validateT,
    testController.batchUpload
  )

  router.post('/downloadResultFormat/',
    checkToken.validateT,
    rController.format
  )

  router.post('/single-result/',
    checkToken.validateT,
    rController.singleUpload
  )

  router.post("/single-test-result/", 
    checkToken.validateT, 
    testController.singleTest
  )

  router.get('/oneteacher/:id',
    checkToken.validateT,
    tController.oneTeacher
  )

  router.get('/student-subs',
    checkToken.validateT,
    tController.studentSubs
  )
  router.get('/all-terms',
    checkToken.validateT,
    tController.getAllTerms
  )

  router.post('/t-logout',
    tController.logout
  )
}
