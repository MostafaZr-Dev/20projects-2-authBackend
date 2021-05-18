exports.getUserData = (user) => {
  return {
    ID: user.user_id,
    displayName: `${user.first_name} ${user.last_name}`,
    email: user.email,
    phone: user.phone,
    firstName: user.first_name,
    lastName: user.last_name,
  };
};
