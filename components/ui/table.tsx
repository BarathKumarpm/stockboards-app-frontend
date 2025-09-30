import * as React from "react"
import { cn } from "@/lib/utils"

// --- 1. Scroll Context and Hook to track scroll position ---
interface ScrollContextValue {
  isScrolled: boolean;
}
const ScrollContext = React.createContext<ScrollContextValue>({ isScrolled: false });

const useScrollDetection = (ref: React.RefObject<HTMLDivElement | null>): boolean => {
    const [scrolled, setScrolled] = React.useState(false);

    React.useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const handleScroll = () => {
            // Apply shadow only when scrolled down (scrollTop > 0)
            setScrolled(element.scrollTop !== 0);
        };

        element.addEventListener('scroll', handleScroll);
        return () => element.removeEventListener('scroll', handleScroll);
    }, [ref]);

    return scrolled;
};
// -------------------------------------------------------------------

// --- 2. Table: Acts as the ScrollArea wrapper and Context Provider ---
const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, children, ...props }, ref) => {
    const scrollRef = React.useRef<HTMLDivElement | null>(null);
    const isScrolled = useScrollDetection(scrollRef);
    
    const contextValue = React.useMemo(() => ({ isScrolled }), [isScrolled]);

    return (
        <ScrollContext.Provider value={contextValue}>
            {/* Mantine ScrollArea equivalent: controlled height, overflow, border, and shadow */}
            <div 
                ref={scrollRef} 
                // Removed bg-white from here, relying on table wrapper for background
                className={cn(
                    "w-full overflow-y-auto border rounded-xl shadow-md",
                    { 'max-h-[70vh]': true } // Fixed height to enable scrolling
                )} 
            >
                <table 
                    ref={ref} 
                    className={cn("w-full caption-bottom text-sm min-w-[1200px] bg-white", className)} 
                    {...props} 
                >
                    {children}
                </table>
            </div>
        </ScrollContext.Provider>
    )
  }
)
Table.displayName = "Table"

// --- 3. TableHeader: Consumes Context and applies sticky/shadow ---
const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => {
    const { isScrolled } = React.useContext(ScrollContext); 

    return (
      <thead 
        ref={ref} 
        className={cn(
            // The header must have a background (bg-white/95) to cover content when sticky
            // The shadow is the only visual indication of stickiness/scroll
            "sticky top-0 z-10 bg-white/95 transition-shadow duration-150 ease-in-out [&_tr]:border-b",
            { 'shadow-md': isScrolled }, 
            className
        )} 
        {...props} 
      />
    );
  }
)
TableHeader.displayName = "TableHeader"

// --- 4. TableHead: Now uses default background and dark text ---
const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
    ({ className, ...props }, ref) => (
      <th
        ref={ref}
        className={cn(
          // REMOVED: bg-green-600/95 and text-white
          // ADDED: text-muted-foreground (default text color)
          "h-12 px-4 text-left align-middle font-medium text-muted-foreground bg-gray-50/50 [&:has([role=checkbox])]:pr-0",
          className,
        )}
        {...props}
      />
)
)
TableHead.displayName = "TableHead"


// --- Standard Table Components (Unchanged) ---

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
  ),
)
TableBody.displayName = "TableBody"

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn("border-b transition-colors hover:bg-gray-50 data-[state=selected]:bg-gray-100", className)}
      {...props}
    />
  ),
)
TableRow.displayName = "TableRow"

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props} />
  ),
)
TableCell.displayName = "TableCell"

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot ref={ref} className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)} {...props} />
  ),
)
TableFooter.displayName = "TableFooter"

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
  ),
)
TableCaption.displayName = "TableCaption"

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption }