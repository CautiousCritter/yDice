export default function Search({ query, onChange, onClear }) {
  return (
    <>
      <input
        type="text"
        value={query}
        onChange={onChange}
        placeholder="Search..."
      />
      <button onClick={onClear} disabled={query.length === 0}>
        Clear
      </button>
    </>
  );
}
