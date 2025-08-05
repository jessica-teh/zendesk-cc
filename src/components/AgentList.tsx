import {AgentStatus, useAgents} from "../services/useAgents";
import _ from "lodash";
import {useEffect, useState} from "react";

export function AgentList() {
    const { agents, isLoading, isError, error} = useAgents();
    const filterOptions = ['All', AgentStatus.Online, AgentStatus.Offline]
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [filteredList, setFilteredList] = useState(agents);

    // If the selected filter has changed, update the sorted list or return the original list
    useEffect(() => {
        if (selectedFilter === 'All') {
            setFilteredList(agents);
        } else {
            setFilteredList(agents?.filter(agent => agent.status === selectedFilter))
        }
    },[agents, selectedFilter]);

    return (
        <div>
            <h1>Agent List</h1>
            <div className="filter-container">
                <form>
                    <label htmlFor='agent-filter'>Filter by</label>
                    <select id='agent-filter'
                            value={selectedFilter}
                            onChange={(e) => setSelectedFilter(e.target.value)}
                            data-testid='agent-filter'>
                        {filterOptions.map(filterOption =>
                        <option key={filterOption} value={filterOption}>{_.capitalize(filterOption)}</option>)}
                    </select>
                </form>
            </div>
            <div>
                {isLoading && <div>Loading...</div>}
                {isError && <div>{error?.message}. Please try again later.</div>}
            </div>
            <div className="card-list" data-testid="agent-list">
                {!isLoading && filteredList?.map(agent => {
                    return <div className="agent-card"
                                key={agent.first_name + agent.last_name}
                                data-testid='agent-card'>
                        <div className="avatar-wrapper">
                            <img src={agent.avatar}
                                 alt={`${agent.first_name} ${agent.last_name}`}
                                 data-testid='agent-avatar'/>
                        </div>
                        <div className="card-details">
                            <div data-testid='agent-first_name'><b>First Name:</b> {agent.first_name}</div>
                            <div data-testid='agent-last_name'><b>Last Name:</b> {agent.last_name}</div>
                            <div data-testid='agent-profile'><b>Profile:</b> {_.capitalize(agent.profile)}</div>
                            <div data-testid='agent-status'><b>Status:</b>
                                <span className={`status ${agent.status === AgentStatus.Online ? 'status-online' : ''}`}>
                                    {_.capitalize(agent.status)}
                                </span>
                            </div>
                        </div>
                    </div>
                })}
            </div>
        </div>
    )
}