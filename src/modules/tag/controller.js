import Tag from '../../models/tags'

export async function createTag(ctx) {
  const tag = new Tag(ctx.request.fields.tag)
  try {
    await tag.save()
  } catch (err) {
    ctx.throw(422, err.message)
  }
  ctx.body = {
    tag: { _id: tag._id }
  }
}

export async function getTags(ctx) {
  const tags = await Tag.find({})
  ctx.body = {
    tags
  }
}

export async function getTag(ctx, next) {
  try {
    const tag = await Tag.findById(ctx.params.id)
    if (!tag) {
      ctx.throw(404)
    }

    ctx.body = {
      tag
    }
  } catch (err) {
    if (err === 404 || err.name === 'CastError') {
      ctx.throw(404)
    }

    ctx.throw(500)
  }

  if (next) {
    return next()
  }
}

export async function updateTag(ctx) {
  const tag = ctx.body.tag

  Object.assign(tag, ctx.request.fields.tag)

  await tag.save()

  ctx.body = {
    tag: { _id: tag._id }
  }
}

export async function deleteTag(ctx) {
  const tag = ctx.body.tag

  await tag.remove()

  ctx.status = 200
  ctx.body = {
    tag: { _id: tag._id }
  }
}

export async function duplicateTag(ctx, next) {
  try {
    const tag = await Tag.findOne({
      name: ctx.request.fields.tag.name,
      author: ctx.request.fields.tag.author
    })
    if (tag) {
      ctx.status = 304
      ctx.body = {}
    }
  } catch (err) {
    if (err === 500) {
      ctx.throw(500)
    }
  }
  if (next) {
    return next()
  }
}
