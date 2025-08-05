import React from 'react';
import { render, screen } from '@testing-library/react';
import {AgentList} from "./AgentList";

test('renders learn react link', () => {
    render(<AgentList/>);
    const linkElement = screen.getByText(/learn react/i);
    expect(linkElement).toBeInTheDocument();
});
