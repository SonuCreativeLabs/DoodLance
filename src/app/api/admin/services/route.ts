import { NextRequest, NextResponse } from 'next/server';
import { mockServices } from '@/lib/mock/services-data';

// Extended service type with additional dynamic properties
type ExtendedService = typeof mockServices[number] & {
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
  rejectedAt?: string;
  deactivatedReason?: string;
  isFlagged?: boolean;
  isFeatured?: boolean;
  flagReason?: string;
  flaggedAt?: string;
  unflaggedAt?: string;
  featuredAt?: string;
  featuredUntil?: string;
  unfeaturedAt?: string;
};

// Use mock services data with extended type
let services: ExtendedService[] = [...mockServices];

// GET /api/admin/services - Get all services with filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || 'all';
    const status = searchParams.get('status') || 'all';
    const active = searchParams.get('active') || 'all';

    // Filter services
    let filteredServices = [...services];
    
    if (search) {
      filteredServices = filteredServices.filter(service => 
        service.title.toLowerCase().includes(search.toLowerCase()) ||
        service.description.toLowerCase().includes(search.toLowerCase()) ||
        service.providerName.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    if (category !== 'all') {
      filteredServices = filteredServices.filter(service => service.category === category);
    }
    
    if (status !== 'all') {
      filteredServices = filteredServices.filter(service => service.status === status);
    }
    
    if (active !== 'all') {
      filteredServices = filteredServices.filter(service => 
        active === 'active' ? service.isActive : !service.isActive
      );
    }

    // Sort by created date (newest first)
    filteredServices.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedServices = filteredServices.slice(startIndex, endIndex);

    // Calculate stats
    const stats = {
      totalServices: services.length,
      activeServices: services.filter(s => s.isActive).length,
      pendingApproval: services.filter(s => s.status === 'pending').length,
      totalRevenue: services.reduce((sum, s) => sum + (s.price * s.totalOrders), 0),
      avgRating: (services.reduce((sum, s) => sum + s.rating, 0) / services.length).toFixed(1),
      totalOrders: services.reduce((sum, s) => sum + s.totalOrders, 0),
    };

    return NextResponse.json({
      services: paginatedServices,
      total: filteredServices.length,
      page,
      totalPages: Math.ceil(filteredServices.length / limit),
      stats
    });
  } catch (error) {
    console.error('Get services error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/services/:id - Update service
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { serviceId, updates } = body;

    const serviceIndex = services.findIndex(s => s.id === serviceId);
    if (serviceIndex === -1) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // Update service
    services[serviceIndex] = { 
      ...services[serviceIndex], 
      ...updates,
      updatedAt: new Date().toISOString()
    };

    // Log audit action
    console.log(`Service ${serviceId} updated:`, updates);

    return NextResponse.json({
      success: true,
      service: services[serviceIndex]
    });
  } catch (error) {
    console.error('Update service error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/admin/services/action - Perform service actions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serviceId, action, data } = body;

    const serviceIndex = services.findIndex(s => s.id === serviceId);
    if (serviceIndex === -1) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    switch (action) {
      case 'approve':
        services[serviceIndex].status = 'approved';
        services[serviceIndex].isActive = true;
        services[serviceIndex].approvedAt = new Date().toISOString();
        services[serviceIndex].approvedBy = 'Admin';
        break;
        
      case 'reject':
        services[serviceIndex].status = 'rejected';
        services[serviceIndex].isActive = false;
        services[serviceIndex].rejectionReason = data.reason;
        services[serviceIndex].rejectedAt = new Date().toISOString();
        break;
        
      case 'activate':
        services[serviceIndex].isActive = true;
        break;
        
      case 'deactivate':
        services[serviceIndex].isActive = false;
        services[serviceIndex].deactivatedReason = data.reason;
        break;
        
      case 'flag':
        services[serviceIndex].isFlagged = true;
        services[serviceIndex].flagReason = data.reason;
        services[serviceIndex].flaggedAt = new Date().toISOString();
        break;
        
      case 'unflag':
        services[serviceIndex].isFlagged = false;
        services[serviceIndex].unflaggedAt = new Date().toISOString();
        break;
        
      case 'feature':
        services[serviceIndex].isFeatured = true;
        services[serviceIndex].featuredAt = new Date().toISOString();
        services[serviceIndex].featuredUntil = data.until;
        break;
        
      case 'unfeature':
        services[serviceIndex].isFeatured = false;
        services[serviceIndex].unfeaturedAt = new Date().toISOString();
        break;
        
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    // Log audit action
    console.log(`Service action performed: ${action} on ${serviceId}`, data);

    return NextResponse.json({
      success: true,
      service: services[serviceIndex],
      message: `Service ${action} successful`
    });
  } catch (error) {
    console.error('Service action error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/services/:id - Delete service
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const serviceId = searchParams.get('id');

    if (!serviceId) {
      return NextResponse.json(
        { error: 'Service ID required' },
        { status: 400 }
      );
    }

    const serviceIndex = services.findIndex(s => s.id === serviceId);
    if (serviceIndex === -1) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      );
    }

    // Remove service
    const deletedService = services[serviceIndex];
    services = services.filter(s => s.id !== serviceId);

    // Log audit action
    console.log(`Service deleted: ${serviceId}`);

    return NextResponse.json({
      success: true,
      message: 'Service deleted',
      service: deletedService
    });
  } catch (error) {
    console.error('Delete service error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
