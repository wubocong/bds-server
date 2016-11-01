import Text from '../../models/texts'

export async function createText(ctx) {
  const text = new Text(ctx.request.fields.text)
  try {
    await text.save()
  } catch (err) {
    ctx.throw(422, err.message)
  }
  ctx.body = {
    text: { _id: text._id }
  }
}

export async function getTexts(ctx) {
  const texts = await Text.find({})
  ctx.body = { texts }
}

export async function getQueryTexts(ctx) {
  const texts = await Text.find({ ...ctx.request.fields.info })
  ctx.body = { texts }
}

export async function getText(ctx, next) {
  try {
    const text = await Text.findById(ctx.params.id)
    if (!text) {
      ctx.status = 404
      ctx.body = { text: {} }
    }

    ctx.body = {
      text
    }
  } catch (err) {
    if (err === 404 || err.name === 'CastError') {
      ctx.status = 404
      ctx.body = { text: {} }
    }

    ctx.status = 500
    ctx.body = { text: {} }
  }

  if (next) { return next() }
}

export async function updateText(ctx) {
  const text = ctx.body.text

  Object.assign(text, ctx.request.fields.text)

  await text.save()

  ctx.body = {
    text: { _id: text._id }
  }
}

export async function deleteText(ctx) {
  const text = ctx.body.text
  const reqText = ctx.request.fields.text

  // to be fixed
  if (ctx.params.id === reqText['_id'] && text.author === reqText.author && text.tag === reqText.tag) {
    await text.remove()
    ctx.body = {
      text: { _id: text['_id'] }
    }
  } else {
    ctx.status = 400
    ctx.body = {
      text: {}
    }
  }
}
