import { get} from "../utils/request";

export const getListCategory = async () => {
  const result = await get(`product-category`);
  return result;
}
