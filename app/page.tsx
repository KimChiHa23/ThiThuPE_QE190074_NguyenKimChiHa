import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// Disable Next.js cache for this page so it fetches fresh data on every request
export const revalidate = 0;

async function getResources() {
  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching resources:", error);
    return [];
  }
  return data;
}

export default async function Home() {
  const resources = await getResources();

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 mt-10">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 dark:from-blue-400 dark:to-indigo-400">
          Discover Study Resources
        </h1>
        <p className="text-xl text-muted-foreground max-w-[700px]">
          A community-driven collection of the best study materials. Find courses, books, and articles to boost your knowledge!
        </p>
      </div>

      {resources.length === 0 ? (
        <div className="text-center py-24 border-2 border-dashed rounded-2xl bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-zinc-800">
          <p className="text-muted-foreground text-lg mb-4">No resources found. Be the first to share one!</p>
          <Link href="/dashboard/add">
            <Button size="lg" className="rounded-full shadow-lg">Submit a Resource</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {resources.map((resource) => (
            <Card key={resource.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-slate-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 flex flex-col hover:-translate-y-1">
              {resource.image_url ? (
                <div className="w-full h-[220px] bg-slate-100 dark:bg-zinc-900 overflow-hidden relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={resource.image_url} alt={resource.title} className="w-full h-full object-cover object-center transition-all duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/5 dark:bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              ) : (
                <div className="w-full h-[220px] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-zinc-800 dark:to-zinc-900 flex flex-col items-center justify-center border-b border-slate-100 dark:border-zinc-800">
                  <span className="text-slate-400 dark:text-zinc-600 font-semibold text-base">No Thumbnail Preview</span>
                </div>
              )}
              <CardHeader className="flex-grow pt-5">
                {resource.category && (
                  <Badge variant="secondary" className="w-fit mb-2 text-xs font-semibold px-2">{resource.category}</Badge>
                )}
                <CardTitle className="text-lg line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors" title={resource.title}>
                  {resource.title}
                </CardTitle>
              </CardHeader>
              <CardFooter className="pt-2 border-t bg-slate-50/50 dark:bg-zinc-900/50">
                <a href={resource.link} target="_blank" rel="noreferrer" className="w-full">
                  <Button variant="default" className="w-full font-medium shadow-sm hover:shadow active:scale-95 transition-all">Go to Resource</Button>
                </a>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
