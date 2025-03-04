import { Course } from '@/payload-types';
import { CollectionConfig } from 'payload';

// Comments Collection
export const Comments: CollectionConfig = {
  slug: 'comments',
  admin: {
    useAsTitle: 'content',
    description: 'User comments on lessons (pending approval)',
  },
  access: {
    // Anyone logged in can create comments
    create: ({ req: { user } }) => !!user,
    // Only approved comments are readable by non-admins; admins see all
    read: ({ req: { user }, data }) => {
      if (user?.role === 'admin') return true; // Admins see all comments
      return data?.status === 'approved'; // Non-admins see only approved
    },
    // Only admins can update status; authors can edit content if pending
    update: ({ req: { user }, data }) => {
      if (user?.role === 'admin') return true; // Admins can update anything
      if (user?.id === data.createdBy && data.status === 'pending') return true; // Authors can edit pending comments
      return false;
    },
    // Only admins or comment authors can delete (if pending)
    delete: ({ req: { user }, data }) => {
      if (user?.role === 'admin') return true;
      return user?.id === data.createdBy && data.status === 'pending';
    },
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

// Updated Comment Interface
export interface Comment {
  id: string;
  content: string;
  course: string | Course;
  lessonPath: string;
  status: 'pending' | 'approved';
  createdBy: string | { id: string };
  postedAt?: string;
  createdAt: string;
  updatedAt: string;
}