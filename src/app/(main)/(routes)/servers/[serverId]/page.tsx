import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

interface ServerIdPageProps {
    params: Promise<{
        serverId: string;
    }>
}

const ServerIdPage = async ({ params }: ServerIdPageProps) => {
    const user = await currentUser();

    if (!user) {
        return redirect("/sign-in");
    }

    const { serverId } = await params;

    // Verify the user profile exists and is a member of this specific server
    const server = await db.server.findUnique({
        where: {
            id: serverId,
            members: {
                some: {
                    profile: {
                        userId: user.id
                    }
                }
            }
        },
        include: {
            channels: {
                where: {
                    name: "general"
                },
                orderBy: {
                    createdAt: "asc"
                }
            }
        }
    });

    if (!server) {
        return redirect("/");
    }

    // Usually, landing on a server immediately takes you to the 'general' channel
    const initialChannel = server.channels[0];
    if (initialChannel?.id !== "general") {
        return redirect(`/servers/${server.id}/channels/${initialChannel?.id}`);
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-discord-bg text-discord-text">
            <div className="flex flex-col text-center">
                <h1 className="text-3xl font-bold mb-4">Welcome to {server.name}!</h1>
                <p className="text-zinc-400">Your server ID is: {server.id}</p>
            </div>
        </div>
    );
}

export default ServerIdPage;
