import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';

const ScrollArea = React.forwardRef(({ className, children, ...props }, ref) => (
    <ScrollAreaPrimitive.Root
        ref={ref}
        className={`relative overflow-hidden ${className}`}
        {...props}
    >
        <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
            {children}
        </ScrollAreaPrimitive.Viewport>
        <ScrollBar />
        <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
));

const ScrollBar = React.forwardRef(({ className, orientation = "vertical", ...props }, ref) => (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
        ref={ref}
        orientation={orientation}
        className={`flex touch-none select-none transition-colors ${orientation === "vertical" ?
            "h-full w-2.5 border-l border-l-transparent p-[1px]" :
            "h-2.5 flex-col border-t border-t-transparent p-[1px]"
            } ${className}`}
        {...props}
    >
        <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-gray-300" />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
));

ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

const ExpandableDescription = ({
    product,
    maxHeight = 400,
    className = '',
    scrollViewHeight = 600
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [shouldShowButton, setShouldShowButton] = useState(true);
    const contentRef = useRef(null);

    useEffect(() => {
        const checkHeight = () => {
            if (contentRef.current) {
                const contentHeight = contentRef.current.scrollHeight;
                setShouldShowButton(contentHeight > maxHeight);
            }
        };

        checkHeight();
        const timer = setTimeout(checkHeight, 100);
        window.addEventListener('resize', checkHeight);

        return () => {
            window.removeEventListener('resize', checkHeight);
            clearTimeout(timer);
        };
    }, [maxHeight, product?.description]);

    const toggleExpand = () => {
        setIsExpanded(prev => !prev);
    };

    if (!product?.description) {
        return null;
    }

    return (
        <div className={`relative ${className} w-full`}>
            <div style={{ height: isExpanded ? `${scrollViewHeight}px` : `${maxHeight}px` }}
                className="transition-all duration-300 ease-in-out">
                <ScrollArea className="h-full rounded-md">
                    <div
                        ref={contentRef}
                        className="prose prose-sm max-w-none"
                    >
                        <div
                            className="prose-p:my-4 prose-strong:font-bold prose-em:italic prose-headings:font-bold prose-img:mx-auto px-4"
                            dangerouslySetInnerHTML={{ __html: product.description }}
                        />
                    </div>
                </ScrollArea>
            </div>

            {!isExpanded && shouldShowButton && (
                <div
                    className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"
                    aria-hidden="true"
                />
            )}

            {shouldShowButton && (
                <div className="flex justify-center mt-4">
                    <button
                        onClick={toggleExpand}
                        type="button"
                        className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 bg-white hover:bg-gray-50 border border-gray-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 z-10"
                    >
                        <span className="font-medium">
                            {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                        </span>
                        {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                        ) : (
                            <ChevronDown className="w-4 h-4" />
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ExpandableDescription;