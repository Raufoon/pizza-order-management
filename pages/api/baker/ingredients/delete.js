import db from '../../../../database'

export default async (req, res) => {
  if (req.method.toLowerCase() !== 'post') {
    res.statusCode = 500
    res.end(req.method)
  }

  try {
    const { varietyId, bakerId } = JSON.parse(req.body)
    const response = await db.instance.one(
      `select deleteIngredientVariety('${bakerId}', '${varietyId}')`
    )
    res.statusCode = 200
    res.json(response.deleteingredientvariety)
  } catch (err) {
    res.statusCode = 404
    res.end(err)
  }
}
