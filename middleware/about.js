export default function ({ store, route }) {
  if (route.path === "/") {
    store.commit("setAboutHome", true)
  } else if (route.path !== "/") {
    store.commit("setAboutHome", false)
  } 
}