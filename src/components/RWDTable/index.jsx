import React from 'react';
import useRWD from '../../hooks/useRWD';
import './RWDTable.css';

/**
 * RWDTable Component
 * @param {Array} columns - an array of column configurations, e.g., [{ key: 'id', label: 'ID' }]
 * @param {Array} data - an array of data objects, e.g., [{ id: 1, name: 'John' }]
 * @param {Function} renderActions - an optional function to render action buttons for each row
 */
const RWDTable = ({ columns, data, renderActions }) => {
  const { isMobile } = useRWD();

  const renderTableHeader = () => {
    return (
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.label}</th>
          ))}
          {renderActions && <th>Actions</th>}
        </tr>
      </thead>
    );
  };

  const renderTableBody = () => {
    return (
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((col) => (
              <td key={col.key} data-label={col.label}>
                {row[col.key]}
              </td>
            ))}
            {renderActions && (
              <td className="actions-cell">{renderActions(row)}</td>
            )}
          </tr>
        ))}
      </tbody>
    );
  };

  const renderCardList = () => {
    return (
      <ul className="card-list">
        {data.map((row, rowIndex) => (
          <li key={rowIndex} className="card">
            {columns.map((col) => (
              <div key={col.key} className="card-item">
                <span className="card-item-label">{col.label}</span>
                <span className="card-item-value">{row[col.key]}</span>
              </div>
            ))}
            {renderActions && (
              <div className="card-item">
                <span className="card-item-label">Actions</span>
                <span className="card-item-value">{renderActions(row)}</span>
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="rwd-table-container">
      {isMobile ? (
        renderCardList()
      ) : (
        <table className="rwd-table">
          {renderTableHeader()}
          {renderTableBody()}
        </table>
      )}
    </div>
  );
};

export default RWDTable;
