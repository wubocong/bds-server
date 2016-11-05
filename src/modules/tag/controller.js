import Tag from '../../models/tags'

export async function createTags(ctx) {
  const tagIds = [];
  ctx.body.tags.forEach((tag) => {
    const newTag = new Tag(tag);
    try {
      await newTag.save()
    } catch (err) {
      ctx.throw(422, err.message)
    }
    tagIds.push(newTag._id);
  });

  ctx.body = {
    tagIds
  }
}

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
  const tags = await Tag.find()
  ctx.body = {
    tags
  }
  if (next) {
    return next()
  }
}

export async function getTag(id) {
  try {
    const tag = await Tag.findById(id)
    if (!tag) {
      ctx.throw(404)
    }
  } catch (err) {
    if (err === 404 || err.name === 'CastError') {
      ctx.throw(404)
    }

    ctx.throw(500)
  }
  return tag
}


export async function updateTag(tag, newTag) {
  Object.assign(tag, newTag)
  
  return await tag.save()
}

export async function updateTags(ctx) {
  const tags = ctx.body.tags
  const tagsState = {};

  ctx.request.fields.tags.forEach((tag) => {
    tagsState[tag._id] = await updateTag(await getTag(tag._id), tag)
  });

  ctx.body = {
    tags
  }
}

export async function deleteTags(ctx) {
  const tag = ctx.body.tag

  await tag.remove()

  ctx.status = 200
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

export async function duplicateTags(ctx, next) {
  const tags = ctx.body.tags
  const newTags = ctx.request.fields.tags.filter((newTag) => tags.every(tag => tag.name !== newTag.name))
  ctx.body = {
    tags: newTags
  }
  if (next) {
    return next()
  }
}
