export function checkPermission(permission) {
  return (req, res, next) => {
    const user = req.user; // assuming you've added user from auth middleware

    if (!user || !user.permissions.includes(permission)) {
      return res.status(403).json({ message: 'Access Denied: insufficient permissions' });
    }

    next();
  };
}