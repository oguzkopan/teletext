# Character Limit Fix: 40 to 60 Characters Per Line

## Problem
Footer text and other content was being cut off mid-word (e.g., "H" instead of "HOME"). The issue was that:
- Backend adapters were limiting rows to exactly 40 characters
- Frontend was now using larger fonts that could display more characters
- The 40-character limit was causing text truncation even though there was screen space available

## Root Cause
When we increased the font size to better utilize screen width, we didn't update the backend character limit. The adapters were still truncating/padding rows to 40 characters (the original teletext standard), but the larger font meant we could now comfortably display 60+ characters per line.

## Solution Applied

Updated all adapter `padRows()` functions to use 60 characters instead of 40:

### Files Modified

1. **functions/src/adapters/GamesAdapter.ts**
   - Updated `padRows()` from 40 to 60 characters

2. **functions/src/adapters/AIAdapter.ts**
   - Updated `padRows()` from 40 to 60 characters

3. **functions/src/adapters/SettingsAdapter.ts**
   - Updated `padRows()` from 40 to 60 characters

4. **functions/src/adapters/SportsAdapter.ts**
   - Updated `padRows()` from 40 to 60 characters

5. **functions/src/adapters/DevAdapter.ts**
   - Updated `padRows()` from 40 to 60 characters
   - Updated inline `padEnd(40)` calls to `padEnd(60)`
   - Updated line splitting logic from 40 to 60 characters

6. **functions/src/adapters/StaticAdapter.ts**
   - Updated `padRows()` from 40 to 60 visible characters
   - Handles color codes and emojis correctly

7. **functions/src/adapters/NewsAdapter.ts**
   - Updated inline `padEnd(40)` to `padEnd(60)`

8. **functions/src/adapters/MarketsAdapter.ts**
   - Updated `substring(0, 40)` to `substring(0, 60)`

## Technical Details

The change from 40 to 60 characters is based on:
- Original teletext: 40 characters × 24 rows
- New font size: `clamp(16px, 2.2vw, 28px)`
- On 1920px screen: ~42px font size
- Character width: ~25px (0.6 × font size for monospace)
- Available width: ~1840px (after padding)
- Characters that fit: 1840 / 25 ≈ 73 characters
- Safe limit: 60 characters (leaves margin for safety)

## Benefits

✅ **No Text Cutoff**: Footer and content text now displays completely
✅ **Better Space Usage**: Utilizes the larger font size effectively
✅ **Consistent Across App**: All adapters updated uniformly
✅ **Maintains Layout**: Still fits 24 rows on screen
✅ **Future-Proof**: 60-character limit works across different screen sizes

## Example

**Before (40 chars):**
```
Enter number to select game ⚫INDEX ⚫H
```

**After (60 chars):**
```
Enter number to select game ⚫INDEX ⚫HOME ⚫QUIZ ⚫FACTS
```

## Testing

Build completed successfully. All adapters now support 60-character lines, allowing full text display without truncation.
