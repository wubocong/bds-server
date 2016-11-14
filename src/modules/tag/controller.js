import Tag from '../../models/tags'

export async function createTags (ctx) {
  const tagIds = []
  try {
    await Promise.all(ctx.body.tags.map(async (tag) => {
      const newTag = new Tag({...tag, author: ctx.state.user._id})
      await newTag.save()
      tagIds.push(newTag._id)
    }))
    ctx.body = {
      tagIds,
    }
  } catch (err) {
    ctx.throw(422, err.message)
  }
}

async function getTag (id, author) {
  return await Tag.findById(id)
}

export async function getTags (ctx, next) {
  // ctx.state中储存了koa-passport解析的用户会话信息
  const tags = await Tag.find({author: ctx.state.user._id})
  ctx.body = {
    tags,
  }
  if (next) {
    return next()
  }
}

export async function updateTags (ctx) {
  try {
    await Promise.all(ctx.request.fields.tags.map(async (tag) => {
      await Object.assign((await getTag(tag._id)), tag).save()
    }))
    ctx.body = {
      update: true,
    }
  } catch (err) {
    ctx.throw(422, err.message)
  }
}

export async function deleteTags (ctx) {
  try {
    await Promise.all(ctx.request.fields.tagIds.map(async (id) => {
      await (await getTag(id)).remove()
    }))
    ctx.body = {
      delete: true,
    }
  } catch (err) {
    ctx.throw(422, err.message)
  }
}

export async function duplicateTags (ctx, next) {
  ctx.body.tags = ctx.request.fields.tags.filter((newTag) => ctx.body.tags.every(tag => tag.name !== newTag.name))

  if (next) {
    return next()
  }
}
