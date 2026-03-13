"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function EditResourcePage() {
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  const router = useRouter();
  const params = useParams();
  const resourceId = params?.id as string;

  useEffect(() => {
    async function loadResource() {
      if (!resourceId) return;
      
      const { data, error } = await supabase
        .from("resources")
        .select("*")
        .eq("id", resourceId)
        .single();
        
      if (error) {
        toast.error("Resource not found");
        router.push("/dashboard");
      } else if (data) {
        setTitle(data.title);
        setLink(data.link);
        setCategory(data.category || "");
        setExistingImageUrl(data.image_url || null);
      }
      setInitialLoading(false);
    }
    
    loadResource();
  }, [resourceId, router]);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let image_url = existingImageUrl;

      if (file) {
        const fileExt = file.name.split(".").pop();
        const fileName = `edit_${Math.random().toString(36).substring(2, 10)}_${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from("resource_images")
          .upload(fileName, file);
          
        if (uploadError) throw new Error("Image upload failed: " + uploadError.message);

        const { data: publicUrlData } = supabase.storage
          .from("resource_images")
          .getPublicUrl(fileName);
          
        image_url = publicUrlData.publicUrl;
      }

      const { error: updateError } = await supabase
        .from("resources")
        .update({
          title,
          link,
          category,
          image_url,
        })
        .eq("id", resourceId);

      if (updateError) throw new Error("Failed to update resource info: " + updateError.message);

      toast.success("Resource updated successfully! ✨");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return (
    <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>
  );

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard" className="text-sm font-semibold text-slate-500 hover:text-blue-600 flex items-center gap-1 w-fit transition-colors">
           <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>
      <Card className="shadow-xl rounded-2xl border-slate-100 dark:border-zinc-800 pb-2">
        <CardHeader className="bg-slate-50 dark:bg-zinc-900/50 rounded-t-2xl border-b border-slate-100 dark:border-zinc-800 mb-4 pb-6">
          <CardTitle className="text-2xl font-extrabold text-blue-900 dark:text-blue-400">Edit Resource</CardTitle>
          <CardDescription className="text-base font-medium">Update the details of your study material.</CardDescription>
        </CardHeader>
        <form onSubmit={handleEdit}>
          <CardContent className="space-y-5 px-8 pt-2">
            <div className="space-y-2">
              <Label htmlFor="title" className="font-semibold text-slate-700 dark:text-zinc-300">Title <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                className="h-11 rounded-xl bg-slate-50 dark:bg-zinc-900"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="link" className="font-semibold text-slate-700 dark:text-zinc-300">URL / Link <span className="text-red-500">*</span></Label>
              <Input
                id="link"
                type="url"
                className="h-11 rounded-xl bg-slate-50 dark:bg-zinc-900"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category" className="font-semibold text-slate-700 dark:text-zinc-300">Category</Label>
              <Input
                id="category"
                className="h-11 rounded-xl bg-slate-50 dark:bg-zinc-900"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image" className="font-semibold text-slate-700 dark:text-zinc-300">Thumbnail Image</Label>
              {existingImageUrl && !file && (
                <div className="mb-2 relative w-32 h-20 rounded-lg overflow-hidden border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={existingImageUrl} alt="Current thumbnail" className="w-full h-full object-cover" />
                </div>
              )}
              <Input
                id="image"
                type="file"
                accept="image/*"
                className="h-11 rounded-xl text-slate-600 dark:text-zinc-400 border-dashed border-2 cursor-pointer transition-all hover:border-blue-400 file:bg-blue-50 file:text-blue-700 file:border-0 file:rounded-lg file:px-4 file:mr-4 file:h-full dark:file:bg-blue-900/30 dark:file:text-blue-400"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <p className="text-xs text-slate-500">Choosing a new image will replace the current one.</p>
            </div>
          </CardContent>
          <CardFooter className="px-8 mt-2 pb-6">
            <Button className="w-full h-12 font-bold text-md rounded-xl shadow-md bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all" type="submit" disabled={loading}>
              {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Updating...</> : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
