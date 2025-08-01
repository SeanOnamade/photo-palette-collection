import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// FIXED: Ultra-aggressive Image optimization that handles existing Cloudinary transformations
export function optimizeImageUrl(url: string, width?: number, quality?: number, isCritical = false): string {
  // Handle Cloudinary URLs with ultra-aggressive optimization
  if (url.includes('cloudinary.com')) {
    const baseUrl = url.split('/upload/')[0] + '/upload/';
    const afterUpload = url.split('/upload/')[1];
    
    // Extract the actual image path by finding the version and filename
    let imagePath = afterUpload;
    
    // Look for version pattern like v1741575488/filename.jpg
    const versionMatch = afterUpload.match(/(v\d+\/[^\/]+\.(jpg|jpeg|png|webp|gif))$/i);
    if (versionMatch) {
      // Found version/filename pattern - use this as the image path
      imagePath = versionMatch[1];
    } else {
      // No version found, check if it's just a filename
      const filenameMatch = afterUpload.match(/([^\/]+\.(jpg|jpeg|png|webp|gif))$/i);
      if (filenameMatch) {
        imagePath = filenameMatch[1];
      }
    }
    
    // Build clean, optimized transformations
    let transformations = [
      'f_auto',              // Auto format selection (simpler, more compatible)
      'q_auto:good',         // Good quality auto-optimization (more reliable than aggressive)
      'fl_progressive'       // Progressive loading
    ];
    
    if (width) {
      transformations.push(`w_${width}`);
      transformations.push(`c_fill`); // Crop to exact dimensions
    }
    
    if (quality) {
      // More conservative quality settings to avoid conflicts
      const optimizedQuality = Math.max(quality - 10, 70); // Reduce by 10 points, minimum 70
      transformations.push(`q_${optimizedQuality}`);
    }
    
    // Critical images get performance boosts
    if (isCritical) {
      transformations.push('fl_immutable_cache');
    }
    
    return `${baseUrl}${transformations.join(',')}/${imagePath}`;
  }
  
  // For local images, add basic optimization hints
  // Add cache-busting and loading hints for better performance
  if (url.startsWith('/') || url.startsWith('./')) {
    return url; // Keep local paths as-is but browser will apply lazy loading
  }
  
  return url;
}

export function generateUltraResponsiveSrcSet(url: string, isCritical = false): { srcSet: string; sizes: string; avifSrcSet?: string } {
  if (url.includes('cloudinary.com')) {
    // More conservative quality settings for better compatibility
    const tiny = optimizeImageUrl(url, 240, 85, isCritical);
    const small = optimizeImageUrl(url, 400, 85, isCritical);
    const medium = optimizeImageUrl(url, 800, 85, isCritical);
    const large = optimizeImageUrl(url, 1200, 90, isCritical);
    const xl = optimizeImageUrl(url, 1600, 90, isCritical);
    
    return {
      srcSet: `${tiny} 240w, ${small} 400w, ${medium} 800w, ${large} 1200w, ${xl} 1600w`,
      sizes: '(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'
    };
  }
  
  // For local images, provide basic responsive hints without actual multiple files
  // This at least optimizes how the browser handles the single image
  if (url.startsWith('/') || url.startsWith('./')) {
    return { 
      srcSet: '', // No multiple sizes available for local images yet
      sizes: '(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw' 
    };
  }
  
  // For other external images, return empty (fallback to single src)
  return { srcSet: '', sizes: '' };
}

// Keep backward compatibility
export function generateResponsiveSrcSet(url: string): { srcSet: string; sizes: string } {
  const result = generateUltraResponsiveSrcSet(url, false);
  return { srcSet: result.srcSet, sizes: result.sizes };
}

export function generateUltraPlaceholder(url: string): string {
  if (url.includes('cloudinary.com')) {
    const baseUrl = url.split('/upload/')[0] + '/upload/';
    const afterUpload = url.split('/upload/')[1];
    
    // Extract the actual image path using the same logic as optimizeImageUrl
    let imagePath = afterUpload;
    const versionMatch = afterUpload.match(/(v\d+\/[^\/]+\.(jpg|jpeg|png|webp|gif))$/i);
    if (versionMatch) {
      imagePath = versionMatch[1];
    } else {
      const filenameMatch = afterUpload.match(/([^\/]+\.(jpg|jpeg|png|webp|gif))$/i);
      if (filenameMatch) {
        imagePath = filenameMatch[1];
      }
    }
    
    // Ultra-tiny placeholder - 20px with maximum blur and compression
    return `${baseUrl}f_auto,q_20,w_20,h_20,c_fill,e_blur:2000/${imagePath}`;
  }
  
  // For local images, return a small version (fallback)
  return url;
}

// Keep backward compatibility
export function generatePlaceholder(url: string): string {
  return generateUltraPlaceholder(url);
}

// Advanced preloading with intersection prediction and error handling
export function preloadCriticalImagesAdvanced(urls: string[], priority: 'high' | 'medium' | 'low' = 'high'): void {
  if (typeof window === 'undefined' || !urls.length) return;
  
  // Limit concurrent preloads to prevent overwhelming the browser
  const maxConcurrentPreloads = 6;
  const validUrls = urls.filter(url => url && typeof url === 'string');
  
  validUrls.slice(0, maxConcurrentPreloads).forEach((url, index) => {
    // Stagger preloading to avoid bandwidth competition
    setTimeout(() => {
      try {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.fetchPriority = priority;
        
        // Add error handling to prevent console spam
        link.onerror = () => {
          // Silently fail - preloading is an optimization, not critical
        };
        
        if (url.includes('cloudinary.com')) {
          // Preload optimized version
          link.href = optimizeImageUrl(url, 800, 85, true); // Conservative quality for reliability
          
          // Add responsive preloading
          const responsive = generateUltraResponsiveSrcSet(url, true);
          if (responsive.srcSet) {
            link.setAttribute('imagesrcset', responsive.srcSet);
            link.setAttribute('imagesizes', responsive.sizes);
          }
        } else {
          link.href = url;
        }
        
        document.head.appendChild(link);
      } catch (error) {
        // Silently fail - preloading is an optimization, not critical
      }
    }, index * 25); // 25ms stagger between preloads
  });
}

// Keep backward compatibility
export function preloadCriticalImage(url: string): void {
  preloadCriticalImagesAdvanced([url], 'high');
}

export function addCloudinaryPreconnectAdvanced(): void {
  if (typeof window === 'undefined') return;
  
  const connections = [
    'https://res.cloudinary.com',
    'https://cloudinary-marketing-res.cloudinary.com'
  ];
  
  connections.forEach(href => {
    if (document.querySelector(`link[href="${href}"]`)) return;
    
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = href;
    preconnect.crossOrigin = 'anonymous';
    document.head.appendChild(preconnect);
  });
  
  // Also add DNS prefetch for even faster resolution
  if (!document.querySelector('link[rel="dns-prefetch"][href*="cloudinary.com"]')) {
    const dnsPrefetch = document.createElement('link');
    dnsPrefetch.rel = 'dns-prefetch';
    dnsPrefetch.href = 'https://res.cloudinary.com';
    document.head.appendChild(dnsPrefetch);
  }
}

// Keep backward compatibility
export function addCloudinaryPreconnect(): void {
  addCloudinaryPreconnectAdvanced();
}

// Performance monitoring for images with throttled logging
let lastSlowImageWarning = 0;
const SLOW_IMAGE_WARNING_THROTTLE = 5000; // 5 seconds

export function trackImagePerformance(url: string, startTime: number) {
  if (typeof window === 'undefined') return;
  
  const loadTime = performance.now() - startTime;
  
  // Throttled logging for slow loading images to prevent console spam
  if (loadTime > 1000) {
    const now = Date.now();
    if (now - lastSlowImageWarning > SLOW_IMAGE_WARNING_THROTTLE) {
      console.warn(`Slow image loading detected: ${url} took ${loadTime.toFixed(2)}ms`);
      lastSlowImageWarning = now;
    }
  }
  
  // Send to analytics if available (throttled by analytics system)
  if ('gtag' in window) {
    (window as any).gtag('event', 'image_load_time', {
      custom_parameter_1: url.substring(url.lastIndexOf('/') + 1), // Only filename for privacy
      value: Math.round(loadTime)
    });
  }
}

// Optimized intersection observer with balanced performance
export function createUltraFastObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: { rootMargin?: string; threshold?: number } = {}
): IntersectionObserver {
  return new IntersectionObserver(callback, {
    rootMargin: options.rootMargin || '300px', // Balanced preloading for smooth scrolling
    threshold: options.threshold || 0.05, // Higher threshold for better performance
  });
}
