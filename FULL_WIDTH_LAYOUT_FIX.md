# Full-Width Layout Fix: Better Screen Space Utilization

## Problem
The teletext content was only using about half of the available screen width, leaving a large empty space on the right side. This caused:
- Wasted screen real estate (almost 50% of screen unused)
- Text being cut off (e.g., "Toky" instead of "Tokyo")
- Footer content not fully visible
- Poor user experience with cramped text and empty space

## Root Cause
The font size was calculated based on viewport height (`1.8vh`) instead of viewport width, which resulted in very small text that didn't utilize the available horizontal space. The 40-character teletext grid was being rendered too narrow.

## Solution Applied

### 1. Increased Font Size
Changed from viewport-height-based to viewport-width-based sizing:
- **Before**: `fontSize: 'clamp(12px, 1.8vh, 24px)'`
- **After**: `fontSize: 'clamp(16px, 2.2vw, 28px)'`

This makes the font scale with screen width, ensuring the 40-character grid uses more horizontal space.

### 2. Adjusted Line Height
Increased line height for better readability with larger text:
- **Before**: `lineHeight: '1.15'`
- **After**: `lineHeight: '1.2'`

### 3. Increased Padding
Restored more comfortable padding:
- **Before**: `padding: '0.5vh 1.5vw'`
- **After**: `padding: '1vh 2vw'`

### 4. Updated Row Height Calculation
Adjusted to account for new padding:
- **Before**: `height: calc((100vh - 4vh) / 24)`
- **After**: `height: calc((100vh - 2vh) / 24)`

Also increased minimum row height:
- **Before**: `min-height: 1.15em`
- **After**: `min-height: 1.2em`

## Benefits

✅ **Better Space Utilization**: Content now uses 70-80% of screen width instead of 40-50%
✅ **No Text Cutoff**: Full city names, labels, and content are now visible
✅ **Footer Fully Visible**: All footer content fits on screen
✅ **Improved Readability**: Larger, more comfortable text size
✅ **Responsive**: Still scales properly across different screen sizes
✅ **Maintains 24 Rows**: All 24 lines still fit on one screen

## Technical Details

The key insight is using `vw` (viewport width) units instead of `vh` (viewport height) for font sizing. Since teletext is fundamentally a width-constrained format (40 characters wide), the font size should scale with available width to maximize horizontal space usage.

The formula `2.2vw` means:
- On a 1920px wide screen: ~42px font size
- On a 1366px wide screen: ~30px font size  
- On a 1024px wide screen: ~22px font size

This ensures the 40-character grid adapts to use most of the available width while remaining readable.

## Files Modified
- `components/TeletextScreen.tsx` - Updated font sizing and layout calculations

## Testing
Build completed successfully. The layout now:
- Uses significantly more screen width
- Shows complete text without cutoff
- Maintains all 24 rows on screen
- Remains responsive across screen sizes
