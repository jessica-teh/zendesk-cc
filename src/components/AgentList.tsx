import {AgentStatus, useAgents} from "../services/useAgents";
import _ from "lodash";
import {useEffect, useState} from "react";

enum FilterOption {
    NONE = 'None',
    AGENT_STATUS = 'Agent Status'
}

export function AgentList() {
    const { agents, isLoading, isError, error} = useAgents();
    const [selectedFilter, setSelectedFilter] = useState(FilterOption.NONE);
    const [filteredList, setFilteredList] = useState(agents);

    useEffect(() => {
        if (selectedFilter === FilterOption.AGENT_STATUS) {
            setFilteredList(_.sortBy(agents, ['profile']))
        } else {
            setFilteredList(agents);
        }
    },[agents, selectedFilter]);

    return (
        <div>
            <h1>Agent List</h1>
            <div className="filter-container">
                <form>
                    <label htmlFor='filter'>Filter by</label>
                    <select id='filter' value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value as FilterOption)}>
                        {Object.values(FilterOption).map(filterOption =>
                        <option key={filterOption}>{filterOption}</option>)}
                    </select>
                </form>
            </div>
            <div>
                {isLoading && <div>Loading...</div>}
                {isError && <div>{error?.message}</div>}
            </div>
            <div className="card-list">
                {!isLoading && filteredList?.map(agent => {
                    return <div className="agent-card" key={agent.first_name + agent.last_name}>
                        <div className="avatar-wrapper">
                            <img src={agent.avatar} alt="agent-avatar"/>
                        </div>
                        <div className="card-details">
                            <div><b>First Name:</b> {agent.first_name}</div>
                            <div><b>Last Name:</b> {agent.last_name}</div>
                            <div><b>Agent Status:</b> {_.capitalize(agent.profile)}</div>
                            <div><b>Status:</b> <span className={`status ${agent.status === AgentStatus.Online ? 'status-online' : ''}`}>{_.capitalize(agent.status)}</span></div>
                        </div>
                    </div>
                })}
            </div>
        </div>
    )
}