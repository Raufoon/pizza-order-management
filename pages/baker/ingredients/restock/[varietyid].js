import { makeGetRequest } from '../../../../lib'
import styles from '../../../../styles/Restock.module.css'

export default function Restock({ variety, suppliers }) {
  return (
    <section className={styles.Restock}>
      <div className={styles.content}>
        <h1>
          Restock {variety.name} from {variety.region} ?
        </h1>

        <h5 style={{ textAlign: 'center' }}>
          <i>Each item costs {variety.price} €</i>
        </h5>

        <br />

        <div className={styles.field}>
          <label>Select a supplier:&nbsp;&nbsp;</label>
          <select>
            {suppliers.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label>Select amount:&nbsp;&nbsp;</label>
          <select>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </div>

        <button className={styles.restockButton}>Restock</button>
      </div>
    </section>
  )
}

export async function getServerSideProps(context) {
  const { varietyid } = context.query
  return {
    props: {
      variety: {
        id: varietyid,
        region: 'Germany',
        name: 'Cheese',
        price: 4,
      },
      suppliers: [
        {
          id: '333333',
          name: 'Meow',
        },
        {
          id: '333322',
          name: 'Gheu',
        },
      ],
    },
  }
}
