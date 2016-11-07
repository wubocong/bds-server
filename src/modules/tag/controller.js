import Tag from '../../models/tags'

export async function createTags (ctx) {
  const tagIds = []

  await Promise.all(ctx.body.tags.map(async (tag) => {
    try {
      const newTag = new Tag({...tag, author: ctx.request.fields.author})
      console.log(newTag)
      await newTag.save()
      tagIds.push(newTag._id)
    } catch (err) {
      ctx.throw(422, err.message)
    }
  }))

  ctx.body = {
    tagIds
  }
}

async function getTag (ctx, id) {
  try {
    const tag = await Tag.findById(id)
    if (!tag) {
      ctx.throw(404)
    }
    return tag
  } catch (err) {
    if (err === 404 || err.name === 'CastError') {
      ctx.throw(404)
    }

    ctx.throw(500)
  }
}

export async function getTags (ctx, next) {
  const tags = await Tag.find()
  ctx.body = {
    tags,
  }
  if (next) {
    return next()
  }
}

export async function updateTags (ctx) {
  await Promise.all(ctx.request.fields.tags.map(async (tag) => {
    try {
      await { ...getTag(ctx, tag._id), ...tag }.save()
    } catch (err) {
      ctx.throw(422, err.message)
    }
  }))

  ctx.body = {
    update: true,
  }
}

export async function deleteTags (ctx) {
  await Promise.all(ctx.request.fields.tagIds.map(async (id) => {
    try {
      await getTag(ctx, id).remove()
    } catch (err) {
      ctx.throw(422, err.message)
    }
  }))

  ctx.body = {
    delete: true,
  }
}

export async function duplicateTags (ctx, next) {
  ctx.body.tags = ctx.request.fields.tags.filter((newTag) => ctx.body.tags.every(tag => tag.name !== newTag.name))

  if (next) {
    return next()
  }
}
