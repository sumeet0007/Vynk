"use client";

import axios from "axios";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileUpload } from "@/components/file-upload";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Server name is required.",
    }),
    imageUrl: z.string().min(1, {
        message: "Server image is required.",
    }),
});

export const InitialModal = () => {
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imageUrl: "",
        },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.post("/api/servers", values);
            form.reset();
            router.refresh();
            window.location.reload();
        } catch (error) {
            console.log(error);
        }
    };

    if (!isMounted) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-[#1E1F22]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin" />
                    <p className="text-sm text-zinc-400">Setting up your workspace...</p>
                </div>
            </div>
        );
    }

    return (
        /* Full-screen overlay — works perfectly on all screen sizes */
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="w-full max-w-md bg-white dark:bg-[#313338] rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="px-6 pt-8 pb-4 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-indigo-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 12h14M12 5l7 7-7 7"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-black dark:text-white">
                        Customize your server
                    </h2>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                        Give your server a personality with a name and an image.
                        You can always change it later.
                    </p>
                </div>

                {/* Form */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="px-6 space-y-6 pb-2">
                            {/* Image Upload */}
                            <div className="flex items-center justify-center">
                                <FormField
                                    control={form.control}
                                    name="imageUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <FileUpload
                                                    endpoint="serverImage"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-center" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Server Name */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="uppercase text-xs font-bold tracking-wider text-zinc-500 dark:text-zinc-400">
                                            Server Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                className="bg-zinc-200/70 dark:bg-zinc-700/50 border-0 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-0 text-black dark:text-white placeholder:text-zinc-400 rounded-lg h-11"
                                                placeholder="Enter server name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 mt-4 bg-gray-100 dark:bg-[#2B2D31] flex flex-col sm:flex-row gap-2 sm:justify-end">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-600 text-white font-semibold h-11 rounded-lg transition-all duration-200 disabled:opacity-50"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Creating...
                                    </span>
                                ) : (
                                    "Create Server"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};
