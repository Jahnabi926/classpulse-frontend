import { useSelector } from "react-redux";

const Profile = () => {
  const user = useSelector((store) => store.user);
  return (
    user && (
      <div className="flex justify-center my-12">
        <div className="card w-96 bg-neutral text-neutral-content shadow-lg">
          <div className="card-body">
            <div className="flex justify-between mb-6">
              <div className="font-bold text-lg">
                {user.firstName} {user.lastName}
              </div>
              <div className="badge badge-outline capitalize">{user.role}</div>
            </div>
            <div className="opacity-70 mb-4">{user.emailId}</div>
            <div className="text-xs opacity-50">
              Member since {new Date(user.createdAt).getFullYear()}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Profile;
