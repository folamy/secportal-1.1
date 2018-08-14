const formFiller = require('../controller/formFiller')
const aController = require('../controller/adminController')
const checkToken = require('../authenticationPolicy/policies')
const sController = require('../controller/students')
const tController = require('../controller/teachers')

module.exports = (router) => {
	router.post('/a-login',
		aController.login
	)

	router.get('/allusers',
		checkToken.validateA,
		aController.allusers
	)
	router.get('/delete-users/:id',
		checkToken.validateA,
		aController.deleteUsers
	)
	router.post('/delete-user-subs',
		checkToken.validateA,
		aController.delSubs
	)
	router.post('/add-admin-user',
		checkToken.validateA,
		aController.addUser
	)
	router.post('/set-term',
		checkToken.validateA,
		aController.setTerm
	)

	router.get('/user-info/:id',
		checkToken.validateA,
		aController.usersInfo
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