import cookieparser from "cookieparser";
import Cookie from "js-cookie";

const actions = {
  async nuxtServerInit({ commit }, context) {
    const req = context.req;

    // set current term
    await context.app.$axios.get("/get-curent-term")
    .then(res => {
      const data = res.data
      commit("setAllTerm", data);
      data.forEach(term => {
        if (term.current) {
          console.log(term);
          
          commit("setTerm", term.term);
          commit("setTermEnds", term.ends);
          
        }
      });
    })
    // console.log(term)

    //set All terms for later use
    // if (req.session.allterms) {
    // }

    let accessTToken = null;
    let accessSToken = null;
    let accessAToken = null;
    if (req.headers.cookie) {
      var parsed = cookieparser.parse(req.headers.cookie);
      accessTToken = parsed.tokenT;
      accessSToken = parsed.tokenS;
      accessAToken = parsed.tokenA;
      // accessToken = JSON.parse(parsed.tokenT)
    }
    commit("setTToken", accessTToken);
    commit("setSToken", accessSToken);
    commit("setAToken", accessAToken);

    if (req.session.teacherReg) {
      commit("setTeachRegData", req.session.teacherReg);
    }

    if (req.session.registrationData) {
      commit("setRegData", req.session.registrationData);
    }

    // for token and users
    if (req.session.student && req.session.Stoken) {
      commit("setStudent", req.session.student);
      commit("setSToken", req.session.Stoken);
    } else {
      commit("setStudent", null);
      commit("setSToken", null);
    }

    if (req.session.teacher && req.session.Ttoken) {
      commit("setTeacher", req.session.teacher);
      commit("setTToken", req.session.Ttoken);
    } else {
      commit("setTeacher", null);
      commit("setTToken", null);
    }

    if (req.session.admin && req.session.Atoken) {
      commit("setAdmin", req.session.admin);
      commit("setAToken", req.session.Atoken);
    } else {
      commit("setAdmin", null);
      commit("setAToken", null);
    }
  },

  async studentLogout({ state, commit }) {
    Cookie.remove("tokenS");
    commit("setStudent", null);
    commit("setSToken", null);
    await this.$axios.post("/s-logout");
  },

  async teacherLogout({ state, commit }) {
    Cookie.remove("tokenT");
    commit("setTeacher", null);
    commit("setTToken", null);
    await this.$axios.post("/t-logout");
  },

  async adminLogout({ state, commit }) {
    commit("setAToken", null);
    Cookie.remove("tokenA");
    commit("setAdmin", null);
    await this.$axios.post("/a-logout");
  }
};

export default actions;
