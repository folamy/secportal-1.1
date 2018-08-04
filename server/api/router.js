const formFiller = require('../controller/formFiller')
const sController = require('../controller/students')
const checkToken = require('../authenticationPolicy/policies')

module.exports = (router) => {
  // formFillers
  router.get('/state', formFiller.getState)
  router.get('/state/:stateID', formFiller.getOneState)
  router.get('/lga/:stateID', formFiller.getLga)
  router.get('/allclass', formFiller.allClass)
  router.get('/allclass/:classId', formFiller.studentClass)
  router.get('/ssclass', formFiller.SSClass)
  router.get('/subject1', formFiller.JSsubject)
  router.get('/subject2', formFiller.SSsubject)


  // student APIs
  router.post('/s-login',
    sController.login
  )

  router.post('/s-register',
    sController.register
  )

  router.post('/checkexist',
    sController.checkExist
  )

  router.get('/students',
    // checkToken.validateS,
    sController.students
  )

  router.post('/get-password/:id',
    checkToken.validateS,
    sController.getPassword
  )

  // router.get('/students/:id',
  //   checkToken.validateS,
  //   sController.oneStudent)

  router.post('/other-payments/',
    checkToken.validateS,
    sController.otherPayments
  )

  router.post('/returning-payment/:id',
    checkToken.validateS,
    sController.returningPayment
  )

  router.post('/fresh-payment/:id',
    checkToken.validateS,
    sController.newIntakePayment
  )

  router.get('/get-payments/:id',
    checkToken.validateS,
    sController.getPayments
  )

  router.post('/s-logout',
    sController.logout
  )

  router.put('/upload-passport',
    sController.passPortUpload
  )

  router.put('/change-passport/:studId',
    checkToken.validateS,
    sController.changePassport
  )

  router.get('/purchase-items',
    checkToken.validateS,
    sController.purchaseItems
  )

  router.post('/regsubs',
    checkToken.validateS,
    sController.postRegSubs
  )

  router.get('/getregisteredsubs/:studId/:class',
    checkToken.validateS,
    sController.getRegSubs
  )

  router.get('/get-curent-term',
    // checkToken.validateS,
    sController.getTerm
  )

  router.post('/get-results',
    checkToken.validateS,
    sController.getResult
  )

  router.post('/get-test',
    checkToken.validateS,
    sController.getTest
  )
}
