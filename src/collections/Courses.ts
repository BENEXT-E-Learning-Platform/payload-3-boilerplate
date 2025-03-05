import { authenticated } from '@/access/authenticated';
import { Instructor } from '@/payload-types';
import { CollectionConfig, Block } from 'payload';

// Define Content Item Blocks
const VideoContentBlock: Block = {
  slug: 'videoContent',
  labels: {
    singular: 'Video Content',
    plural: 'Video Contents',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Video Title',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Video Description',
    },
    {
      name: 'videoFile',
      type: 'upload',
      required: true,
      relationTo: 'media',
      label: 'Video File',
    },
    {
      name: 'duration',
      type: 'number',
      label: 'Duration (seconds)',
    },
  ],
};

const PDFContentBlock: Block = {
  slug: 'pdfContent',
  labels: {
    singular: 'PDF Content',
    plural: 'PDF Contents',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'PDF Title',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'PDF Description',
    },
    {
      name: 'pdfFile',
      type: 'upload',
      required: true,
      relationTo: 'media',
      label: 'PDF File',
    },
  ],
};

const ExcelContentBlock: Block = {
  slug: 'excelContent',
  labels: {
    singular: 'Excel Content',
    plural: 'Excel Contents',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Excel Title',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Excel Description',
    },
    {
      name: 'excelFile',
      type: 'upload',
      required: true,
      relationTo: 'media',
      label: 'Excel File',
    },
  ],
};

const DocContentBlock: Block = {
  slug: 'docContent',
  labels: {
    singular: 'Document Content',
    plural: 'Document Contents',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Document Title',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Document Description',
    },
    {
      name: 'docFile',
      type: 'upload',
      required: true,
      relationTo: 'media',
      label: 'Document File',
    },
  ],
};

const ImageContentBlock: Block = {
  slug: 'imageContent',
  labels: {
    singular: 'Image Content',
    plural: 'Image Contents',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Image Title',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Image Description',
    },
    {
      name: 'imageFile',
      type: 'upload',
      required: true,
      relationTo: 'media',
      label: 'Image File',
    },
  ],
};

// Define content blocks array
const contentBlocks: Block[] = [
  VideoContentBlock,
  PDFContentBlock,
  ExcelContentBlock,
  DocContentBlock,
  ImageContentBlock,
];

// Interface definitions
interface Lesson {
  id: string;
  title: string;
  description?: string;
  order: number;
  contentItems: {
    blockType: string;
    [key: string]: any; // Dynamic fields based on block type
  }[];
  comments?: (string | Comment)[]; // Only approved comments

}


interface Section {
  id: string;
  title: string;
  description?: string;
  order: number;
  lessons: Lesson[];
}

interface Comment {
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

export const Courses: CollectionConfig = {
  slug: 'courses',
  admin: {
    useAsTitle: 'title',
    description: 'Create and manage courses for the LMS',
  },
  access: {
    read: () => true,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Course Title',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Course Description',
    },
    {
      name: 'instructor',
      type: 'relationship',
      relationTo: 'instructors',
      required: true,
      label: 'Instructor',
      admin: {
        description: 'Select the instructor for this course',
      },
    },
    {
      name: 'sections',
      type: 'array',
      label: 'Sections',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Section Title',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Section Description',
        },
        {
          name: 'order',
          type: 'number',
          required: true,
          defaultValue: 0,
          label: 'Section Order',
        },
        {
          name: 'lessons',
          type: 'array',
          label: 'Lessons',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              label: 'Lesson Title',
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Lesson Description',
            },
            {
              name: 'order',
              type: 'number',
              required: true,
              defaultValue: 0,
              label: 'Lesson Order',
            },
            {
              name: 'contentItems',
              type: 'blocks',
              label: 'Content Items',
              blocks: contentBlocks,
            },
            {
              name: 'comments',
              type: 'relationship',
              relationTo: 'comments',
              hasMany: true,
              label: 'Comments',
              filterOptions: {
                status: { equals: 'approved' }, // Only show approved comments
              },
              admin: {
                readOnly: true,
                description: 'Approved comments for this lesson (managed in Comments collection)',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      access: {
        update: () => false,
      },
      admin: {
        readOnly: true,
      },
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

// Course Interface
export interface Course {
  id: string;
  title: string;
  description?: string;
  instructor: string | Instructor; // Can be ID or full Instructor object
  sections: Section[];
  createdBy: string | { id: string };
  createdAt: string;
  updatedAt: string;
}