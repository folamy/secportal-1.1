export default  function ({ store, redirect }) {
  if (!store.state.studentRegData) {
    redirect('/student/registration')
  }
}