export default  function ({ store, redirect }) {
  let student = store.state.student
  if (store.state.isStudentLoggedIn && student.newIntake && !student.sch_fees) {
    redirect('/student/payments')
  }
}
