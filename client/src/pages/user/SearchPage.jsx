import Filter from "../../components/user/Filter";
import ProductSearchList from "../../components/user/ProductSearchList";

const Search = () => {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filter Area */}
          <Filter />
  
          {/* Result Area */}
          <ProductSearchList />
        </div>
      </div>
    );
  };
  
  export default Search;