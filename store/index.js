import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'

const createStore = () => {
  return new Vuex.Store({
    state: {
      student: null,
      Stoken: null,
      Spassport: null,
      isStudentLoggedIn: false,
      studentRegData: null,
      subjectReg: '',
      schoolItems: '',

      teacher: null,
      Ttoken: null,
      Tpassport: null,
      teacherRegData: null,
      teacherSubData: '',
      isTeacherLoggedIn: false,
      teacherSubReg: '',

      admin: null,
      Atoken: null,
      isAdminLoggedIn: false,
      adminSubs: [],
      term: null,
      termEnds: null,
      allterms: null,
      aboutHome: false
    },
    mutations,
    actions
  })
}

export default createStore
