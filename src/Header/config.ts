import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateHeader } from './hooks/revalidateHeader'
import { isManager, isSuperAdmin, isSuperAdminOrManager } from '@/access/IsUserRole'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    //read acess for manager and super admin
    read: isSuperAdminOrManager,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
