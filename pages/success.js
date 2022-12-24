import { useRouter } from "next/router";

const stripe = require("stripe")(
  `${process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY}`
);

export async function getServerSideProps(params) {
  const order = await stripe.checkout.sessions.retrieve(
    params.query.session_id,
    {
      expand: ["line_items"],
    }
  );
  return { props: { order } };
}

export default function Success({ order }) {
  const route = useRouter();

  return (
    <div>
      <div>
        <h1>Thank you for your order!</h1>
        <h2>A confirmation email has been sent to your</h2>
        <h2>{order.customer_details.email}</h2>
        <div>
          <h3>Address</h3>
          {Object.entries(order.customer_details.address).map(([key, val]) => (
            <p key={key}>
              {key}: {val}
            </p>
          ))}
        </div>
        <div>
          <h3>Products</h3>
          {order.line_items.data.map((item) => (
            <div key={item.id}>
              <p>Product: {item.description}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Price: {item.price.unit_amount}</p>
            </div>
          ))}
        </div>
        <button onClick={() => route.push("/")}>Continue Shopping</button>
      </div>
    </div>
  );
}
