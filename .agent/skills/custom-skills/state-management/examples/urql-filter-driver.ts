import { create } from 'zustand';
import { useQuery, gql } from 'urql';

/**
 * SENIOR AI ENGINEER PATTERN: The Filter Driver
 * * Rule: Zustand holds the UI state (the filters). 
 * Urql takes those filters as variables and owns the actual data.
 */

// 1. The Zustand Store (UI/Filter State ONLY)
interface FilterState {
  status: 'active' | 'completed' | 'all';
  setStatus: (status: 'active' | 'completed' | 'all') => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  status: 'active',
  setStatus: (status) => set({ status }),
}));

// 2. The Urql Query
const GetProjectsQuery = gql`
  query GetProjects($status: String!) {
    projects(where: { status: { _eq: $status } }) {
      id
      name
      status
    }
  }
`;

// 3. The Component (The Driver)
export function ProjectList() {
  // We select the filter from our global UI state
  const status = useFilterStore((state) => state.status);

  // Urql automatically refetches when the Zustand 'status' changes.
  // The resulting data STAYS in Graphcache. It never enters Zustand.
  const [{ data, fetching, error }] = useQuery({
    query: GetProjectsQuery,
    variables: { status },
  });

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data?.projects.map((project: any) => (
        <li key={project.id}>{project.name}</li>
      ))}
    </ul>
  );
}