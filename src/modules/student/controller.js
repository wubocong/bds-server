import Student from '../../models/students'
import Paper from '../../models/papers'
import Defense from '../../models/defenses'

export async function createStudent(user) {
  const student = new Student({...user, studentId: user._id})
  try {
    await student.save()
    return true
  } catch (err) {
    return err
  }
}

export async function getStudent(id, query) {
  try {
    let student = await Student.find({studentId: id}, `-type ${query}`)
    if (!student) {
      return 404
    }
    return student
  } catch (err) {
    return err
  }
}

export async function updateStudent(user) {
  let student
  try {
    student = await Student.find({studentId: user._id})
  } catch (err) {
    return err
  }
  if (user.paperId) {
    try {
      const paper = await Paper.findById(user.paperId)
      if (paper) {
        paper.studentId = user._id
        student.paperId = user.paperId
      } else {
        return 404
      }
    } catch (err) {
      return err
    }
  }
  if (user.defenseId) {
    try {
      const defense = await Defense.findById(user.defenseId)
      if (defense) {
        defense.studentId = user._id
        student.defenseId = user.defenseId
      } else {
        return 404
      }
    } catch (err) {
      return err
    }
  }
  try {
    await student.save()
    return true
  } catch (err) {
    return err
  }
}

export async function deleteStudent(id) {
  const student = Student.find({studentId: id})
  try {
    await student.remove()
    return true
  } catch (err) {
    return err
  }
}

