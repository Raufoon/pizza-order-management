import db from '../../../../database'

export default async (req, res) => {
  try {
    const data = await db.instance.any(
      `select getMySuppliers('${req.query.bakerid}')`
    )
    res.statusCode = 200
    res.json(Object.values(data).map((item) => item.getmysuppliers))
  } catch (err) {
    res.statusCode = 404
    res.end(err)
  }
}
