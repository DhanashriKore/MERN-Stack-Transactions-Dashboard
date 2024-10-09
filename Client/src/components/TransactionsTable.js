import React, { useState } from 'react';

const TransactionsTable = ({ transactions }) => {
  const [search, setSearch] = useState('');

  const filteredTransactions = transactions.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.description.toLowerCase().includes(search.toLowerCase()) ||
    t.price.toString().includes(search)
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search transactions"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Sold</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map(transaction => (
            <tr key={transaction.id}>
              <td>{transaction.title}</td>
              <td>{transaction.description}</td>
              <td>{transaction.price}</td>
              <td>{transaction.sold ? 'Yes' : 'No'}</td>
              <td>{transaction.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;
