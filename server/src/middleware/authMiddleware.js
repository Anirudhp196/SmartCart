import prisma from '../config/prismaClient.js';

/**
 * Temporary auth shim: bypass JWT and always attach a default user.
 * This keeps routes working while login/sign-up are disabled.
 */
export const protect = async (req, res, next) => {
  const email = process.env.DEFAULT_USER_EMAIL || 'guest@smartcart.dev';
  const role = process.env.DEFAULT_USER_ROLE || 'SELLER';

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: 'disabled-auth',
      role,
      name: 'Guest',
      carts: role === 'BUYER' ? { create: {} } : undefined,
    },
  });

  req.user = user;
  next();
};

export const requireSeller = (req, res, next) => {
  if (req.user?.role !== 'SELLER') {
    return res.status(403).json({ message: 'Seller access required' });
  }
  next();
};
