import type { User } from "../../types/index";

const ProfileInfo = () => {
  const user: User = JSON.parse(localStorage.getItem("user")!);

  return (
    <div className="border p-4 rounded">
      <h2 className="text-xl font-bold">
        {user.firstName} {user.lastName}
      </h2>
      <p>{user.email}</p>
      
    </div>
  );
};

export default ProfileInfo;
