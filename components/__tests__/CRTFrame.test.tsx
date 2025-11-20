import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import CRTFrame from '../CRTFrame';

describe('CRTFrame Component', () => {
  it('renders children content', () => {
    const { getByText } = render(
      <CRTFrame effects={{ scanlines: false, curvature: false, noise: false, glitch: false }}>
        <div>Test Content</div>
      </CRTFrame>
    );

    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('applies scanlines effect when enabled', () => {
    const { container } = render(
      <CRTFrame effects={{ scanlines: true, curvature: false, noise: false, glitch: false }}>
        <div>Test</div>
      </CRTFrame>
    );

    const scanlines = container.querySelector('.scanlines');
    expect(scanlines).toBeInTheDocument();
  });

  it('does not apply scanlines when disabled', () => {
    const { container } = render(
      <CRTFrame effects={{ scanlines: false, curvature: false, noise: false, glitch: false }}>
        <div>Test</div>
      </CRTFrame>
    );

    const scanlines = container.querySelector('.scanlines');
    expect(scanlines).not.toBeInTheDocument();
  });

  it('applies curvature effect when enabled', () => {
    const { container } = render(
      <CRTFrame effects={{ scanlines: false, curvature: true, noise: false, glitch: false }}>
        <div>Test</div>
      </CRTFrame>
    );

    const screen = container.querySelector('.crt-screen.curved');
    expect(screen).toBeInTheDocument();
  });

  it('applies noise effect when enabled', () => {
    const { container } = render(
      <CRTFrame effects={{ scanlines: false, curvature: false, noise: true, glitch: false }}>
        <div>Test</div>
      </CRTFrame>
    );

    const noise = container.querySelector('.noise');
    expect(noise).toBeInTheDocument();
  });

  it('applies glitch effect when enabled', () => {
    const { container } = render(
      <CRTFrame effects={{ scanlines: false, curvature: false, noise: false, glitch: true }}>
        <div>Test</div>
      </CRTFrame>
    );

    const glitchFrame = container.querySelector('.crt-frame.glitch');
    expect(glitchFrame).toBeInTheDocument();
  });

  it('renders CRT bezel and frame structure', () => {
    const { container } = render(
      <CRTFrame effects={{ scanlines: false, curvature: false, noise: false, glitch: false }}>
        <div>Test</div>
      </CRTFrame>
    );

    expect(container.querySelector('.crt-container')).toBeInTheDocument();
    expect(container.querySelector('.crt-frame')).toBeInTheDocument();
    expect(container.querySelector('.crt-bezel')).toBeInTheDocument();
    expect(container.querySelector('.crt-screen')).toBeInTheDocument();
  });

  it('renders screen glare effect', () => {
    const { container } = render(
      <CRTFrame effects={{ scanlines: false, curvature: false, noise: false, glitch: false }}>
        <div>Test</div>
      </CRTFrame>
    );

    const glare = container.querySelector('.screen-glare');
    expect(glare).toBeInTheDocument();
  });

  // Halloween effects tests - Requirements 36.1, 36.2, 36.3, 36.4, 36.5
  it('applies haunting mode class when enabled', () => {
    const { container } = render(
      <CRTFrame 
        effects={{ scanlines: true, curvature: true, noise: true, glitch: true }}
        hauntingMode={true}
      >
        <div>Test</div>
      </CRTFrame>
    );

    const hauntingFrame = container.querySelector('.crt-frame.haunting');
    expect(hauntingFrame).toBeInTheDocument();
  });

  it('applies haunting screen class when haunting mode is enabled', () => {
    const { container } = render(
      <CRTFrame 
        effects={{ scanlines: true, curvature: true, noise: true, glitch: true }}
        hauntingMode={true}
      >
        <div>Test</div>
      </CRTFrame>
    );

    const hauntingScreen = container.querySelector('.crt-screen.haunting-screen');
    expect(hauntingScreen).toBeInTheDocument();
  });

  it('renders Halloween particle effects when haunting mode is enabled', () => {
    const { container } = render(
      <CRTFrame 
        effects={{ scanlines: true, curvature: true, noise: true, glitch: true }}
        hauntingMode={true}
      >
        <div>Test</div>
      </CRTFrame>
    );

    const particles = container.querySelector('.halloween-particles');
    expect(particles).toBeInTheDocument();
    
    // Check for specific particle types
    expect(container.querySelector('.particle.ghost')).toBeInTheDocument();
    expect(container.querySelector('.particle.bat')).toBeInTheDocument();
    expect(container.querySelector('.particle.pumpkin')).toBeInTheDocument();
    expect(container.querySelector('.particle.skull')).toBeInTheDocument();
  });

  it('does not render Halloween particles when haunting mode is disabled', () => {
    const { container } = render(
      <CRTFrame 
        effects={{ scanlines: true, curvature: true, noise: true, glitch: false }}
        hauntingMode={false}
      >
        <div>Test</div>
      </CRTFrame>
    );

    const particles = container.querySelector('.halloween-particles');
    expect(particles).not.toBeInTheDocument();
  });

  it('does not apply haunting classes when haunting mode is disabled', () => {
    const { container } = render(
      <CRTFrame 
        effects={{ scanlines: true, curvature: true, noise: true, glitch: false }}
        hauntingMode={false}
      >
        <div>Test</div>
      </CRTFrame>
    );

    const hauntingFrame = container.querySelector('.crt-frame.haunting');
    expect(hauntingFrame).not.toBeInTheDocument();
    
    const hauntingScreen = container.querySelector('.crt-screen.haunting-screen');
    expect(hauntingScreen).not.toBeInTheDocument();
  });
});
