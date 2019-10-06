exports.userDto = (user) => ({
  id: user._id,
  email: user.email,
  name: user.name,
  phone: user.phone,
  address: user.address,
  password: user.password
});
