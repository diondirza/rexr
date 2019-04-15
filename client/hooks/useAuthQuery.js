import { useQuery } from 'graphql-hooks';
import { get } from 'lodash';

const AuthQuery = `
query Authentication {
  user: viewer {
    id
    login
    name
  }
}
`;

export default function useAuthQuery() {
  const { loading, error, data } = useQuery(AuthQuery);

  return {
    error,
    isAuth: Boolean(get(data, 'user.id')),
    loading,
    user: data?.user || null,
  };
}
