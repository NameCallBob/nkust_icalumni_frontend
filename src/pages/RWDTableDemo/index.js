import React from 'react';
import RWDTable from '../../components/RWDTable';
import useRWD from '../../hooks/useRWD';

const RWDTableDemo = () => {
  const { getContainerStyle, getFontSize } = useRWD();

  // Sample data for the table
  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
  ];

  const data = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'User' },
    { id: 3, name: 'Peter Jones', email: 'peter.jones@example.com', role: 'User' },
    { id: 4, name: 'Susan Williams', email: 'susan.w@example.com', role: 'Editor' },
    { id: 5, name: 'David Brown', email: 'david.b@example.com', role: 'Guest' },
  ];

  // Optional: Render action buttons
  const renderActions = (row) => (
    <>
      <button
        className="action-button"
        onClick={() => alert(`Editing ${row.name}`)}
      >
        Edit
      </button>
      <button
        className="action-button"
        onClick={() => alert(`Deleting ${row.name}`)}
      >
        Delete
      </button>
    </>
  );

  return (
    <div style={getContainerStyle()}>
      <h1 style={{ fontSize: getFontSize('h1'), marginBottom: '20px' }}>
        RWD Table Demo
      </h1>
      <p style={{ fontSize: getFontSize('body'), marginBottom: '30px' }}>
        This table displays as a standard table on desktop and as a card list on mobile devices.
      </p>
      <RWDTable columns={columns} data={data} renderActions={renderActions} />
    </div>
  );
};

export default RWDTableDemo;
