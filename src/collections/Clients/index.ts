import type { CollectionConfig } from 'payload'
import { isSuperAdmin, isInternalUser } from '@/access/IsUserRole';

const Clients: CollectionConfig = {
  slug: 'clients',
  admin: {
    useAsTitle: 'email',
    group: 'Client Management',
  },
  access: {
    read: isInternalUser,
    create: isSuperAdmin,
    update: isSuperAdmin,
    delete: isSuperAdmin,
  },
  auth: true,
  fields: [
    // Core shared fields
    {
      name: 'accountType', 
      type: 'select',
      required: true,
      options: [
        { label: 'Individual', value: 'individual' },
        { label: 'Business', value: 'business' },
      ],
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    
    // Address - shared format for both account types
    {
      name: 'address',
      type: 'group',
      fields: [
        { name: 'street', type: 'text', required: true },
        { name: 'city', type: 'text', required: true },
        { name: 'state', type: 'text', required: true },
        { name: 'zipCode', type: 'text', required: true },
        { name: 'country', type: 'text', required: true },
      ],
    },
    
    // Individual-specific fields
    {
      name: 'firstName',
      type: 'text',
      admin: {
        condition: (data) => data.accountType === 'individual',
      },
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      admin: {
        condition: (data) => data.accountType === 'individual',
      },
      required: true,
    },
    {
      name: 'dateOfBirth',
      type: 'date',
      admin: {
        condition: (data) => data.accountType === 'individual',
      },
      required: true,
    },
    {
      name: 'idNumber',
      type: 'text',
      admin: {
        condition: (data) => data.accountType === 'individual',
        description: 'National ID, Passport, or Driver\'s License',
      },
      required: true,
    },
    
    // Business-specific fields
    {
      name: 'companyName',
      type: 'text',
      admin: {
        condition: (data) => data.accountType === 'business',
      },
      required: true,
    },
    {
      name: 'businessType',
      type: 'select',
      options: [
        { label: 'Corporation', value: 'corporation' },
        { label: 'LLC', value: 'llc' },
        { label: 'Partnership', value: 'partnership' },
        { label: 'Sole Proprietorship', value: 'sole_proprietorship' },
        { label: 'Non-Profit', value: 'non_profit' },
      ],
      admin: {
        condition: (data) => data.accountType === 'business',
      },
      required: true,
    },
    {
      name: 'taxId',
      type: 'text',
      admin: {
        condition: (data) => data.accountType === 'business',
        description: 'Business tax ID or registration number',
      },
      required: true,
    },
    {
      name: 'contactFirstName',
      type: 'text',
      admin: {
        condition: (data) => data.accountType === 'business',
        description: 'Primary contact first name',
      },
      required: true,
    },
    {
      name: 'contactLastName',
      type: 'text',
      admin: {
        condition: (data) => data.accountType === 'business',
        description: 'Primary contact last name',
      },
      required: true,
    },
    {
      name: 'contactPosition',
      type: 'text',
      admin: {
        condition: (data) => data.accountType === 'business',
        description: 'Primary contact position',
      },
      required: true,
    },
    {
      name: 'contactEmail',
      type: 'email',
      admin: {
        condition: (data) => data.accountType === 'business',
        description: 'Primary contact email',
      },
      required: true,
    },
    {
      name: 'contactPhone',
      type: 'text',
      admin: {
        condition: (data) => data.accountType === 'business',
        description: 'Primary contact phone',
      },
      required: true,
    },
    {
      name: 'numberOfEmployees',
      type: 'number',
      admin: {
        condition: (data) => data.accountType === 'business',
      },
      required: true,
    },
    
    // Sidebar and optional fields
    {
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        description: 'Internal user responsible for this client',
      },
    },
    {
      name: 'profileImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      required: false,
      admin: {
        description: 'Internal notes about this client',
        position: 'sidebar',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Is this client account active?',
        position: 'sidebar',
      },
    },
    {
      name: 'dateJoined',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ operation, value }) => {
            if (operation === 'create') {
              return new Date();
            }
            return value;
          },
        ],
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation, req }) => {
        // Add who created this client
        if (operation === 'create' && req.user) {
          data.assignedTo = req.user.id;
        }
        
        return data;
      },
    ],
  },
};

export default Clients;