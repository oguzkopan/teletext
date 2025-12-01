# Testing Games AI Generation

## Quick Test Guide

### Prerequisites
1. Firebase emulator must be running
2. Next.js dev server must be running
3. Vertex AI must be enabled in your Google Cloud project

### Start Services

```bash
# Terminal 1: Start Firebase emulator
npm run emulator

# Terminal 2: Start Next.js dev server
npm run dev
```

### Test Each Page

#### Page 600 - Games Index (Static)
1. Navigate to: http://localhost:3000 → Type `600`
2. **Expected:** Static games menu with links to all games
3. **Status:** ✅ Should work (static page)

#### Page 601 - Quiz of the Day (AI-Generated)
1. Navigate to page `601`
2. Click "START" or type `602`
3. **Expected:** 
   - 5 unique trivia questions
   - Questions should be different each time you restart
   - AI-generated commentary at the end
4. **Test:** Restart quiz multiple times - questions should vary
5. **Status:** ✅ Should use AI generation

#### Page 610 - Bamboozle Quiz (Dynamic)
1. Navigate to page `610`
2. Click "START" or type `611`
3. **Expected:**
   - Branching story game
   - Choices affect the outcome
   - 3 different endings possible
4. **Status:** ✅ Should work (uses session state)

#### Page 620 - Random Facts (AI/API)
1. Navigate to page `620`
2. **Expected:** Random interesting fact
3. **Test:** Reload the page multiple times
4. **Expected:** Different facts each time
5. **Status:** ✅ Should fetch from API or use curated database

#### Page 630 - Anagram Challenge (AI-Generated) ⭐
1. Navigate to page `630`
2. **Expected:**
   - Scrambled word puzzle
   - 4 answer options
   - Hint provided
3. **Test:** Reload page multiple times
4. **Expected:** **Different anagrams each time** (AI-generated)
5. Select an answer (1-4)
6. **Expected:** Shows if correct/incorrect
7. **Status:** ✅ NOW USES AI GENERATION (was mock data before)

#### Page 640 - Math Challenge (AI-Generated) ⭐
1. Navigate to page `640`
2. **Expected:**
   - Math problem (addition, subtraction, multiplication)
   - 4 answer options
3. **Test:** Reload page multiple times
4. **Expected:** **Different problems each time** (AI-generated)
5. Select an answer (1-4)
6. **Expected:** Shows solution with step-by-step explanation
7. **Status:** ✅ NOW USES AI GENERATION (was mock data before)

## Verification Checklist

### Before Fix (Mock Data)
- [ ] Page 620 showed the same fact every time
- [ ] Page 630 showed "TELETEXT" anagram every time
- [ ] Page 640 showed "47 × 8 + 15" problem every time

### After Fix (AI Generation)
- [ ] Page 620 shows different facts on reload
- [ ] Page 630 shows different anagrams on reload ⭐
- [ ] Page 640 shows different math problems on reload ⭐
- [ ] All pages load without errors
- [ ] Answer pages (631-634, 641-644) work correctly

## Troubleshooting

### "Service Unavailable" Error
**Cause:** Firebase emulator not running or Vertex AI not configured
**Solution:**
1. Check emulator is running: `npm run emulator`
2. Check environment variables in `functions/.env.local`
3. Verify `GOOGLE_CLOUD_PROJECT` is set

### Same Content Every Time
**Cause:** Pages still being served from static registry
**Solution:**
1. Restart Next.js dev server
2. Clear browser cache
3. Check `lib/page-registry.ts` - pages 620, 630, 640 should NOT be registered

### AI Generation Fails
**Cause:** Vertex AI not enabled or quota exceeded
**Solution:**
1. Enable Vertex AI in Google Cloud Console
2. Check Vertex AI quota
3. Check function logs for detailed error messages

### Fallback Behavior
If AI generation fails, pages should:
- **601:** Fall back to Open Trivia Database API
- **620:** Fall back to curated fact database
- **630:** Show error page
- **640:** Show error page

## Monitoring

### Check Function Logs
```bash
# In Firebase emulator terminal
# Look for logs from GamesAdapter
```

### Check Browser Console
```javascript
// Should see API calls to Firebase Functions
// Example: GET http://127.0.0.1:5001/.../getPage/630
```

### Check Network Tab
1. Open browser DevTools → Network tab
2. Navigate to page 630 or 640
3. Look for request to `/api/page/630` or `/api/page/640`
4. Should go to Firebase Functions, not return cached static page

## Success Criteria

✅ Pages 620, 630, 640 show **different content** on each reload
✅ No TypeScript or build errors
✅ All answer pages work correctly
✅ Navigation between pages works smoothly
✅ Error handling works (shows error page if AI fails)

## Performance Notes

- First load may be slower (cold start + AI generation)
- Subsequent loads should be faster
- AI generation typically takes 1-3 seconds
- Fallback mechanisms ensure pages always load
