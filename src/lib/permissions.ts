export type UserRole = 'SUPER_ADMIN' | 'BENDAHARA' | 'SEKRETARIS' | 'PENGURUS' | 'MARBOT';

type Permission = string;

const rolePermissions: Record<UserRole, Permission[]> = {
  SUPER_ADMIN: ['*'],
  BENDAHARA: ['keuangan:read', 'keuangan:write', 'laporan:read', 'donasi:read', 'donasi:write', 'zis:read'],
  SEKRETARIS: ['jamaah:read', 'jamaah:write', 'agenda:read', 'agenda:write', 'pengumuman:read', 'pengumuman:write', 'inventaris:read', 'laporan:read'],
  PENGURUS: ['agenda:read', 'agenda:write', 'zis:read', 'zis:write', 'qurban:read', 'qurban:write', 'tpq:read', 'tpq:write', 'pengumuman:read'],
  MARBOT: ['operasional:read', 'operasional:write', 'inventaris:read', 'jadwal:read'],
};

export function hasPermission(role: UserRole, permission: string): boolean {
  const perms = rolePermissions[role] || [];
  if (perms.includes('*')) return true;
  return perms.includes(permission);
}

export function canAccessRoute(role: UserRole, route: string): boolean {
  if (role === 'SUPER_ADMIN') return true;
  const routePermissionMap: Record<string, Permission[]> = {
    '/keuangan': ['keuangan:read'],
    '/jadwal': ['jadwal:read'],
    '/agenda': ['agenda:read'],
    '/jamaah': ['jamaah:read'],
    '/zis': ['zis:read', 'keuangan:read'],
    '/qurban': ['qurban:read'],
    '/pengumuman': ['pengumuman:read'],
    '/inventaris': ['inventaris:read', 'operasional:read'],
    '/operasional': ['operasional:read'],
    '/tpq': ['tpq:read'],
    '/pengaturan': ['*'],
  };
  for (const [prefix, requiredPerms] of Object.entries(routePermissionMap)) {
    if (route.startsWith(prefix)) {
      return requiredPerms.some(p => hasPermission(role, p)) || hasPermission(role, '*');
    }
  }
  return true; // default allow for beranda etc
}

export function getAccessibleRoutes(role: UserRole): string[] {
  const allRoutes = ['/', '/keuangan/transaksi', '/jadwal/sholat', '/agenda', '/jamaah', '/zis', '/qurban', '/pengumuman', '/inventaris', '/operasional', '/tpq', '/pengaturan'];
  return allRoutes.filter(r => canAccessRoute(role, r));
}