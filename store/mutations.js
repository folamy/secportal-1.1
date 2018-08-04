const mutations = {
  setTToken(state, Ttoken) {
    state.Ttoken = Ttoken;
    // this.$axios.setToken(state.Ttoken)
  },

  setSToken(state, Stoken) {
    state.Stoken = Stoken;
  },

  setAToken(state, Atoken) {
    state.Atoken = Atoken;
  },

  setStudent(state, user) {
    state.student = user;
    if (state.student) {
      state.isStudentLoggedIn = true;
      state.Spassport = state.student.passport;
    } else {
      state.isStudentLoggedIn = false;
      state.Spassport = null;
    }
  },

  setTeacher(state, user) {
    state.teacher = user;
    if (state.teacher) {
      state.isTeacherLoggedIn = true;
      state.Tpassport = state.teacher.passport;
    } else {
      state.isTeacherLoggedIn = false;
      state.Tpassport = null;
    }
  },

  setAdmin(state, user) {
    state.admin = user;
    if (state.admin) {
      state.isAdminLoggedIn = true;
    } else {
      state.isAdminLoggedIn = false;
    }
  },

  setTerm(state, term) {
    state.term = term;
  },

  setTermEnds(state, data) {
    state.termEnds = data;
  },

  setAllTerm(state, data) {
    state.allterms = data;
  },

  setAboutHome(state, data) {
    state.aboutHome = data;
  },

  setSubject(state, subject) {
    state.subjectReg = subject;
  },

  setRegData(state, regData) {
    state.studentRegData = regData;
  },

  setTeachRegData(state, regData) {
    state.teacherRegData = regData;
  },

  setTeacherSubData(state, subjects) {
    state.teacherSubData = subjects;
  },

  setSchoolItems(state, schoolItems) {
    state.schoolItems = schoolItems;
  }
};

export default mutations
