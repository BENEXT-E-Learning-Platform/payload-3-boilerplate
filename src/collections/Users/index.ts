import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { isSuperAdmin } from '@/access/IsUserRole'
import payload from 'payload'
import Clients from '@/collections/Clients'; // Adjust the import path as needed

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: isSuperAdmin,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      access: {
        create: authenticated,
        read: authenticated,
        update: authenticated,
      },
      options: [
        {
          label: 'Super Admin',
          value: 'superadmin',  
        },
        {
          label: 'Manager',
          value: 'manager',
        },
        {
          label: 'Production',
          value: 'production',
        },
        {
          label: 'Commerciale',
          value: 'commerciale',
        },
        {
          label: 'Marketing',
          value: 'marketing',
        },
      ],
    }
  ],
  timestamps: true,
  hooks: {
    afterOperation: [
      async ({ operation, req, result }) => {
        if (operation === 'create' && result) {
          try {
            console.log('Attempting to create client for user:', result.id);
            
            const clientData = {
              accountType: 'individual' as 'individual' | 'business',
              email: result.email,
              firstName: result.name?.split(' ')[0] || '',
              lastName: result.name?.split(' ').slice(1).join(' ') || '',
              phone: '', 
              address: {
                street: '',
                city: '',
                state: '',
                zipCode: '',
                country: ''
              },
              dateOfBirth: null,
              idNumber: '',
              assignedTo: result.id,
              isActive: true
            };
  
            console.log('Client data prepared:', clientData);
  
            // Verify available collections
            console.log('Available collections:', payload.collections);
  
            await payload.create({
              collection: 'clients',
              data: clientData,
              req: req
            });
            
            console.log('Client account created successfully');
          } catch (error) {
            console.error('Full error details:', error);
            // If error is an APIError, log its specific properties
            if (error instanceof Error) {
              console.error('Error name:', error.name);
              console.error('Error message:', error.message);
              console.error('Error stack:', error.stack);
            }
          }
        }
      }
    ]
  }
}