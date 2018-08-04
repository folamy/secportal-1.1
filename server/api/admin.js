const formFiller = require('../controller/formFiller')
const aController = require('../controller/adminController')
const checkToken = require('../authenticationPolicy/policies')

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
	router.post('/set-term',
		checkToken.validateA,
		aController.setTerm
	)

	router.get('/user-info/:id',
		checkToken.validateA,
		aController.usersInfo
	)
	router.post('/a-logout',
		aController.logout
	)
}