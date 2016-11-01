import File from '../../models/files'

export async function createFiles (ctx) {
  const res = []
  ctx.request.files.forEach((uploadFile, i) => {
    const file = new File({...uploadFile, author: ctx.request.fields.author, tag: ctx.request.fields.tag, lastModifiedDate: new Date(uploadFile.lastModifiedDate).getTime()})
    file.save()
    res.push({ _id: file._id, path: file.path })
  })
  ctx.body = {
    res,
  }
}

export async function getFiles (ctx) {
  const files = await File.find({})
  ctx.body = { files }
}

export async function getQueryFiles (ctx) {
  const files = await File.find({ ...ctx.request.fields.info })
  ctx.body = { files }
}

export async function getFile (ctx, next) {
  try {
    const file = await File.findById(ctx.params.id)
    if (!file) {
      ctx.status = 404
      ctx.body = { file: {} }
    }

    ctx.body = {
      file
    }
  } catch (err) {
    if (err === 404 || err.name === 'CastError') {
      ctx.status = 404
      ctx.body = { file: {} }
    }

    ctx.status = 500
    ctx.body = { file: {} }
  }

  if (next) { return next() }
}

export async function deleteFile (ctx) {
  const file = ctx.body.file
  const reqFile = ctx.request.fields.file

  // to be fixed
  if (ctx.params.id === reqFile['_id'] && file.author === reqFile.author && file.tag === reqFile.tag) {
    await file.remove()
    ctx.body = {
      file: { _id: file['_id'] }
    }
  } else {
    ctx.status = 400
    ctx.body = {
      file: {}
    }
  }
}
