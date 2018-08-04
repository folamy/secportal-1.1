export default  function ({ store, redirect }) {
  if (!store.state.teacherRegData) {
    redirect('/teacher/registration')
  }
}
