import { CollectionConfig } from 'payload'
import { authenticatedOrPublished } from '../access/authenticatedOrPublished'
import { authenticated } from '../access/authenticated'
import { isProduction, isSuperAdmin } from '@/access/IsUserRole'

export const Comments: CollectionConfig = {
  slug: 'comments',
  admin: {
    defaultColumns: ['content', 'author', 'post', 'isApproved', 'createdAt'],
    description: 'Comments submitted by visitors on blog posts',
  },
  access: {
    read: isSuperAdmin || isProduction || authenticatedOrPublished,
    create: () => true,
    update: isSuperAdmin || isProduction,
    delete: isSuperAdmin || isProduction
  },
  fields: [
    {
      name: 'content',
      type: 'textarea',
      required: true,
      label: 'Comment',
      validate: (value: string | undefined) => {
        if (!value || value.length > 2000) return 'Comments cannot be longer than 2000 characters'
        return true
      }
    },
    {
      name: 'author',
      type: 'group',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          maxLength: 100
        },
        {
          name: 'email',
          type: 'email',
          required: true
        }
      ]
    },
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
      required: true,
      hasMany: false,
      admin: {
        position: 'sidebar'
      }
    },
    {
      name: 'isApproved',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Comments must be approved before they appear publicly'
      }
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime'
        }
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData.isApproved && !value) {
              return new Date()
            }
            return value
          }
        ]
      }
    }
  ],
  timestamps: true
}


