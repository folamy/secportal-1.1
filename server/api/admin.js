const formFiller = require('../controller/formFiller')
const aController = require('../controller/adminController')
const checkToken = require('../authenticationPolicy/policies')
const sController = require('../controller/students')
const tController = require('../controller/teachers')
const rController = require('../controller/resultupload')
const testController = require('../controller/testResult')

module.exports = (router) => {
	router.post('/a-login',
		aController.login
	)

	router.get('/allusers',
		checkToken.validateA,
		aController.allusers
	)
	router.post('/delete-subject/:id',
		checkToken.validateA,
		aController.deleteSubject
	)
	router.post('/save-subject/',
		checkToken.validateA,
		aController.saveSubject
	)
	router.get('/delete-users/:id',
		checkToken.validateA,
		aController.deleteUsers
	)
	router.post('/delete-user-subs',
		checkToken.validateA,
		aController.deleteUserSubs
	)
	router.post('/add-admin-user',
		checkToken.validateA,
		aController.addUser
	)
	router.get('/a-student-subs',
		checkToken.validateA,
		tController.studentSubs
	)
	router.post('/set-term',
		checkToken.validateA,
		aController.setTerm
	)

	router.get('/user-info/:id',
		checkToken.validateA,
		aController.usersInfo
	)

	router.get('/a-single-result',
		checkToken.validateA,
		rController.singleUpload
	)

	router.get('/a-single-test-result',
		checkToken.validateA,
		testController.singleTest
	)

	router.post('/save-edit',
		checkToken.validateA,
		aController.saveEdit
	)

	router.post('/reset-student-password/:id',
		checkToken.validateA,
		sController.getPassword
	)
	router.get('/get-student-subs/:studId/:class',
		checkToken.validateA,
		sController.getRegSubs
	)
	router.get('/get-teacher-subs/:id/',
		checkToken.validateA,
		tController.mysubs
	)
	router.post('/reset-teacher-password/:id',
		checkToken.validateA,
		tController.changePassword
	)

	router.post('/a-logout',
		aController.logout
	)
}