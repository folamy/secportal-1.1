export default  function ({ store, redirect }) {
  if (!store.state.isStudentLoggedIn || !store.state.Stoken) {
    redirect('/student')
  }
}
