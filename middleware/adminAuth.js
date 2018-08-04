export default  function ({ store, redirect }) {
  if (!store.state.isAdminLoggedIn || !store.state.Atoken) {
    redirect('/Admin')
  }
}
