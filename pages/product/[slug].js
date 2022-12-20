import { useQuery } from "urql";
import { GET_PRODUCT_QUERY } from "../../lib/query";
import { useRouter } from "next/router";
import {
  DetailsStyle,
  ProductInfo,
  Quantity,
  Buy,
} from "../../styles/ProductDetails";
import { AiFillPlusCircle, AiFillMinusCircle } from "react-icons/ai";
import { useStateContext } from "../../lib/context";

export default function ProductDetails() {
  const { qty, increaseQty, decreaseQty, onAdd } = useStateContext();

  // Fetch slug
  const { query } = useRouter();

  // Fetch graphQL data
  const [results] = useQuery({
    query: GET_PRODUCT_QUERY,
    variables: { slug: query.slug },
  });
  const { data, fetching, error } = results;

  // Check for incoming data
  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no ... {error.message}</p>;

  //   extract data
  const { title, description, image } = data.products.data[0].attributes;
  console.log(data.products.data[0].attributes);

  return (
    <DetailsStyle>
      <img src={image.data.attributes.formats.small.url} alt={title} />
      <ProductInfo>
        <h3>{title}</h3>
        <p>{description}</p>
        <Quantity>
          <span>Quantity</span>
          <button onClick={decreaseQty}>
            <AiFillMinusCircle />
          </button>
          <p>{qty}</p>
          <button onClick={increaseQty}>
            <AiFillPlusCircle />
          </button>
        </Quantity>
        <Buy onClick={() => onAdd(data.products.data[0].attributes, qty)}>
          Add to cart
        </Buy>
      </ProductInfo>
    </DetailsStyle>
  );
}
