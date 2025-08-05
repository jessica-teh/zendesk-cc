import {useQuery} from "@tanstack/react-query";

export enum AgentStatus {Online = 'online', Offline = 'offline'}

export type AgentProfileType = 'admin' | 'agent';

export interface Agent {
    first_name: string;
    last_name: string;
    status: AgentStatus;
    profile: AgentProfileType;
    avatar: string;
}

interface AgentsResponse {
    agents?: Agent[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
}

export function useAgents(): AgentsResponse {
    const fetchAgents = async (): Promise<Agent[] | undefined> => {
        const response = await fetch("https://3nzfzc8au7.execute-api.us-east-1.amazonaws.com/default/agents")
        if (!response.ok) {
            throw new Error("Failed to fetch agents");
        }
        const json: AgentsResponse = await response.json();

        let agents = json.agents;

        if (agents) {
            agents.sort(function(a, b) {
                if (a.status === AgentStatus.Online && b.status !== AgentStatus.Online) return -1;
                if (a.status !== AgentStatus.Online && b.status === AgentStatus.Online) return 1;
                return a.first_name.localeCompare(b.first_name);
            });
        }

        return agents;
    }

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ['agents'],
        queryFn: fetchAgents,
    });

    return {
        agents: data,
        isLoading,
        isError,
        error
    };
}
