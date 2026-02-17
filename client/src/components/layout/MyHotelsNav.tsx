import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function MyHotelsNav() {
  const { user } = useAuth();
  if (!user || !user.roles?.includes('ROLE_HOTEL_OWNER')) return null;
  return (
    <Link to="/hotels/my-hotels" style={{ marginLeft: 16 }}>
      My Hotels
    </Link>
  );
}
