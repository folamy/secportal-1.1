export default  function ({ store, redirect }) {
  if (!store.state.isTeacherLoggedIn || !store.state.Ttoken) {
    redirect('/teacher')
  }
}
