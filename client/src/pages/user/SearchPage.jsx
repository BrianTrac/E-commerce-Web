import Filter from "../../components/user/Filter";
import ResultFound from "../../components/user/ResultFound";

const Search = () => {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filter Area */}
          <Filter />
  
          {/* Result Area */}
          <ResultFound />
        </div>
      </div>
    );
  };
  
  export default Search;