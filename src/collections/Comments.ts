import { authenticated } from '@/access/authenticated';
import { CollectionConfig } from 'payload';

export const Comments: CollectionConfig = {
  slug: 'comments',
  admin: {
    useAsTitle: 'content',
    description: 'User comments on lessons (pending approval)',
  },
  access: {
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete:authenticated,
  },
  fields: [
    {
      name: 'content',
      type: 'textarea',
      required: true,
      label: 'Comment',
    },
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
      label: 'Course',
      admin: { description: 'The course containing the lesson' },
    },
    {
      name: 'lessonPath',
      type: 'text',
      required: true,
      label: 'Lesson Path',
      admin: { description: 'Path to the lesson (e.g., "sections[0].lessons[1]")' },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
      ],
      defaultValue: 'pending',
      required: true,
      label: 'Status',
      admin: { description: 'Set to Approved to publish the comment' },
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      access: { update: () => false },
      admin: { readOnly: true },
    },
    {
      name: 'postedAt',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
      defaultValue: () => new Date().toISOString(),
    },
  ],
  hooks: {
    beforeChange: [
      ({ req, data }) => {
        if (req.user && !data.createdBy) {
          data.createdBy = req.user.id;
        }
        return data;
      },
    ],
  },
};