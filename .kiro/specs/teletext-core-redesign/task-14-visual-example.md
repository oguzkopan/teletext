# Task 14: Quiz Pages Layout - Visual Example

## Quiz Question Page (Page 602)

```
QUIZ OF THE DAY              P602
════════════════════════════════════
Question 1/5

Category: Geography

What is the capital of France?


1. Paris

2. London

3. Berlin

4. Madrid






                                        
Enter 1-4 to answer
```

## Answer Feedback Page (Correct Answer)

```
ANSWER RESULT                P602
════════════════════════════════════


✓ CORRECT!

Well done! You got it right.


Score: 1/5


Press GREEN for the next question










INDEX  NEXT  QUIT
```

## Answer Feedback Page (Incorrect Answer)

```
ANSWER RESULT                P602
════════════════════════════════════


✗ INCORRECT

The correct answer was:
Paris


Score: 0/5


Press GREEN for the next question










INDEX  NEXT  QUIT
```

## Next Question (Page 602 - Question 2)

```
QUIZ OF THE DAY              P602
════════════════════════════════════
Question 2/5

Category: Science

What is the chemical symbol for gold?


1. Au

2. Ag

3. Fe

4. Cu






                                        
Enter 1-4 to answer
```

## Key Features Demonstrated

### ✅ Requirement 11.1: Question Text Prominently Displayed
- Question appears clearly after the category
- Adequate spacing around the question
- Easy to read and understand

### ✅ Requirement 11.2: Numbered Options 1-4 with Clear Alignment
- All options numbered consistently (1-4)
- Left-aligned for easy scanning
- Blank lines between options for clarity

### ✅ Requirement 11.3: Clear Feedback After Selection
- Prominent ✓ CORRECT! or ✗ INCORRECT message
- Shows correct answer when wrong
- Displays current score

### ✅ Requirement 11.4: Question Counter Displayed
- "Question X/Y" format at the top
- Always visible so users know their progress

### ✅ Requirement 11.5: Previous Question Cleared
- Each page is completely fresh
- No remnants of previous questions
- Clean transition between questions

## Layout Specifications

- **Width:** Exactly 40 characters per row
- **Height:** Exactly 24 rows per page
- **Header:** 2 rows (title + separator)
- **Content:** 20 rows (questions, answers, feedback)
- **Footer:** 2 rows (blank + navigation hints)

## Navigation Flow

```
Page 601 (Quiz Intro)
    ↓
Page 602 (Question 1)
    ↓ (User selects answer)
Page 602 (Answer Feedback)
    ↓ (User presses NEXT)
Page 602 (Question 2)
    ↓ (User selects answer)
Page 602 (Answer Feedback)
    ↓ (User presses NEXT)
...continues...
    ↓ (After last question)
Page 603 (Quiz Results)
```

## Input Mode

- **Mode:** Single-digit input
- **Valid Options:** 1, 2, 3, 4
- **Behavior:** Immediate navigation on digit press
- **Hint:** "Enter 1-4 to answer" displayed in footer

## Comparison: Before vs After

### Before:
```
QUIZ OF THE DAY              P602
════════════════════════════════════
        Question 1/5
    ▓▓▓▓░░░░░░░░░░░░░░░░

Category: Geography

What is the capital of France?

SELECT YOUR ANSWER:

{red}RED: Paris
{green}GREEN: London
{yellow}YELLOW: Berlin
{blue}BLUE: Madrid
```

### After:
```
QUIZ OF THE DAY              P602
════════════════════════════════════
Question 1/5

Category: Geography

What is the capital of France?


1. Paris

2. London

3. Berlin

4. Madrid
```

### Improvements:
1. ✅ Removed confusing color-coded buttons
2. ✅ Simplified to numbered options matching input
3. ✅ Better spacing and alignment
4. ✅ Clearer question counter (no progress bar)
5. ✅ More professional teletext appearance
6. ✅ Easier to read and navigate
