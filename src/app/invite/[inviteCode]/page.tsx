import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";

interface InviteCodePageProps {
    params: Promise<{
        inviteCode: string;
    }>;
}

const InviteCodePage = async ({ params }: InviteCodePageProps) => {
    // Ensure user is logged in and has a profile
    const profile = await initialProfile();
    const { inviteCode } = await params;

    if (!inviteCode) {
        return redirect("/");
    }

    // Check if user is already a member of the server with this invite code
    const existingServer = await db.server.findFirst({
        where: {
            inviteCode: inviteCode,
            members: {
                some: {
                    profileId: profile.id,
                },
            },
        },
    });

    // If already a member, redirect directly to that server
    if (existingServer) {
        return redirect(`/servers/${existingServer.id}`);
    }

    // Find the server by invite code and add user as a member
    const server = await db.server.findFirst({
        where: {
            inviteCode: inviteCode,
        },
    });

    if (!server) {
        return redirect("/");
    }

    // Add the user as a new member (GUEST role by default)
    const updatedServer = await db.server.update({
        where: {
            id: server.id,
        },
        data: {
            members: {
                create: [
                    {
                        profileId: profile.id,
                    },
                ],
            },
        },
    });

    if (updatedServer) {
        return redirect(`/servers/${updatedServer.id}`);
    }

    return redirect("/");
};

export default InviteCodePage;
