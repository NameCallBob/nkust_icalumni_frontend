import React from 'react';
import { Form } from 'react-bootstrap';

function SearchBar({ onSearch }) {
    const handleSearchChange = (e) => {
        onSearch(e.target.value);
    };

    return (
        <Form>
            <Form.Group controlId="formSearch">
                <Form.Control
                    type="text"
                    placeholder="搜尋產品..."
                    onChange={handleSearchChange}
                />
            </Form.Group>
        </Form>
    );
}

export default SearchBar;
