import Paper from '../../models/files'

export async function createPapers (ctx) {
  const fileIds = []
  try {
    await Promise.all(ctx.request.files.map(async (file) => {
      const newPaper = new Paper({...file, author: ctx.state.user._id, lastModifiedDate: new Date(file.lastModifiedDate).getTime()})
      await newPaper.save()
      fileIds.push(newPaper._id)
    }))
    ctx.body = {
      fileIds,
    }
  } catch (err) {
    ctx.throw(422, err.message)
  }
}

async function getPaper (id, author) {
  return await Paper.findById(id)
}

export async function getPapers (ctx, next) {
  // ctx.state中储存了koa-passport解析的用户会话信息
  const files = await Paper.find({author: ctx.state.user._id})
  ctx.body = {
    files,
  }
  if (next) {
    return next()
  }
}

export async function deletePapers (ctx) {
  try {
    await Promise.all(ctx.request.fields.fileIds.map(async (id) => {
      await (await getPaper(id)).remove()
    }))
    ctx.body = {
      delete: true,
    }
  } catch (err) {
    ctx.throw(422, err.message)
  }
}
