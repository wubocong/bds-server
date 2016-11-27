import Student from '../../models/students'
import Paper from '../../models/papers'

export async function createStudent(ctx, id) {
  const student = new Student({...ctx.request.fields.user, studentId: id})
  try {
    await student.save()
  } catch (err) {
    return err
  }
}

export async function getStudent(ctx, id) {
  try {
    let student = await Student.findById(id)
    if (!student) {
      return 404
    }
    return student
  } catch (err) {
    return err
  }
}

export async function updateStudent(ctx, student) {
  let newStudent
  try {
    newStudent = await Student.find({studentId: student._id})
  } catch (err) {
    return err
  }
  if (student.paperId) {
    try {
      const paper = await Paper.findById(student.paperId)
      if (paper) {
        paper.studentId = student._id
        newStudent.paperId = student.paperId
      } else {
        return 404
      }
    } catch (err) {
      return err
    }
  }
  if (student.defenseId) {
    try {
      const defense = await Paper.findById(student.defenseId)
      if (defense) {
        defense.studentId = student._id
        newStudent.defenseId = student.defenseId
      } else {
        return 404
      }
    } catch (err) {
      return err
    }
  }
  try {
    await newStudent.save()
    return true
  } catch (err) {
    return err
  }
}

export async function deleteStudent(ctx, id) {
  const student = Student.find({studentId: id})
  try {
    await student.remove()
    return true
  } catch (err) {
    return err
  }
}

