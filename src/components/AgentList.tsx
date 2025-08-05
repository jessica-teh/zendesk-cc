import {useAgents} from "../services/useAgents";

export function AgentList() {
    const { agents, isLoading, isError, error} = useAgents();
    const filterOptions = ['None', 'Agent Status'];

    return (
        <div>
            {isLoading && <div>Loading...</div>}
            {isError && <div>{error?.message}</div>}
            <div>
                <div>
                    <div>
                        <label>Filter by:</label>
                        <select>
                            {filterOptions.map(filterOption =>
                            <option key={filterOption}>{filterOption}</option>)}
                        </select>
                    </div>
                </div>
                {!isLoading && agents?.map(agent => {
                    return <div className="flex" key={agent.first_name + agent.last_name}>
                        <div>
                            <img src={agent.avatar} alt="agent-avatar"/>
                        </div>
                        <div>
                            <div className="text-4xl font-bold"><span>First Name:</span> {agent.first_name}</div>
                            <div><span>Last Name:</span> {agent.last_name}</div>
                            <div><span>Status:</span> {agent.status}</div>
                            <div><span>Agent Status:</span> {agent.profile}</div>
                        </div>
                    </div>
                })}
            </div>
        </div>
    )
}