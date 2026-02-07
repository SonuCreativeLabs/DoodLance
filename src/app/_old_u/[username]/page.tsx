// @ts-nocheck
import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    MapPin,
    Star,
    Briefcase,
    Award,
    CheckCircle2,
    MessageCircle,
} from 'lucide-react';
import Link from 'next/link';

interface PageProps {
    params: {
        username: string;
    };
}

async function getFreelancerByUsername(username: string) {
    const user = await prisma.user.findUnique({
        where: { username: username.toLowerCase() },
        include: {
            freelancerProfile: {
                include: {
                    achievements: true,
                    reviews: true,
                },
            },
        },
    });

    return user;
}

export async function generateMetadata({ params }: PageProps) {
    const user = await getFreelancerByUsername(params.username);

    if (!user || !user.freelancerProfile) {
        return {
            title: 'User Not Found | DoodLance',
        };
    }

    return {
        title: `${user.name || user.username} - ${user.freelancerProfile.title || 'Freelancer'} | DoodLance`,
        description: user.freelancerProfile.about || `Hire ${user.name} on DoodLance`,
        openGraph: {
            title: user.name || user.username,
            description: user.freelancerProfile.about,
            images: user.avatar ? [user.avatar] : [],
        },
    };
}

export default async function PublicProfilePage({ params }: PageProps) {
    const user = await getFreelancerByUsername(params.username);

    if (!user || !user.freelancerProfile) {
        notFound();
    }

    const profile = user.freelancerProfile;
    const skills = profile.skills ? JSON.parse(profile.skills as string) : [];
    const avgRating = profile.rating || 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
            {/* Header */}
            <div className="border-b border-white/10">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="text-xl font-bold text-purple-400">
                            DoodLance
                        </Link>
                        <Link href="/login">
                            <Button variant="outline" className="border-white/20">
                                Sign In
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Profile Header */}
            <div className="bg-gradient-to-r from-purple-900/20  to-pink-900/20 border-b border-white/10">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-1">
                                <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-4xl font-bold">
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.name || user.username || ''}
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        user.name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase()
                                    )}
                                </div>
                            </div>
                            {user.isVerified && (
                                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1">
                                    <CheckCircle2 className="h-6 w-6 text-white" />
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold mb-2">{user.name || user.username}</h1>
                                    {user.displayId && (
                                        <p className="text-sm text-gray-400 mb-2">ID: {user.displayId}</p>
                                    )}
                                    <p className="text-lg text-purple-400 mb-4">{profile.title}</p>

                                    {user.location && (
                                        <div className="flex items-center gap-2 text-gray-400 mb-4">
                                            <MapPin className="h-4 w-4" />
                                            <span>{user.location}</span>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-6 mb-4">
                                        <div className="flex items-center gap-2">
                                            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                            <span className="font-semibold">{avgRating.toFixed(1)}</span>
                                            <span className="text-gray-400">
                                                ({profile.reviews ? profile.reviews.length : 0} reviews)
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Briefcase className="h-5 w-5 text-purple-400" />
                                            <span>{profile.completedJobs || 0} jobs completed</span>
                                        </div>
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <Link href={`/client/messages?freelancer=${user.id}`}>
                                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                                        <MessageCircle className="h-4 w-4 mr-2" />
                                        Contact Me
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* About */}
                        {profile.about && (
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <h2 className="text-2xl font-bold mb-4">About</h2>
                                <p className="text-gray-300 whitespace-pre-line">{profile.about}</p>
                            </div>
                        )}

                        {/* Skills */}
                        {skills.length > 0 && (
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <h2 className="text-2xl font-bold mb-4">Skills & Expertise</h2>
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill: string, index: number) => (
                                        <Badge
                                            key={index}
                                            variant="secondary"
                                            className="bg-purple-500/20 text-purple-300 border-purple-500/30"
                                        >
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Achievements */}
                        {profile.achievements && profile.achievements.length > 0 && (
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <Award className="h-6 w-6 text-purple-400" />
                                    Achievements
                                </h2>
                                <div className="space-y-6">
                                    {profile.achievements.map((exp: any) => (
                                        <div key={exp.id} className="border-l-2 border-purple-500/30 pl-4">
                                            <h3 className="font-semibold text-lg">{exp.title}</h3>
                                            <p className="text-purple-400">{exp.company}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}


                        {/* Reviews */}
                        {profile.reviews && profile.reviews.length > 0 && (
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <h2 className="text-2xl font-bold mb-6">Client Reviews</h2>
                                <div className="space-y-6">
                                    {profile.reviews.slice(0, 5).map((review: any) => (
                                        <div key={review.id} className="border-b border-white/10 pb-6 last:border-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-4 w-4 ${i < review.rating
                                                                ? 'text-yellow-400 fill-yellow-400'
                                                                : 'text-gray-600'
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-sm text-gray-400">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {review.comment && (
                                                <p className="text-gray-300">{review.comment}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Stats & Info */}
                    <div className="space-y-6">
                        {/* Stats Card */}
                        <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                            <h3 className="font-bold mb-4">Profile Stats</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-400">Member Since</p>
                                    <p className="font-semibold">
                                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                                            month: 'long',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Response Time</p>
                                    <p className="font-semibold">{profile.deliveryTime || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Availability</p>
                                    <p className="font-semibold">
                                        {profile.availability === 'Available' ? (
                                            <span className="text-green-400">Available Now</span>
                                        ) : (
                                            <span className="text-gray-400">{profile.availability || 'Not Available'}</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Verification Badge */}
                        {user.isVerified && (
                            <div className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 rounded-2xl p-6 border border-green-500/30">
                                <div className="flex items-center gap-3 mb-2">
                                    <CheckCircle2 className="h-6 w-6 text-green-400" />
                                    <h3 className="font-bold">Verified Freelancer</h3>
                                </div>
                                <p className="text-sm text-gray-300">
                                    This freelancer has been verified by DoodLance
                                </p>
                            </div>
                        )}

                        {/* Contact CTA */}
                        <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl p-6 border border-purple-500/30">
                            <h3 className="font-bold mb-3">Ready to hire?</h3>
                            <p className="text-sm text-gray-300 mb-4">
                                Send a message to discuss your project requirements
                            </p>
                            <Link href={`/client/messages?freelancer=${user.id}`}>
                                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                                    Get in Touch
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 mt-12">
                <div className="container mx-auto px-4 py-6 text-center text-gray-400">
                    <p>© 2024 DoodLance. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}
