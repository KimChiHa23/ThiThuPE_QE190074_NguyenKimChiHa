"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { Edit, Plus, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function DashboardPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResources = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        toast.error("Failed to load your resources");
      } else {
        setResources(data || []);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleDelete = async (id: string, imageUrl: string | null) => {
    const { error } = await supabase.from("resources").delete().eq("id", id);
    if (error) {
      toast.error(`Error deleting resource: ${error.message}`);
    } else {
      toast.success("Resource deleted successfully!");
      if (imageUrl) {
        const filePath = imageUrl.split("/").pop(); // Super basic extraction, usually want to store filePath
        if (filePath) {
           await supabase.storage.from("resource_images").remove([filePath]);
        }
      }
      fetchResources(); // Refresh list after deleting
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-20">
      <Loader2 className="animate-spin text-blue-500 w-8 h-8" />
    </div>
  );

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-indigo-700 to-blue-500">My Resources</h1>
          <p className="text-muted-foreground mt-2 text-sm font-medium">Manage your personal links and study materials.</p>
        </div>
        <Link href="/dashboard/add">
          <Button className="flex items-center gap-2 shadow hover:shadow-lg transition-all active:scale-95 bg-blue-600 hover:bg-blue-700">
            <Plus className="w-5 h-5" /> Add New Resource
          </Button>
        </Link>
      </div>

      {resources.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 rounded-3xl">
          <p className="text-lg text-slate-500 dark:text-zinc-400 mb-6 font-medium">You haven't added any resources yet.</p>
          <Link href="/dashboard/add">
            <Button size="lg" className="rounded-full shadow-md font-semibold px-8"><Plus className="w-4 h-4 mr-2"/> Add your first resource</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <Card key={resource.id} className="group overflow-hidden border-slate-200 dark:border-zinc-800 hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-3 border-b bg-slate-50/50 dark:bg-zinc-900/50 flex flex-col items-start gap-2">
                {resource.category && (
                  <Badge variant="secondary" className="text-xs px-2.5 font-semibold text-blue-700 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 pointer-events-none">{resource.category}</Badge>
                )}
                <CardTitle className="text-xl line-clamp-1 w-full" title={resource.title}>{resource.title}</CardTitle>
              </CardHeader>
              
              <CardContent className="p-0 border-b border-slate-100 dark:border-zinc-800">
                {resource.image_url ? (
                  <div className="w-full h-[180px] relative overflow-hidden group-hover:opacity-95 transition-opacity bg-slate-100 dark:bg-zinc-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={resource.image_url} alt={resource.title || ""} className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105" />
                  </div>
                ) : (
                  <div className="w-full h-[180px] bg-slate-50 dark:bg-zinc-800/50 flex items-center justify-center flex-col text-slate-400">
                     <ImageIcon className="w-10 h-10 opacity-30 mb-3" />
                     <span className="text-sm font-medium">No Preview Image</span>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex justify-between items-center gap-3 p-4 bg-white dark:bg-zinc-950">
                  <Link href={`/dashboard/edit/${resource.id}`} className="w-full">
                    <Button variant="outline" className="w-full flex justify-center items-center gap-2 font-semibold">
                      <Edit className="w-4 h-4" /> Edit
                    </Button>
                  </Link>

                  <AlertDialog>
                    <AlertDialogTrigger 
                      render={
                        <Button variant="destructive" className="flex items-center justify-center font-medium px-4 flex-shrink-0 shadow-sm hover:shadow active:scale-95 transition-all" />
                      }
                    >
                      <Trash2 className="w-4 h-4" />
                    </AlertDialogTrigger>
                    <AlertDialogContent className="sm:max-w-[425px] rounded-2xl">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete this resource from our database.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="font-semibold rounded-lg">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(resource.id, resource.image_url)} className="font-semibold bg-red-600 hover:bg-red-700 rounded-lg text-white">Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
