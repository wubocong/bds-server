import Tag from '../../models/tags'

function createTag(tag) {
  return new Promise((resolve, reject) => {
    try {
      const newTag = new Tag(tag);
      newTag.save()
      resolve(newTag)
    } catch (err) {
      reject(err)
      ctx.throw(422, err.message)
    }
  })
}

export async function createTags(ctx) {
  const tagIds = [];
  ctx.body.tags.forEach((tag) => {
    tagIds.push((await createTag(tag))._id)
  })

  ctx.body = {
    tagIds
  }
}

async function getTag(id) {
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

export async function getTags(ctx) {
  const tags = await Tag.find()
  ctx.body = {
    tags
  }
  if (next) {
    return next()
  }
}

async function updateTag(tag, newTag) {
  Object.assign(tag, newTag)
  try {
    return await tag.save()
  } catch (err) {
    ctx.throw(422, err.message)
  }
}

export async function updateTags(ctx) {
  const tags = ctx.body.tags
  const tagsState = {};

  ctx.request.fields.tags.forEach((tag) => {
    tagsState[tag._id] = !!await updateTag(await getTag(tag._id), tag)
  });

  ctx.body = {
    tagsState
  }
}


async function deleteTag(tag) {
  try {
    return await tag.remove()
  }
  catch{
    ctx.throw(422, err.message)
  }
}

export async function deleteTags(ctx) {
  const tags = ctx.body.tags
  const tagsState = {};

  ctx.request.fields.tags.forEach((tag) => {
    tagsState[tag._id] = !!await deleteTag(await getTag(tag._id))
  });

  ctx.status = 200
  ctx.body = {
    tagsState
  }
}

export async function duplicateTags(ctx, next) {
  const tags = ctx.body.tags
  const newTags = ctx.request.fields.tags.filter((newTag) => tags.every(tag => tag.name !== newTag.name))
  if (next) {
    return next()
  }
}
