/**
 * Animation Settings Display Component
 * 
 * Displays real-time animation settings on page 701
 * Requirements: 12.5 - Real-time preview of animation changes
 */

'use client';

import { useEffect, useState } from 'react';
import { useAnimationSettings } from '@/hooks/useAnimationSettings';
import { TeletextPage } from '@/types/teletext';

interface AnimationSettingsDisplayProps {
  page: TeletextPage;
  onPageUpdate?: (page: TeletextPage) => void;
}

/**
 * Component that updates page 701 with real-time animation settings
 * Requirement: 12.5 - Implement real-time preview of animation changes
 */
export function AnimationSettingsDisplay({ page, onPageUpdate }: AnimationSettingsDisplayProps) {
  const { settings, isLoading, isSaving } = useAnimationSettings();
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    // Only update if we're on page 701
    if (page.id !== '701' || isLoading) return;

    // Create visual slider bars
    const createSlider = (value: number, max: number, width: number = 15): string => {
      const filled = Math.round((value / max) * width);
      const empty = width - filled;
      return '█'.repeat(filled) + '░'.repeat(empty);
    };

    // Get CRT effects from page meta
    const scanlinesIntensity = page.meta?.effectsData?.scanlinesIntensity ?? 50;
    const curvature = page.meta?.effectsData?.curvature ?? 5;
    const noiseLevel = page.meta?.effectsData?.noiseLevel ?? 10;

    // Build updated rows with current settings
    const rows = [
      'EFFECTS & ANIMATIONS         P701',
      '════════════════════════════════════',
      '',
      'CRT EFFECTS:',
      `Scanlines: ${createSlider(scanlinesIntensity, 100, 15)} ${scanlinesIntensity}%`,
      `Curvature: ${createSlider(curvature, 10, 15)} ${curvature}px`,
      `Noise:     ${createSlider(noiseLevel, 100, 15)} ${noiseLevel}%`,
      '',
      'ANIMATIONS:',
      `All Animations: ${settings.animationsEnabled ? 'ON ' : 'OFF'}`,
      `Intensity:      ${createSlider(settings.animationIntensity, 100, 15)} ${settings.animationIntensity}%`,
      `Transitions:    ${settings.transitionsEnabled ? 'ON ' : 'OFF'}`,
      `Decorations:    ${settings.decorationsEnabled ? 'ON ' : 'OFF'}`,
      `Backgrounds:    ${settings.backgroundEffectsEnabled ? 'ON ' : 'OFF'}`,
      '',
      'Use arrow keys to adjust intensity',
      'Press 1-4 to toggle animation types',
      '',
      isSaving ? 'Saving...' : 'Changes apply immediately',
      'Settings saved automatically',
      '',
      '',
      'INDEX   RESET   THEMES',
      ''
    ];

    // Pad rows to exactly 24 rows, each max 40 characters
    const paddedRows = rows.map(row => {
      if (row.length > 40) {
        return row.substring(0, 40);
      }
      return row.padEnd(40, ' ');
    });

    while (paddedRows.length < 24) {
      paddedRows.push(''.padEnd(40, ' '));
    }

    // Create updated page
    const updatedPage: TeletextPage = {
      ...page,
      rows: paddedRows.slice(0, 24),
      meta: {
        ...page.meta,
        animationSettings: settings
      }
    };

    // Notify parent of update
    if (onPageUpdate) {
      onPageUpdate(updatedPage);
    }

    setLastUpdate(Date.now());
  }, [settings, isLoading, isSaving, page, onPageUpdate]);

  // This component doesn't render anything visible
  return null;
}
