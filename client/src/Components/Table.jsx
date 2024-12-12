const Table = ({ headers, rows }) => {
  return (
    <div className="overflow-x-auto m-8 mt-0">
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200 text-left text-sm font-medium text-gray-500">
            {headers.map((header, index) => (
              <th
                key={index}
                className={`px-4 py-2 ${
                  header === "Action" ? "w-20 text-center pr-16" : ""
                }`}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {Object.keys(row).map((key, colIndex) => (
                <td
                  key={colIndex}
                  className={`px-4 py-2 text-sm text-gray-900 ${
                    key === "action" ? "text-center w-20 pr-16" : "truncate"
                  }`}
                  style={key === "email" ? { maxWidth: "200px" } : {}}
                >
                  {row[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
