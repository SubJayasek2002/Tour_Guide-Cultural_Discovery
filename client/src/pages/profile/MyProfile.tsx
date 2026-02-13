import { Profile} from "../../components/profile/Profile";
import { ProfileInfo } from "../../components/profile/ProfileInfo";
import { FavoriteDestinations } from "../../components/profile/FavDestinations";
import { FavoriteEvents } from "../../components/profile/FavEvents";
import { MyReviews } from "../../components/profile/MyReviews";

const MyProfile = () => {
  return (
    <div className="p-6 space-y-8">
      <ProfileInfo />
      <FavoriteDestinations />
      <FavoriteEvents />
      <MyReviews />
    </div>
  );
};

export default Profile;
