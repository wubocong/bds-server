import File from '../../models/files'

export async function createFiles (ctx) {
  const fileIds = []
  try {
    await Promise.all(ctx.request.files.map(async (file) => {
      const newFile = new File({...file, author: ctx.state.user._id, tag: ctx.request.fields.tag, lastModifiedDate: new Date(file.lastModifiedDate).getTime()})
      await newFile.save()
      fileIds.push(newFile._id)
    }))
    ctx.body = {
      fileIds,
    }
  } catch (err) {
    ctx.throw(422, err.message)
  }
}

async function getFile (id, author) {
  return await File.findById(id)
}

export async function getFiles (ctx, next) {
  // ctx.state中储存了koa-passport解析的用户会话信息
  const files = await File.find({author: ctx.state.user._id})
  ctx.body = {
    files,
  }
  if (next) {
    return next()
  }
}

export async function deleteFiles (ctx) {
  try {
    await Promise.all(ctx.request.fields.fileIds.map(async (id) => {
      await (await getFile(id)).remove()
    }))
    ctx.body = {
      delete: true,
    }
  } catch (err) {
    ctx.throw(422, err.message)
  }
}
