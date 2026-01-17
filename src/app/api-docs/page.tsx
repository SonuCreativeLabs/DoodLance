'use client';

import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">Loading API Documentation...</div>
});

const apiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'BAILS API',
    version: '1.0.0',
    description: 'Complete API documentation for BAILS platform',
    contact: {
      name: 'BAILS Support',
      email: 'support@bails.in',
    },
  },
  servers: [
    {
      url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      description: 'Development server',
    },
  ],
  tags: [
    { name: 'Authentication', description: 'User authentication endpoints' },
    { name: 'Users', description: 'User management endpoints' },
    { name: 'Services', description: 'Service management endpoints' },
    { name: 'Bookings', description: 'Booking management endpoints' },
    { name: 'Payments', description: 'Payment processing endpoints' },
    { name: 'Admin', description: 'Admin panel endpoints' },
  ],
  paths: {
    '/api/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password', 'name', 'role'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', minLength: 8 },
                  name: { type: 'string' },
                  role: { type: 'string', enum: ['client', 'freelancer'] },
                  phone: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'User successfully registered',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: { $ref: '#/components/schemas/User' },
                    token: { type: 'string' },
                  },
                },
              },
            },
          },
          '400': { description: 'Invalid input' },
          '409': { description: 'User already exists' },
        },
      },
    },
    '/api/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Login user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: { $ref: '#/components/schemas/User' },
                    accessToken: { type: 'string' },
                    refreshToken: { type: 'string' },
                  },
                },
              },
            },
          },
          '401': { description: 'Invalid credentials' },
        },
      },
    },
    '/api/auth/refresh': {
      post: {
        tags: ['Authentication'],
        summary: 'Refresh access token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['refreshToken'],
                properties: {
                  refreshToken: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Token refreshed',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    accessToken: { type: 'string' },
                  },
                },
              },
            },
          },
          '401': { description: 'Invalid refresh token' },
        },
      },
    },
    '/api/users/profile': {
      get: {
        tags: ['Users'],
        summary: 'Get user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'User profile',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
          '401': { description: 'Unauthorized' },
        },
      },
      put: {
        tags: ['Users'],
        summary: 'Update user profile',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  phone: { type: 'string' },
                  bio: { type: 'string' },
                  location: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Profile updated',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' },
              },
            },
          },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/api/services': {
      get: {
        tags: ['Services'],
        summary: 'List all services',
        parameters: [
          {
            name: 'category',
            in: 'query',
            schema: { type: 'string' },
            description: 'Filter by category',
          },
          {
            name: 'location',
            in: 'query',
            schema: { type: 'string' },
            description: 'Filter by location',
          },
          {
            name: 'page',
            in: 'query',
            schema: { type: 'integer', default: 1 },
            description: 'Page number',
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', default: 10 },
            description: 'Items per page',
          },
        ],
        responses: {
          '200': {
            description: 'List of services',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    services: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Service' },
                    },
                    pagination: { $ref: '#/components/schemas/Pagination' },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Services'],
        summary: 'Create a new service',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'description', 'category', 'price'],
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  category: { type: 'string' },
                  price: { type: 'number' },
                  duration: { type: 'integer' },
                  location: { type: 'string' },
                  tags: { type: 'array', items: { type: 'string' } },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Service created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Service' },
              },
            },
          },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/api/bookings': {
      get: {
        tags: ['Bookings'],
        summary: 'Get user bookings',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'status',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['pending', 'confirmed', 'completed', 'cancelled']
            },
          },
        ],
        responses: {
          '200': {
            description: 'List of bookings',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Booking' },
                },
              },
            },
          },
          '401': { description: 'Unauthorized' },
        },
      },
      post: {
        tags: ['Bookings'],
        summary: 'Create a new booking',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['serviceId', 'date', 'time'],
                properties: {
                  serviceId: { type: 'string' },
                  date: { type: 'string', format: 'date' },
                  time: { type: 'string' },
                  notes: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Booking created',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Booking' },
              },
            },
          },
          '401': { description: 'Unauthorized' },
        },
      },
    },
    '/api/admin/dashboard/stats': {
      get: {
        tags: ['Admin'],
        summary: 'Get dashboard statistics',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Dashboard statistics',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    totalUsers: { type: 'integer' },
                    totalBookings: { type: 'integer' },
                    totalRevenue: { type: 'number' },
                    activeServices: { type: 'integer' },
                  },
                },
              },
            },
          },
          '401': { description: 'Unauthorized' },
          '403': { description: 'Forbidden - Admin only' },
        },
      },
    },
  },
  components: {
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          email: { type: 'string', format: 'email' },
          name: { type: 'string' },
          role: { type: 'string', enum: ['client', 'freelancer', 'admin'] },
          phone: { type: 'string' },
          isVerified: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Service: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          category: { type: 'string' },
          price: { type: 'number' },
          duration: { type: 'integer' },
          location: { type: 'string' },
          providerId: { type: 'string' },
          rating: { type: 'number' },
          status: { type: 'string', enum: ['active', 'inactive', 'pending'] },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Booking: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          serviceId: { type: 'string' },
          clientId: { type: 'string' },
          providerId: { type: 'string' },
          date: { type: 'string', format: 'date' },
          time: { type: 'string' },
          status: { type: 'string', enum: ['pending', 'confirmed', 'completed', 'cancelled'] },
          totalAmount: { type: 'number' },
          notes: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Pagination: {
        type: 'object',
        properties: {
          page: { type: 'integer' },
          limit: { type: 'integer' },
          total: { type: 'integer' },
          pages: { type: 'integer' },
        },
      },
    },
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 bg-gray-900 text-white">
        <h1 className="text-2xl font-bold">BAILS API Documentation</h1>
        <p className="text-gray-300 mt-1">Complete API reference for developers</p>
      </div>
      <SwaggerUI spec={apiSpec} />
    </div>
  );
}
