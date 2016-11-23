import Defense from '../../models/defenses'

export async function createDefenses (ctx) {
  const defenseIds = []
  try {
    await Promise.all(ctx.request.fields.defenses.map(async (defense) => {
      const newDefense = new Defense({...defense, author: ctx.state.user._id, tag: ctx.request.fields.tag})
      await newDefense.save()
      defenseIds.push(newDefense._id)
    }))
    ctx.body = {
      defenseIds,
    }
  } catch (err) {
    ctx.throw(422, err.message)
  }
}

async function getDefense (id) {
  return await Defense.findById(id)
}

export async function getDefenses (ctx, next) {
  // ctx.state中储存了koa-passport解析的用户会话信息
  const defenses = await Defense.find({author: ctx.state.user._id})
  ctx.body = {
    defenses,
  }
  if (next) {
    return next()
  }
}

export async function updateDefenses (ctx) {
  try {
    await Promise.all(ctx.request.fields.defenses.map(async (defense) => {
      await Object.assign((await getDefense(defense._id)), defense).save()
    }))
    ctx.body = {
      update: true,
    }
  } catch (err) {
    ctx.throw(422, err.message)
  }
}

export async function deleteDefenses (ctx) {
  try {
    await Promise.all(ctx.request.fields.defenseIds.map(async (id) => {
      await (await getDefense(id)).remove()
    }))
    ctx.body = {
      delete: true,
    }
  } catch (err) {
    ctx.throw(422, err.message)
  }
}
