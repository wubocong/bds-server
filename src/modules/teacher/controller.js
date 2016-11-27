import Teacher from '../../models/teachers'

export async function createTeacher(user) {
  const teacher = new Teacher({...user, teacherId: user._id})
  try {
    await teacher.save()
    return true
  } catch (err) {
    return err
  }
}

export async function getTeacher(id) {
  try {
    let teacher = await Teacher.find({teacherId: id})
    if (!teacher) {
      return 404
    }
    return teacher
  } catch (err) {
    return err
  }
}

export async function deleteTeacher(id) {
  const teacher = Teacher.find({teacherId: id})
  try {
    await teacher.remove()
    return true
  } catch (err) {
    return err
  }
}

