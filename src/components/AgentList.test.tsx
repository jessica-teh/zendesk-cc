import React from 'react';
import {fireEvent, render, screen, within} from '@testing-library/react';
import {AgentList} from "./AgentList";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import { useQuery } from '@tanstack/react-query';
import _ from "lodash";

// Cast `useQuery` to a mock function
jest.mock('@tanstack/react-query', () => ({
    ...jest.requireActual('@tanstack/react-query'),
    useQuery: jest.fn(),
}));
const mockedUseQuery = useQuery as jest.Mock;

const mockedAgents = [
    {
        "first_name": "Andy",
        "last_name": "Dwyer",
        "status": "offline",
        "profile": "agent",
        "avatar": "https://static1.personality-database.com/profile_images/639f9049c5554c6dbad3fc1a830d63c7.png"
    },
    {
        "first_name": "April",
        "last_name": "Ludgate",
        "status": "online",
        "profile": "agent",
        "avatar": "https://static1.personality-database.com/profile_images/595d80646c4a4ce19f9637859e348111.png"
    },
];

const queryClient = new QueryClient();

function renderComponent() {
    render(
        <QueryClientProvider client={queryClient}>
            <AgentList />
        </QueryClientProvider>
    );
}

describe('Agent List Component', () => {
    test('renders agent list', () => {
        mockedUseQuery.mockReturnValue({
            data: [],
            isLoading: false,
            isError: false,
            error: null,
        });

        renderComponent();

        const title = screen.getByText('Agent List');
        expect(title).toBeInTheDocument();

        const listEl = screen.getByTestId('agent-list');
        expect(listEl).toBeInTheDocument();

    });

    test('renders agents from API with all data points', () => {
        // Use a mock agent returned as data by the API
        mockedUseQuery.mockReturnValue({
            data: [mockedAgents[0]],
            isLoading: false,
            isError: false,
            error: null,
        });

        renderComponent();

        const firstNameEl = screen.getByTestId('agent-first_name');
        const lastNameEl = screen.getByTestId('agent-last_name');
        const profileEl = screen.getByTestId('agent-profile');
        const statusEl = screen.getByTestId('agent-status');
        const avatarEl = screen.getByTestId('agent-avatar');

        expect(firstNameEl).toBeInTheDocument();
        expect(firstNameEl).toHaveTextContent(mockedAgents[0].first_name);
        expect(lastNameEl).toBeInTheDocument();
        expect(lastNameEl).toHaveTextContent(mockedAgents[0].last_name);
        expect(statusEl).toBeInTheDocument();
        expect(statusEl).toHaveTextContent(_.capitalize(mockedAgents[0].status));
        // Check the Online status has the class to make the font color green
        expect(within(statusEl).getByText('Online')).toHaveClass('status-online');

        expect(profileEl).toBeInTheDocument();
        expect(profileEl).toHaveTextContent(_.capitalize(mockedAgents[0].profile));
        expect(avatarEl).toBeInTheDocument();
        expect(avatarEl).toHaveAttribute('src', mockedAgents[0].avatar);
        expect(avatarEl).toHaveAttribute('alt', `${mockedAgents[0].first_name} ${mockedAgents[0].last_name}`);
    });

    test('renders loading state', () => {
        mockedUseQuery.mockReturnValue({
            data: [],
            isLoading: true,
            isError: false,
            error: null,
        });

        renderComponent();
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('renders error state', () => {
        mockedUseQuery.mockReturnValue({
            data: [],
            isLoading: false,
            isError: true,
            error: {message: '501 Service Error'},
        });

        renderComponent();
        expect(screen.getByText('501 Service Error. Please try again later.')).toBeInTheDocument();
    });

    test('use can filter by Agent Status', () => {
        mockedUseQuery.mockReturnValue({
            data: mockedAgents,
            isLoading: false,
            isError: false,
            error: null,
        });

        renderComponent();
        // No filter so all agents displayed
        expect(screen.getByText('April')).toBeInTheDocument();
        expect(screen.getByText('Andy')).toBeInTheDocument();

        const agentFilterSelect = screen.getByTestId('agent-filter');
        expect(agentFilterSelect).toBeInTheDocument();
        fireEvent.change(agentFilterSelect, { target: { value: 'online' } });

        // Only April is online, so Andy should be filtered out
        expect(screen.getByText('April')).toBeInTheDocument();
        expect(screen.queryByText('Andy')).not.toBeInTheDocument();
    });
});