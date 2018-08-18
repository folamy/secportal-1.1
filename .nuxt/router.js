import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const _2f17c616 = () => import('../pages/student/index.vue' /* webpackChunkName: "pages/student/index" */).then(m => m.default || m)
const _84972a06 = () => import('../pages/teacher/index.vue' /* webpackChunkName: "pages/teacher/index" */).then(m => m.default || m)
const _1e389e2a = () => import('../pages/admin/index.vue' /* webpackChunkName: "pages/admin/index" */).then(m => m.default || m)
const _2da9b068 = () => import('../pages/student/registration/index.vue' /* webpackChunkName: "pages/student/registration/index" */).then(m => m.default || m)
const _2a345fdc = () => import('../pages/student/payments/index.vue' /* webpackChunkName: "pages/student/payments/index" */).then(m => m.default || m)
const _5c272da0 = () => import('../pages/student/profile/index.vue' /* webpackChunkName: "pages/student/profile/index" */).then(m => m.default || m)
const _cf9cb54a = () => import('../pages/student/dashboard/index.vue' /* webpackChunkName: "pages/student/dashboard/index" */).then(m => m.default || m)
const _60fc5022 = () => import('../pages/teacher/subjects/index.vue' /* webpackChunkName: "pages/teacher/subjects/index" */).then(m => m.default || m)
const _4b386db6 = () => import('../pages/admin/course/index.vue' /* webpackChunkName: "pages/admin/course/index" */).then(m => m.default || m)
const _61283b80 = () => import('../pages/teacher/students/index.vue' /* webpackChunkName: "pages/teacher/students/index" */).then(m => m.default || m)
const _60474186 = () => import('../pages/student/results/index.vue' /* webpackChunkName: "pages/student/results/index" */).then(m => m.default || m)
const _20d87ae1 = () => import('../pages/teacher/registration/index.vue' /* webpackChunkName: "pages/teacher/registration/index" */).then(m => m.default || m)
const _8ffb1722 = () => import('../pages/admin/dashboard/index.vue' /* webpackChunkName: "pages/admin/dashboard/index" */).then(m => m.default || m)
const _3c2f7107 = () => import('../pages/admin/subject/index.vue' /* webpackChunkName: "pages/admin/subject/index" */).then(m => m.default || m)
const _33e0e8f6 = () => import('../pages/student/subjects/index.vue' /* webpackChunkName: "pages/student/subjects/index" */).then(m => m.default || m)
const _d7e842f4 = () => import('../pages/admin/newuser/index.vue' /* webpackChunkName: "pages/admin/newuser/index" */).then(m => m.default || m)
const _b53591d2 = () => import('../pages/teacher/profile/index.vue' /* webpackChunkName: "pages/teacher/profile/index" */).then(m => m.default || m)
const _e2b56e32 = () => import('../pages/student/dashboard/paystack.vue' /* webpackChunkName: "pages/student/dashboard/paystack" */).then(m => m.default || m)
const _0ce03df6 = () => import('../pages/student/profile/change-password.vue' /* webpackChunkName: "pages/student/profile/change-password" */).then(m => m.default || m)
const _6d52e83a = () => import('../pages/teacher/subjects/subjects.vue' /* webpackChunkName: "pages/teacher/subjects/subjects" */).then(m => m.default || m)
const _57dca498 = () => import('../pages/student/payments/books.vue' /* webpackChunkName: "pages/student/payments/books" */).then(m => m.default || m)
const _67da171d = () => import('../pages/teacher/profile/change-password.vue' /* webpackChunkName: "pages/teacher/profile/change-password" */).then(m => m.default || m)
const _5a4b2ed9 = () => import('../pages/admin/results/single.vue' /* webpackChunkName: "pages/admin/results/single" */).then(m => m.default || m)
const _306fc48e = () => import('../pages/admin/results/batch.vue' /* webpackChunkName: "pages/admin/results/batch" */).then(m => m.default || m)
const _fa7eb45a = () => import('../pages/teacher/registration/passport.vue' /* webpackChunkName: "pages/teacher/registration/passport" */).then(m => m.default || m)
const _3a30fc80 = () => import('../pages/admin/subject/view.vue' /* webpackChunkName: "pages/admin/subject/view" */).then(m => m.default || m)
const _a4ed6a9e = () => import('../pages/student/subjects/view.vue' /* webpackChunkName: "pages/student/subjects/view" */).then(m => m.default || m)
const _2ec3c56e = () => import('../pages/student/payments/others.vue' /* webpackChunkName: "pages/student/payments/others" */).then(m => m.default || m)
const _5845c134 = () => import('../pages/teacher/results/single.vue' /* webpackChunkName: "pages/teacher/results/single" */).then(m => m.default || m)
const _10a4aeec = () => import('../pages/student/registration/passport.vue' /* webpackChunkName: "pages/student/registration/passport" */).then(m => m.default || m)
const _b8b0c014 = () => import('../pages/teacher/registration/confirmation.vue' /* webpackChunkName: "pages/teacher/registration/confirmation" */).then(m => m.default || m)
const _cdc130e8 = () => import('../pages/teacher/results/batch.vue' /* webpackChunkName: "pages/teacher/results/batch" */).then(m => m.default || m)
const _1fbf748f = () => import('../pages/student/registration/confirmation.vue' /* webpackChunkName: "pages/student/registration/confirmation" */).then(m => m.default || m)
const _dcd955d8 = () => import('../pages/teacher/profile/change-passport.vue' /* webpackChunkName: "pages/teacher/profile/change-passport" */).then(m => m.default || m)
const _36997bed = () => import('../pages/student/profile/change-passport.vue' /* webpackChunkName: "pages/student/profile/change-passport" */).then(m => m.default || m)
const _aaef6a88 = () => import('../pages/student/payments/returning.vue' /* webpackChunkName: "pages/student/payments/returning" */).then(m => m.default || m)
const _07ec9cb6 = () => import('../pages/teacher/subjects/students/_id.vue' /* webpackChunkName: "pages/teacher/subjects/students/_id" */).then(m => m.default || m)
const _52dad0dc = () => import('../pages/admin/users/_index.vue' /* webpackChunkName: "pages/admin/users/_index" */).then(m => m.default || m)
const _ae6a3c60 = () => import('../pages/admin/edit/_index.vue' /* webpackChunkName: "pages/admin/edit/_index" */).then(m => m.default || m)
const _43354cea = () => import('../pages/index.vue' /* webpackChunkName: "pages/index" */).then(m => m.default || m)



if (process.client) {
  window.history.scrollRestoration = 'manual'
}
const scrollBehavior = function (to, from, savedPosition) {
  // if the returned position is falsy or an empty object,
  // will retain current scroll position.
  let position = false

  // if no children detected
  if (to.matched.length < 2) {
    // scroll to the top of the page
    position = { x: 0, y: 0 }
  } else if (to.matched.some((r) => r.components.default.options.scrollToTop)) {
    // if one of the children has scrollToTop option set to true
    position = { x: 0, y: 0 }
  }

  // savedPosition is only available for popstate navigations (back button)
  if (savedPosition) {
    position = savedPosition
  }

  return new Promise(resolve => {
    // wait for the out transition to complete (if necessary)
    window.$nuxt.$once('triggerScroll', () => {
      // coords will be used if no selector is provided,
      // or if the selector didn't match any element.
      if (to.hash) {
        let hash = to.hash
        // CSS.escape() is not supported with IE and Edge.
        if (typeof window.CSS !== 'undefined' && typeof window.CSS.escape !== 'undefined') {
          hash = '#' + window.CSS.escape(hash.substr(1))
        }
        try {
          if (document.querySelector(hash)) {
            // scroll to anchor by returning the selector
            position = { selector: hash }
          }
        } catch (e) {
          console.warn('Failed to save scroll position. Please add CSS.escape() polyfill (https://github.com/mathiasbynens/CSS.escape).')
        }
      }
      resolve(position)
    })
  })
}


export function createRouter () {
  return new Router({
    mode: 'history',
    base: '/',
    linkActiveClass: 'nuxt-link-active',
    linkExactActiveClass: 'nuxt-link-exact-active',
    scrollBehavior,
    routes: [
		{
			path: "/student",
			component: _2f17c616,
			name: "student"
		},
		{
			path: "/teacher",
			component: _84972a06,
			name: "teacher"
		},
		{
			path: "/admin",
			component: _1e389e2a,
			name: "admin"
		},
		{
			path: "/student/registration",
			component: _2da9b068,
			name: "student-registration"
		},
		{
			path: "/student/payments",
			component: _2a345fdc,
			name: "student-payments"
		},
		{
			path: "/student/profile",
			component: _5c272da0,
			name: "student-profile"
		},
		{
			path: "/student/dashboard",
			component: _cf9cb54a,
			name: "student-dashboard"
		},
		{
			path: "/teacher/subjects",
			component: _60fc5022,
			name: "teacher-subjects"
		},
		{
			path: "/admin/course",
			component: _4b386db6,
			name: "admin-course"
		},
		{
			path: "/teacher/students",
			component: _61283b80,
			name: "teacher-students"
		},
		{
			path: "/student/results",
			component: _60474186,
			name: "student-results"
		},
		{
			path: "/teacher/registration",
			component: _20d87ae1,
			name: "teacher-registration"
		},
		{
			path: "/admin/dashboard",
			component: _8ffb1722,
			name: "admin-dashboard"
		},
		{
			path: "/admin/subject",
			component: _3c2f7107,
			name: "admin-subject"
		},
		{
			path: "/student/subjects",
			component: _33e0e8f6,
			name: "student-subjects"
		},
		{
			path: "/admin/newuser",
			component: _d7e842f4,
			name: "admin-newuser"
		},
		{
			path: "/teacher/profile",
			component: _b53591d2,
			name: "teacher-profile"
		},
		{
			path: "/student/dashboard/paystack",
			component: _e2b56e32,
			name: "student-dashboard-paystack"
		},
		{
			path: "/student/profile/change-password",
			component: _0ce03df6,
			name: "student-profile-change-password"
		},
		{
			path: "/teacher/subjects/subjects",
			component: _6d52e83a,
			name: "teacher-subjects-subjects"
		},
		{
			path: "/student/payments/books",
			component: _57dca498,
			name: "student-payments-books"
		},
		{
			path: "/teacher/profile/change-password",
			component: _67da171d,
			name: "teacher-profile-change-password"
		},
		{
			path: "/admin/results/single",
			component: _5a4b2ed9,
			name: "admin-results-single"
		},
		{
			path: "/admin/results/batch",
			component: _306fc48e,
			name: "admin-results-batch"
		},
		{
			path: "/teacher/registration/passport",
			component: _fa7eb45a,
			name: "teacher-registration-passport"
		},
		{
			path: "/admin/subject/view",
			component: _3a30fc80,
			name: "admin-subject-view"
		},
		{
			path: "/student/subjects/view",
			component: _a4ed6a9e,
			name: "student-subjects-view"
		},
		{
			path: "/student/payments/others",
			component: _2ec3c56e,
			name: "student-payments-others"
		},
		{
			path: "/teacher/results/single",
			component: _5845c134,
			name: "teacher-results-single"
		},
		{
			path: "/student/registration/passport",
			component: _10a4aeec,
			name: "student-registration-passport"
		},
		{
			path: "/teacher/registration/confirmation",
			component: _b8b0c014,
			name: "teacher-registration-confirmation"
		},
		{
			path: "/teacher/results/batch",
			component: _cdc130e8,
			name: "teacher-results-batch"
		},
		{
			path: "/student/registration/confirmation",
			component: _1fbf748f,
			name: "student-registration-confirmation"
		},
		{
			path: "/teacher/profile/change-passport",
			component: _dcd955d8,
			name: "teacher-profile-change-passport"
		},
		{
			path: "/student/profile/change-passport",
			component: _36997bed,
			name: "student-profile-change-passport"
		},
		{
			path: "/student/payments/returning",
			component: _aaef6a88,
			name: "student-payments-returning"
		},
		{
			path: "/teacher/subjects/students/:id?",
			component: _07ec9cb6,
			name: "teacher-subjects-students-id"
		},
		{
			path: "/admin/users/:index",
			component: _52dad0dc,
			name: "admin-users"
		},
		{
			path: "/admin/edit/:index",
			component: _ae6a3c60,
			name: "admin-edit"
		},
		{
			path: "/",
			component: _43354cea,
			name: "index"
		}
    ],
    
    
    fallback: false
  })
}
