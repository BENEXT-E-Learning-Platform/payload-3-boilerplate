import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

import { isManager, isSuperAdmin, isSuperAdminOrManager } from '@/access/IsUserRole'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {

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
    afterChange: [revalidateFooter],
  },
}
