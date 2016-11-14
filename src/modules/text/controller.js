import Text from '../../models/texts'

export async function createTexts (ctx) {
  const textIds = []
  try {
    await Promise.all(ctx.body.texts.map(async (text) => {
      const newText = new Text({...text, author: ctx.state.user._id, tag: ctx.request.fields.tag})
      await newText.save()
      textIds.push(newText._id)
    }))
    ctx.body = {
      textIds,
    }
  } catch (err) {
    ctx.throw(422, err.message)
  }
}

async function getText (id) {
  return await Text.findById(id)
}

export async function getTexts (ctx, next) {
  // ctx.state中储存了koa-passport解析的用户会话信息
  const texts = await Text.find({author: ctx.state.user._id})
  ctx.body = {
    texts,
  }
  if (next) {
    return next()
  }
}

export async function updateTexts (ctx) {
  try {
    await Promise.all(ctx.request.fields.texts.map(async (text) => {
      await Object.assign((await getText(text._id)), text).save()
    }))
    ctx.body = {
      update: true,
    }
  } catch (err) {
    ctx.throw(422, err.message)
  }
}

export async function deleteTexts (ctx) {
  try {
    await Promise.all(ctx.request.fields.textIds.map(async (id) => {
      await (await getText(id)).remove()
    }))
    ctx.body = {
      delete: true,
    }
  } catch (err) {
    ctx.throw(422, err.message)
  }
}
