import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Jump link to the comments.
 *
 * The like counter that used to live here was not real: the count was kept in
 * the visitor's own localStorage, so every reader saw their own tally starting
 * at zero and nobody's like reached anyone else. A genuine counter needs shared
 * storage, which this site deliberately does not have. Showing nothing beats
 * showing a number that means nothing.
 */
export default function BlogPostInteractions() {
  return (
    <div className="mt-12 pt-6 border-t flex flex-wrap gap-y-3 justify-between items-center">
      <Button variant="outline" size="sm" asChild className="min-h-11 px-3">
        <a href="#comments" className="flex items-center gap-2">
          <MessageSquare size={16} />
          Comments
        </a>
      </Button>
    </div>
  );
}
