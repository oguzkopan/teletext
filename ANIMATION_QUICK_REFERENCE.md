# Animation Library Quick Reference

## Import

```css
@import './animations.css';
```

## Common Patterns

### Fade In/Out
```html
<div class="fade-in">Fades in</div>
<div class="fade-out">Fades out</div>
<div class="fade-in anim-slow">Slow fade in</div>
```

### Slide In
```html
<div class="slide-in-left">From left</div>
<div class="slide-in-right">From right</div>
<div class="slide-in-top">From top</div>
<div class="slide-in-bottom">From bottom</div>
```

### Scale & Pulse
```html
<div class="scale-in">Scales up</div>
<div class="pulse">Pulses continuously</div>
<div class="pulse-fast">Fast pulse</div>
```

### Bounce & Shake
```html
<div class="bounce-in">Bounces in</div>
<div class="shake">Shakes</div>
```

### Rotate
```html
<div class="rotate">Rotates</div>
<div class="rotate-fast">Fast rotation</div>
```

### Blink & Flash
```html
<span class="blink">Blinks</span>
<div class="flash">Flashes once</div>
```

## Theme-Specific

### Ceefax
```html
<div class="ceefax-wipe">Wipe transition</div>
<button class="ceefax-button-flash">Button</button>
<div class="ceefax-scanlines intensity-medium">Scanlines</div>
```

### Haunting/Kiroween
```html
<button class="haunting-button-flash">Horror button</button>
<div class="haunting-chromatic-aberration intensity-high">
  Chromatic aberration
</div>
<div class="haunting-fog-overlay intensity-medium">Fog</div>
<div class="haunting-screen-flicker">Flicker</div>
<span class="haunting-pumpkin-flicker">🎃</span>
```

### High Contrast
```html
<div class="high-contrast-fade">Simple fade</div>
<button class="high-contrast-button-flash">Button</button>
```

### ORF
```html
<div class="orf-slide">Slide transition</div>
<div class="orf-color-cycle">Color cycling</div>
<div class="orf-rainbow-border">Rainbow border</div>
```

## Page Transitions
```html
<div class="wipe-left">Wipe from left</div>
<div class="glitch-transition">Glitch effect</div>
<div class="zoom-in-transition">Zoom in</div>
```

## Interactive Elements
```html
<button class="button-press">Press animation</button>
<button class="button-hover-glow">Hover glow</button>
<input class="input-highlight" />
<a class="link-indicator-bounce">Link</a>
```

## Feedback
```html
<div class="feedback-success-flash">
  <span class="feedback-checkmark">✓</span> Success
</div>
<div class="feedback-error-flash">
  <span class="feedback-cross">✗</span> Error
</div>
<div class="feedback-celebration">🎉 Complete!</div>
```

## Loading
```html
<div class="loading-spinner">Loading...</div>
<div class="loading-dots">Loading</div>
<div class="loading-pulse">Loading...</div>
```

## Decorative
```html
<!-- Weather -->
<span class="weather-rain">💧</span>
<span class="weather-cloud">☁️</span>
<span class="weather-sun">☀️</span>

<!-- Sports -->
<span class="sports-live-pulse">LIVE</span>
<span class="sports-score-flash">3-2</span>

<!-- Markets -->
<span class="market-trend-up">▲ +5.2%</span>
<span class="market-trend-down">▼ -2.1%</span>

<!-- AI -->
<span class="ai-typing-cursor">|</span>
<span class="ai-thinking">Thinking</span>
```

## Utility Modifiers

### Duration
```html
<div class="fade-in anim-fast">150ms</div>
<div class="fade-in anim-normal">300ms</div>
<div class="fade-in anim-slow">600ms</div>
<div class="fade-in anim-slower">1000ms</div>
```

### Delay
```html
<div class="fade-in anim-delay-1">100ms delay</div>
<div class="fade-in anim-delay-2">200ms delay</div>
<div class="fade-in anim-delay-3">300ms delay</div>
```

### Iteration
```html
<div class="pulse anim-once">Once</div>
<div class="pulse anim-twice">Twice</div>
<div class="pulse anim-infinite">Infinite</div>
```

### Easing
```html
<div class="slide-in-left anim-ease-in">Ease in</div>
<div class="slide-in-left anim-ease-out">Ease out</div>
<div class="slide-in-left anim-linear">Linear</div>
```

### Fill Mode
```html
<div class="fade-in anim-fill-forwards">Stays visible</div>
<div class="fade-in anim-fill-backwards">Pre-fills</div>
```

### Stagger (Sequential)
```html
<div class="fade-in anim-stagger-1">Item 1 (0ms)</div>
<div class="fade-in anim-stagger-1">Item 2 (100ms)</div>
<div class="fade-in anim-stagger-1">Item 3 (200ms)</div>
```

## Accessibility

### Disable All Animations
```html
<body class="animations-disabled">
```

### Reduce Animation Intensity
```html
<body class="animations-reduced">
```

### Disable Specific Types
```html
<body class="transitions-disabled">
<body class="decorations-disabled">
<body class="background-effects-disabled">
```

### Performance Degradation
```html
<body class="animations-degraded">
```

## Complexity Levels
```html
<div class="fade-in animation-complexity-simple">
  Always runs
</div>
<div class="pulse animation-complexity-moderate">
  Disabled when FPS < 30
</div>
<div class="haunting-chromatic-aberration animation-complexity-complex">
  Disabled when FPS < 30
</div>
```

## Combining Classes
```html
<div class="fade-in anim-slow anim-delay-2 anim-ease-out anim-fill-forwards">
  Fades in slowly with delay, smooth easing, and stays visible
</div>

<button class="button-press ceefax-button-flash anim-fast">
  Ceefax-style button with press animation
</button>

<div class="haunting-chromatic-aberration intensity-high animation-complexity-complex">
  <div class="haunting-fog-overlay intensity-medium">
    <div class="haunting-screen-flicker intensity-low">
      Multiple layered effects
    </div>
  </div>
</div>
```

## Theme Transitions
```html
<div class="theme-banner haunting">
  HAUNTING MODE ACTIVATED
</div>

<div class="theme-fade-out">Fading out old theme</div>
<div class="theme-fade-in">Fading in new theme</div>
<div class="theme-haunting-transition">Horror transition</div>
```

## Performance Tips

1. **Use GPU-accelerated properties**: `transform`, `opacity`
2. **Apply will-change sparingly**: Only for critical animations
3. **Clean up after animations**: Remove `animation-critical` class
4. **Monitor performance**: Add `animations-degraded` if FPS < 30
5. **Test accessibility**: Enable `prefers-reduced-motion`

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+

Fallbacks provided through accessibility system.
