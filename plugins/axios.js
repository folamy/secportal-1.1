import Cookie from "js-cookie"

export default function ({ $axios, route, store, redirect }) {
  // console.log($axios.onError);
  
  // $axios.onError(error => {
    
  //   if (error.response.status === 401 && route.path.indexOf("/student", 0) !== -1) {
  //     Cookie.remove("tokenS");
  //     store.commit("setStudent", null);
  //     store.commit("setSToken", null);
  //     redirect("/student");
  //   } else if (error.response.status === 401 && route.path.indexOf("/teacher", 0) !== -1) {
  //     Cookie.remove("tokenT");
  //     store.commit("setTeacher", null);
  //     store.commit("setTToken", null);
  //     redirect("/teacher");
  //   } else if (error.response.status === 401 && route.path.indexOf("/admin", 0) !== -1) {
  //     Cookie.remove("tokenA");
  //     store.commit("setAdmin", null);
  //     store.commit("setAToken", null);
  //     redirect("/admin");
  //   }
  // })
  
}
