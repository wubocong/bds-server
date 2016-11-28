import Admin from '../../models/admins'
const logger = require('koa-log4').getLogger('index')

export async function createAdmin(user) {
  const admin = new Admin({...user, adminId: user._id})
  try {
    await admin.save()
    return true
  } catch (err) {
    logger.error(err.message)
    return err
  }
}

export async function getAdmin(id) {
  try {
    let admin = await Admin.find({adminId: id}, '-type')
    if (!admin) {
      return 404
    }
    return admin
  } catch (err) {
    logger.error(err.message)
    return err
  }
}

export async function deleteAdmin(id) {
  const admin = Admin.find({adminId: id})
  try {
    await admin.remove()
    return true
  } catch (err) {
    logger.error(err.message)
    return err
  }
}

